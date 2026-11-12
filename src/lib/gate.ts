import { createHmac, timingSafeEqual } from "node:crypto";

/*
  The portfolio gate. An industry's portfolio (/<lang>/industries/<slug>/work) opens only after an
  enquiry for that industry has been delivered: /api/enquiry then sets a signed cookie for that
  industry, and the proxy (src/proxy.ts) turns away any request for the page without one. So direct
  links, prefetches and client navigations are all gated, not just the button.

  - One cookie per industry: a new industry needs a fresh enquiry.
  - Session cookie (no expiry): it lasts until the browser session ends.
  - Signed with HMAC, so it cannot be made by hand. It is readable by script (not httpOnly) only so
    the "See our work" button can skip the form when this session already unlocked the industry;
    the proxy still checks the signature.
*/

const SECRET =
  process.env.GATE_SECRET ||
  process.env.CMS_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "development-only-portfolio-gate");

if (!SECRET) console.error("[gate] GATE_SECRET (or CMS_SECRET) missing: industry portfolios cannot be unlocked");

export const gateCookie = (slug: string) => `vb_work_${slug}`;

const sign = (slug: string) => createHmac("sha256", SECRET).update(`portfolio:${slug}`).digest("base64url");

/** The cookie value that unlocks this industry, or null when the gate has no secret to sign with */
export function gateToken(slug: string) {
  return SECRET ? sign(slug) : null;
}

export function isUnlocked(slug: string, value: string | undefined) {
  if (!SECRET || !value) return false;
  const expected = Buffer.from(sign(slug));
  const given = Buffer.from(value);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** /<lang>/industries/<slug>/work, with or without a trailing slash */
export const GATED_PATH = /^\/([^/]+)\/industries\/([a-z0-9-]+)\/work\/?$/;
