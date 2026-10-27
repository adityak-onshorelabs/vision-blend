import type { Locale } from "@/i18n/config";
import { en } from "./en";
import type { Content } from "./types";

const dictionaries: Record<Locale, Content> = { en };

export function getContent(lang: Locale): Content {
  return dictionaries[lang];
}

export type { Content } from "./types";
