import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

const paths = ["", "/work", "/services", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((lang) =>
    paths.map((p) => ({ url: `${siteUrl}/${lang}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
  );
}
