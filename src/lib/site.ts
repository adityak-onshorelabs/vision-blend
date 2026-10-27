export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.visionblend.in").replace(/\/$/, "");

export function href(lang: string, path = "") {
  return `/${lang}${path}`;
}
