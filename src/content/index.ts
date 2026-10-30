import type { Locale } from "@/i18n/config";
import { applyCms } from "@/lib/cms/apply";
import { getCmsDocs } from "@/lib/cms/read";
import { en } from "./en";
import type { Content } from "./types";

const dictionaries: Record<Locale, Content> = { en };

/** Site content: the copy in code, with what the team saved in /admin merged over it. */
export async function getContent(lang: Locale): Promise<Content> {
  return applyCms(dictionaries[lang], await getCmsDocs());
}

export type { Content } from "./types";
