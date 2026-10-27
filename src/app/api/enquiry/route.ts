import { NextResponse } from "next/server";
import { enquirySchema, type Enquiry } from "@/lib/enquiry";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function emailHtml(e: Enquiry) {
  const rows: [string, string][] = [
    ["Needs", e.needs.join(", ")],
    ["Start", e.when],
    ["Name", e.name],
    ["Brand", e.brand],
    ["Company", e.company],
    ["Email", e.email],
    ["Phone", e.phone],
    ["About the brand", e.about],
  ];
  return `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#6f6a66;vertical-align:top">${k}</td><td>${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend success and drop it.
  if (json && typeof json === "object" && "website" in json && (json as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
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
      subject: `New brief: ${enquiry.brand} (${enquiry.company}), ${enquiry.needs.join(", ")}`,
      html: emailHtml(enquiry),
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] Resend failed", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
