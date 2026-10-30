import { NextResponse } from "next/server";
import { enquirySchema, type Enquiry } from "@/lib/enquiry";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function emailHtml(e: Enquiry) {
  const rows: [string, string][] = [
    ["Needs", e.needs.join(", ")],
    ["Start", e.when],
    ["Name", e.name],
    ["Brand or company", e.brand],
    ["Email", e.email],
    ["Phone", e.phone],
    ["About the brand", e.about],
  ];
  return `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#6f6a66;vertical-align:top">${k}</td><td>${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;
}

// Development falls back to Cloudflare's always-pass test secret. Without a secret the check is
// skipped and the honeypot and timing checks carry on alone.
const TURNSTILE_SECRET =
  process.env.TURNSTILE_SECRET_KEY || (process.env.NODE_ENV === "development" ? "1x0000000000000000000000000000000AA" : "");

/** No one fills three steps in under three seconds. */
const MIN_ELAPSED_MS = 3000;

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

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const raw = (json && typeof json === "object" ? json : {}) as { website?: unknown; elapsed?: unknown; turnstile?: unknown };

  // Honeypot and timing: bots fill every field, and fast. Pretend success and drop it.
  if (raw.website || !(typeof raw.elapsed === "number" && raw.elapsed >= MIN_ELAPSED_MS)) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  if (!(await isHuman(raw.turnstile, ip))) {
    return NextResponse.json({ ok: false, error: "Human check failed" }, { status: 403 });
  }

  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid enquiry", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  }
  const enquiry = parsed.data;

  const { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[enquiry] email not configured, logging instead:", JSON.stringify(enquiry));
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[enquiry] RESEND_API_KEY, ENQUIRY_TO or ENQUIRY_FROM missing");
    return NextResponse.json({ ok: false, error: "Enquiries are not configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: ENQUIRY_FROM,
      to: ENQUIRY_TO.split(",").map((s) => s.trim()),
      reply_to: enquiry.email,
      subject: `New brief: ${enquiry.brand}, ${enquiry.needs.join(", ")}`,
      html: emailHtml(enquiry),
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] Resend failed", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
