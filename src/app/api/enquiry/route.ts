import { NextResponse } from "next/server";
import { getContent } from "@/content";
import { defaultLocale } from "@/i18n/config";
import { CV_MAX_BYTES, CV_TYPES, enquirySchema, type Enquiry, type EnquiryKind } from "@/lib/enquiry";
import { gateCookie, gateToken } from "@/lib/gate";

/*
  Every form on the site lands here (see src/lib/enquiry.ts for the kinds). The enquiry is emailed to
  the studio through Resend; it counts as saved only once Resend accepts it, and only then does a
  portfolio enquiry unlock that industry's work (src/lib/gate.ts).

  Recipients: ENQUIRY_TO, or per kind PORTFOLIO_TO, PARTNERS_TO, CAREERS_TO when set (the studio is
  still confirming which inbox each should reach).
*/

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

type Attachment = { filename: string; content: string };

function rowsOf(e: Enquiry, industry?: string): [string, string][] {
  switch (e.kind) {
    case "project":
    case "portfolio":
      return [
        ["Industry", industry ?? ""],
        ["Name", e.name],
        ["Business", e.business],
        ["Email", e.email],
        ["Phone", e.phone],
        ["About the project", e.about],
      ];
    case "partner":
      return [
        ["Partnership", e.type],
        ["Name", e.name],
        ["Company / agency", e.company],
        ["Email", e.email],
        ["Phone", e.phone],
        ["The opportunity", e.about],
      ];
    case "careers":
      return [
        ["Discipline", e.discipline],
        ["Opportunity", e.opportunity],
        ["Name", e.name],
        ["City", e.city],
        ["Email", e.email],
        ["Phone", e.phone],
        ["Portfolio", e.portfolio],
        ["CV", "Attached"],
      ];
  }
}

function subjectOf(e: Enquiry, industry?: string) {
  switch (e.kind) {
    case "project":
      return `New enquiry: ${e.business}${industry ? `, ${industry}` : ""}`;
    case "portfolio":
      return `Portfolio enquiry (${industry}): ${e.business}`;
    case "partner":
      return `Partnership enquiry (${e.type}): ${e.company}`;
    case "careers":
      return `Application (${e.discipline}, ${e.opportunity}): ${e.name}`;
  }
}

const emailHtml = (rows: [string, string][]) =>
  `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#6f6a66;vertical-align:top">${k}</td><td>${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

const RECIPIENT_ENV: Record<EnquiryKind, string | undefined> = {
  project: undefined,
  portfolio: "PORTFOLIO_TO",
  partner: "PARTNERS_TO",
  careers: "CAREERS_TO",
};

// Development falls back to Cloudflare's always-pass test secret. Without a secret the check is
// skipped and the honeypot and timing checks carry on alone.
const TURNSTILE_SECRET =
  process.env.TURNSTILE_SECRET_KEY || (process.env.NODE_ENV === "development" ? "1x0000000000000000000000000000000AA" : "");

/** Even with autofill, nobody sends one of these forms in under two seconds. */
const MIN_ELAPSED_MS = 2000;

async function isHuman(token: unknown, ip: string | null) {
  if (!TURNSTILE_SECRET) {
    console.warn("[enquiry] TURNSTILE_SECRET_KEY missing, skipping the human check");
    return true;
  }
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const out = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!out.success) console.warn("[enquiry] Turnstile rejected", out["error-codes"]);
    return out.success === true;
  } catch (err) {
    console.error("[enquiry] Turnstile siteverify failed", err);
    return false;
  }
}

const fail = (error: string, status: number, extra?: object) => NextResponse.json({ ok: false, error, ...extra }, { status });

/** The request as plain fields, plus the CV when it is a multipart application */
async function readRequest(request: Request): Promise<{ fields: Record<string, unknown>; cv?: File } | null> {
  const type = request.headers.get("content-type") ?? "";
  try {
    if (type.includes("multipart/form-data")) {
      const form = await request.formData();
      const fields: Record<string, unknown> = {};
      let cv: File | undefined;
      for (const [k, v] of form) {
        if (k === "cv" && typeof v !== "string") cv = v;
        else if (typeof v === "string") fields[k] = k === "elapsed" ? Number(v) : v;
      }
      return { fields, cv };
    }
    const json: unknown = await request.json();
    return json && typeof json === "object" ? { fields: json as Record<string, unknown> } : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const read = await readRequest(request);
  if (!read) return fail("Invalid request", 400);
  const { fields, cv } = read;

  // Honeypot and timing: bots fill every field, and fast. Pretend success and drop it.
  if (fields.website || !(typeof fields.elapsed === "number" && fields.elapsed >= MIN_ELAPSED_MS)) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  if (!(await isHuman(fields.turnstile, ip))) return fail("Human check failed", 403);

  const parsed = enquirySchema.safeParse(fields);
  if (!parsed.success) return fail("Invalid enquiry", 422, { issues: parsed.error.issues.map((i) => i.path.join(".")) });
  const enquiry = parsed.data;

  // The industry's name for the email, and a check that the portfolio exists
  let industry: string | undefined;
  if ((enquiry.kind === "project" || enquiry.kind === "portfolio") && enquiry.industry) {
    const found = (await getContent(defaultLocale)).industries.find((s) => s.slug === enquiry.industry);
    if (enquiry.kind === "portfolio" && !found?.detail?.work) return fail("Unknown portfolio", 422, { issues: ["industry"] });
    industry = found?.name;
  }

  const attachments: Attachment[] = [];
  if (enquiry.kind === "careers") {
    const ext = cv && CV_TYPES[cv.type];
    if (!cv || !ext) return fail("Add a CV as a PDF or Word file", 422, { issues: ["cv"] });
    if (cv.size > CV_MAX_BYTES) return fail("The CV is too large", 413, { issues: ["cv"] });
    const safeName = enquiry.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "applicant";
    attachments.push({ filename: `CV-${safeName}.${ext}`, content: Buffer.from(await cv.arrayBuffer()).toString("base64") });
  }

  const { RESEND_API_KEY, ENQUIRY_FROM } = process.env;
  const envKey = RECIPIENT_ENV[enquiry.kind];
  const to = (envKey && process.env[envKey]) || process.env.ENQUIRY_TO;

  if (!RESEND_API_KEY || !to || !ENQUIRY_FROM) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[enquiry] email not configured, logging instead:", JSON.stringify({ ...enquiry, cv: cv?.name }));
      return unlock(NextResponse.json({ ok: true, delivered: false }), enquiry);
    }
    console.error("[enquiry] RESEND_API_KEY, ENQUIRY_TO or ENQUIRY_FROM missing");
    return fail("Enquiries are not configured", 503);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: ENQUIRY_FROM,
      to: to.split(",").map((s) => s.trim()),
      reply_to: enquiry.email,
      subject: subjectOf(enquiry, industry),
      html: emailHtml(rowsOf(enquiry, industry)),
      ...(attachments.length ? { attachments } : {}),
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] Resend failed", res.status, await res.text());
    return fail("Delivery failed", 502);
  }
  return unlock(NextResponse.json({ ok: true, delivered: true }), enquiry);
}

/** A delivered portfolio enquiry opens that industry's work for the rest of the session */
function unlock(res: NextResponse, enquiry: Enquiry) {
  if (enquiry.kind !== "portfolio") return res;
  const token = gateToken(enquiry.industry);
  if (!token) return fail("Portfolio access is not configured", 503);
  res.cookies.set(gateCookie(enquiry.industry), token, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
