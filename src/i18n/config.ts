export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeDir: Record<Locale, "ltr" | "rtl"> = { en: "ltr" };

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
