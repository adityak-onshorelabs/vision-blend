import { NextResponse } from "next/server";
import { getContent } from "@/content";
import { defaultLocale } from "@/i18n/config";
import { CAREERS_CONTACT, CV_MAX_BYTES, CV_TYPES, enquirySchema, type Enquiry, type EnquiryKind } from "@/lib/enquiry";
import { KNOWN_COOKIE, LEAD_COOKIE, LEAD_MAX_AGE, leadToken } from "@/lib/gate";
import { saveToSheet, sheetsConfigured, type SheetFile } from "@/lib/sheets";

/*
  Every form on the site lands here (see src/lib/enquiry.ts for the kinds). Each enquiry goes to the
  studio's Google Sheet (src/lib/sheets.ts) and, when Resend is set up, by email as well. Until then,
  Careers applications are emailed to HR by the sheet itself (with the CV attached). It counts as
  saved once either accepts it, and only then is a business enquiry (project or portfolio)
  remembered as a lead, which opens every industry's portfolio in this browser (src/lib/gate.ts).

  Recipients: ENQUIRY_TO, or per kind PORTFOLIO_TO, PARTNERS_TO, CAREERS_TO when set. Careers
  applications, with the CV attached, always go to HR (CAREERS_CONTACT in src/lib/enquiry.ts), plus CAREERS_TO when set
  (final changes, 12 Nov 2026).
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
  let sheetFile: SheetFile | undefined;
  if (enquiry.kind === "careers") {
    const ext = cv && CV_TYPES[cv.type];
    if (!cv || !ext) return fail("Add a CV as a PDF or Word file", 422, { issues: ["cv"] });
    if (cv.size > CV_MAX_BYTES) return fail("The CV is too large", 413, { issues: ["cv"] });
    const safeName = enquiry.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "applicant";
    const filename = `CV-${safeName}.${ext}`;
    const content = Buffer.from(await cv.arrayBuffer()).toString("base64");
    attachments.push({ filename, content });
    sheetFile = { name: filename, type: cv.type, base64: content };
  }

  const rows = rowsOf(enquiry, industry);
  const { RESEND_API_KEY, ENQUIRY_FROM } = process.env;
  const envKey = RECIPIENT_ENV[enquiry.kind];
  const kindTo = envKey ? process.env[envKey] : undefined;
  // Careers always reaches HR; CAREERS_TO can only add inboxes
  const to = enquiry.kind === "careers" ? [CAREERS_CONTACT.email, kindTo].filter(Boolean).join(",") : kindTo || process.env.ENQUIRY_TO;
  const emailConfigured = !!(RESEND_API_KEY && to && ENQUIRY_FROM);

  // Delivery is bypassed until the studio's sheet or Resend is set up: the enquiry is logged (Vercel
  // function logs in production) and the visitor sees it as sent.
  if (!emailConfigured && !sheetsConfigured()) {
    console.warn("[enquiry] no sheet or email configured, logging instead:", JSON.stringify({ ...enquiry, cv: cv?.name }));
    return unlock(NextResponse.json({ ok: true, delivered: false }), enquiry);
  }

  const sendEmail = async () => {
    if (!emailConfigured) return false;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: ENQUIRY_FROM,
          to: to!.split(",").map((s) => s.trim()),
          reply_to: enquiry.email,
          subject: subjectOf(enquiry, industry),
          html: emailHtml(rows),
          ...(attachments.length ? { attachments } : {}),
        }),
      });
      if (!res.ok) console.error("[enquiry] Resend failed", res.status, await res.text());
      return res.ok;
    } catch (err) {
      console.error("[enquiry] Resend request failed", err);
      return false;
    }
  };

  // The sheet keeps the CV as a Drive link rather than "Attached"
  const sheetRows = rows.filter(([k]) => k !== "CV");
  // Without Resend, the sheet emails HR the application itself (with the CV attached)
  const notify = enquiry.kind === "careers" && !emailConfigured ? { to: to!, subject: subjectOf(enquiry), replyTo: enquiry.email } : undefined;
  const [sheeted, emailed] = await Promise.all([saveToSheet(enquiry.kind, sheetRows, sheetFile, notify), sendEmail()]);
  if (!sheeted && !emailed) return fail("Delivery failed", 502);
  return unlock(NextResponse.json({ ok: true, delivered: true, sheet: sheeted, email: emailed }), enquiry);
}

/** A saved business enquiry makes the visitor a known lead in this browser (src/lib/gate.ts) */
function unlock(res: NextResponse, enquiry: Enquiry) {
  if (enquiry.kind !== "project" && enquiry.kind !== "portfolio") return res;
  const { name, email, phone, business } = enquiry;
  const token = leadToken({ name, email: email.toLowerCase(), phone, business });
  if (!token) {
    // The enquiry is saved either way; only a portfolio enquiry needs the cookie to go on
    if (enquiry.kind === "portfolio") return fail("Portfolio access is not configured", 503);
    return res;
  }
  const options = { path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: LEAD_MAX_AGE } as const;
  res.cookies.set(LEAD_COOKIE, token, { ...options, httpOnly: true });
  res.cookies.set(KNOWN_COOKIE, "1", options);
  return res;
}
