import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { en } from "@/content/en";
import { cmsDefaults } from "@/lib/cms/apply";
import { CMS_TAG } from "@/lib/cms/read";

/*
  For the admin, which is its own deployment (see the admin's README). GET returns the defaults
  from code that the admin forms start from; POST, sent after every save, refreshes the pages.
  Both need `Authorization: Bearer CMS_SECRET`.
*/

function authorised(request: NextRequest) {
  const secret = process.env.CMS_SECRET;
  if (!secret || secret.length < 32) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) return new Response("Unauthorized", { status: 401 });
  // The deploy these defaults come from, so the admin's History can say which code change made them
  const build = {
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
    message: (process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "").split("\n")[0].slice(0, 200),
    author: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || "",
  };
  return Response.json(cmsDefaults(en), { headers: { "x-cms-build": encodeURIComponent(JSON.stringify(build)) } });
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return new Response("Unauthorized", { status: 401 });
  // expire 0: the editor expects to see the save on their next visit, not a stale page
  revalidateTag(CMS_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
