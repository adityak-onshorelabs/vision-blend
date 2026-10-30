import { en } from "@/content/en";
import { cmsDefaults, parseDocs } from "./apply";
import { readDocs } from "./db";
import type { Docs } from "./schema";

/** Current values for the admin forms: saved documents over the defaults from code (uncached). */
export async function loadDocs(): Promise<Docs> {
  return { ...cmsDefaults(en), ...parseDocs(await readDocs()) };
}
