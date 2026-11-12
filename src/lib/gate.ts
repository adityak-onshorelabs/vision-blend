import { createHmac, timingSafeEqual } from "node:crypto";

/*
  The portfolio gate, and how the site recognises someone who has already enquired (final changes,
  12 Nov 2026).

  Industry portfolios (/<lang>/industries/<slug>/work) open only for a known lead. Once a business
  enquiry (project or portfolio) has been saved, /api/enquiry sets a signed lead cookie that holds
  the visitor's details. From then on, in the same browser, every industry's portfolio opens
  without another form: the "See our work" button goes straight through, and the work page records
  the new industry against the existing lead (/api/portfolio/visit) instead of creating another.
  The proxy (src/proxy.ts) turns away any request for a portfolio without a valid cookie, so direct
  links, prefetches and client navigations are all gated, not just the button.

  - vb_lead: the details and an HMAC signature, httpOnly (it carries personal details), kept for
    a year. Cancelled forms, failed saves and validation errors never set it.
  - vb_known: a plain "1" with the same lifetime, readable by script only so the button knows it
    can skip the form. It unlocks nothing; the proxy checks vb_lead.
  - Recognition is per browser. Another browser or device needs an identity mechanism (sign-in or
    an emailed link), which the site does not have.
  - Session cookies from the earlier per-industry gate (vb_work_<slug>) are still honoured for
    their own industry until the browser closes.
*/

const SECRET =
  process.env.GATE_SECRET ||
  process.env.CMS_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "development-only-portfolio-gate");

if (!SECRET) console.error("[gate] GATE_SECRET (or CMS_SECRET) missing: industry portfolios cannot be unlocked");

export const LEAD_COOKIE = "vb_lead";
export const KNOWN_COOKIE = "vb_known";
export const LEAD_MAX_AGE = 60 * 60 * 24 * 365;
/** The earlier per-industry session cookie */
export const legacyGateCookie = (slug: string) => `vb_work_${slug}`;

export type Lead = { name: string; email: string; phone: string; business: string };

const hmac = (data: string) => createHmac("sha256", SECRET).update(data).digest("base64url");

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** The lead cookie's value, or null when the gate has no secret to sign with */
export function leadToken(lead: Lead) {
  if (!SECRET) return null;
  const body = Buffer.from(JSON.stringify(lead)).toString("base64url");
  return `${body}.${hmac(`lead:${body}`)}`;
}

/** The lead in a cookie value, if the signature holds */
export function readLead(value: string | undefined): Lead | null {
  if (!SECRET || !value) return null;
  const dot = value.lastIndexOf(".");
  if (dot < 1) return null;
  const body = value.slice(0, dot);
  if (!same(value.slice(dot + 1), hmac(`lead:${body}`))) return null;
  try {
    const lead = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Lead;
    return typeof lead?.email === "string" ? lead : null;
  } catch {
    return null;
  }
}

/** An industry cookie from the earlier gate, for that industry only */
export function legacyUnlocked(slug: string, value: string | undefined) {
  return !!SECRET && !!value && same(value, hmac(`portfolio:${slug}`));
}

/** /<lang>/industries/<slug>/work, with or without a trailing slash */
export const GATED_PATH = /^\/([^/]+)\/industries\/([a-z0-9-]+)\/work\/?$/;
