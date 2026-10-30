// The public address for canonical links, the sitemap and link previews. NEXT_PUBLIC_SITE_URL is
// the real domain once it is connected; until then Vercel's production URL, so WhatsApp and other
// link previews can actually fetch og:image (an unconnected domain shows no preview).
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelProduction ? `https://${vercelProduction}` : "https://www.visionblend.in")
).replace(/\/$/, "");

export function href(lang: string, path = "") {
  return `/${lang}${path}`;
}
