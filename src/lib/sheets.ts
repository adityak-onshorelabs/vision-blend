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
/** Ask the script to email the saved row (and the file, attached) */
export type SheetNotify = { to: string; subject: string; replyTo?: string };

export const sheetsConfigured = () => !!(process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_WEBHOOK_SECRET);

const now = () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

/** Appends one row (and sends `notify` from the sheet); true once the script confirms the row. Never throws. */
export function saveToSheet(kind: EnquiryKind, row: [string, string][], file?: SheetFile, notify?: SheetNotify): Promise<boolean> {
  return post({ tab: SHEET_TABS[kind], row: [["Received", now()], ...row], file, notify });
}

/**
 * A known lead opened another industry's portfolio: the script adds the industry to that lead's
 * existing row (matched by email, latest first, on Portfolio access then Enquiries) instead of a
 * new row, so there is one lead per person. `row` is the fallback when no row matches.
 */
export function recordIndustry(email: string, industry: string, row: [string, string][]): Promise<boolean> {
  return post({
    action: "industry",
    email,
    industry,
    when: now(),
    tabs: [SHEET_TABS.portfolio, SHEET_TABS.project],
    fallback: { tab: SHEET_TABS.portfolio, row: [["Received", now()], ...row] },
  });
}

async function post(payload: object): Promise<boolean> {
  const { SHEETS_WEBHOOK_URL: url, SHEETS_WEBHOOK_SECRET: secret } = process.env;
  if (!url || !secret) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, ...payload }),
      // Apps Script answers with a redirect to the result; fetch follows it
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const text = await res.text();
    let out: { ok?: boolean; error?: string; mailed?: boolean | null } = {};
    try {
      out = JSON.parse(text);
    } catch {}
    if (!res.ok || out.ok !== true) {
      console.error("[sheets] write failed", res.status, out.error ?? text.slice(0, 200));
      return false;
    }
    if (out.mailed === false) console.error("[sheets] row saved, but the email notice failed");
    return true;
  } catch (err) {
    console.error("[sheets] request failed", err);
    return false;
  }
}
