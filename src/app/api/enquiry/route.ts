import { NextResponse } from "next/server";
import { getContent } from "@/content";
import { defaultLocale } from "@/i18n/config";
import { CV_MAX_BYTES, CV_TYPES, enquirySchema, type Enquiry } from "@/lib/enquiry";
import { KNOWN_COOKIE, LEAD_COOKIE, LEAD_MAX_AGE, leadToken } from "@/lib/gate";
import { saveToSheet, sheetsConfigured, type SheetFile } from "@/lib/sheets";

/*
  Every form on the site lands here (see src/lib/enquiry.ts for the kinds) and goes to the studio's
  Google Sheet only (src/lib/sheets.ts), one tab per form, with a careers CV filed in Drive and
  linked in its row. No email is sent. Only once the sheet has saved it is a business enquiry
  (project or portfolio) remembered as a lead, which opens every industry's portfolio in this
  browser (src/lib/gate.ts).
*/

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
      ];
  }
}

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
    industry = found?.name ?? (enquiry.industry === "other" ? "Other / not sure yet" : undefined);
  }

  let sheetFile: SheetFile | undefined;
  if (enquiry.kind === "careers") {
    const ext = cv && CV_TYPES[cv.type];
    if (!cv || !ext) return fail("Add a CV as a PDF or Word file", 422, { issues: ["cv"] });
    if (cv.size > CV_MAX_BYTES) return fail("The CV is too large", 413, { issues: ["cv"] });
    const safeName = enquiry.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "applicant";
    const filename = `CV-${safeName}.${ext}`;
    const content = Buffer.from(await cv.arrayBuffer()).toString("base64");
    sheetFile = { name: filename, type: cv.type, base64: content };
  }

  const rows = rowsOf(enquiry, industry);

  // Until the sheet's web app is connected (SHEETS_WEBHOOK_URL/SECRET), the enquiry is only logged
  // (Vercel function logs in production) and the visitor sees it as sent.
  if (!sheetsConfigured()) {
    console.warn("[enquiry] sheet not configured, logging instead:", JSON.stringify({ ...enquiry, cv: cv?.name }));
    return unlock(NextResponse.json({ ok: true, delivered: false }), enquiry);
  }

  if (!(await saveToSheet(enquiry.kind, rows, sheetFile))) return fail("Delivery failed", 502);
  return unlock(NextResponse.json({ ok: true, delivered: true }), enquiry);
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
