import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

// Industry portfolios are gated behind an enquiry, so they are not listed
const paths = ["", "/industries", "/about", "/contact", "/careers", "/partners"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLocale = await Promise.all(
    locales.map(async (lang) => {
      const c = await getContent(lang);
      const all = [
        ...paths,
        ...c.industries.map((s) => `/industries/${s.slug}`),
      ];
      return all.map((p) => ({ url: `${siteUrl}/${lang}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 }));
    }),
  );
  return perLocale.flat();
}
