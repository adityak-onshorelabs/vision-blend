import { cacheLife, cacheTag } from "next/cache";
import { parseDocs } from "./apply";
import { readDocs } from "./db";

/** Every admin save calls POST /api/cms, which revalidates CMS_TAG, so the site shows it on the next request. */
export const CMS_TAG = "cms";

/** What the team saved in the admin, cached until the next save. */
export async function getCmsDocs() {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("max");
  return parseDocs(await readDocs());
}
