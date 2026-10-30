import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { readSessionToken, SESSION_COOKIE } from "@/lib/cms/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  // The admin has no locale. Every page but the login needs a valid session; each page and
  // Server Action checks it again (requireSession), this just sends visitors to the login first.
  if (first === "admin") {
    if (pathname === "/admin/login") return;
    if (await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return;
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (hasLocale(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)"],
};
