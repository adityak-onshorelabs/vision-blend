import { cacheLife, cacheTag } from "next/cache";
import { parseDocs } from "./apply";
import { readDocs } from "./db";

/** Every admin save calls updateTag(CMS_TAG), so the public site shows it on the next request. */
export const CMS_TAG = "cms";

/** What the team saved in /admin, cached until the next save. */
export async function getCmsDocs() {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("max");
  return parseDocs(await readDocs());
}
