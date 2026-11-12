import type { EnquiryKind } from "./enquiry";

/*
  Every form also lands as a row in the studio's Google Sheet, one tab per form. The sheet runs a
  small Apps Script web app (scripts/google-sheets/Code.gs, set up as described there) that appends
  the row, creates the tab and its headers the first time, and files a careers CV in Drive with a
  link in the row.

  SHEETS_WEBHOOK_URL    the web app's /exec URL
  SHEETS_WEBHOOK_SECRET the same value as the script's SECRET property, so only this site can write
*/

export const SHEET_TABS: Record<EnquiryKind, string> = {
  project: "Enquiries",
  portfolio: "Portfolio access",
  partner: "Partners",
  careers: "Careers",
};

export type SheetFile = { name: string; type: string; base64: string };

export const sheetsConfigured = () => !!(process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_WEBHOOK_SECRET);

/** Appends one row; true once the script confirms it. Never throws. */
export async function saveToSheet(kind: EnquiryKind, row: [string, string][], file?: SheetFile): Promise<boolean> {
  const { SHEETS_WEBHOOK_URL: url, SHEETS_WEBHOOK_SECRET: secret } = process.env;
  if (!url || !secret) return false;
  const received = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, tab: SHEET_TABS[kind], row: [["Received", received], ...row], file }),
      // Apps Script answers with a redirect to the result; fetch follows it
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const text = await res.text();
    let out: { ok?: boolean; error?: string } = {};
    try {
      out = JSON.parse(text);
    } catch {}
    if (!res.ok || out.ok !== true) {
      console.error("[sheets] append failed", res.status, out.error ?? text.slice(0, 200));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[sheets] request failed", err);
    return false;
  }
}
