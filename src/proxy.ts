import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { GATED_PATH, LEAD_COOKIE, legacyGateCookie, legacyUnlocked, readLead } from "@/lib/gate";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (hasLocale(first)) {
    // An industry portfolio opens only for a known lead (src/lib/gate.ts). Without one, back to
    // the industry page, which opens the enquiry form (?work=locked).
    const gated = pathname.match(GATED_PATH);
    if (
      gated &&
      !readLead(request.cookies.get(LEAD_COOKIE)?.value) &&
      !legacyUnlocked(gated[2], request.cookies.get(legacyGateCookie(gated[2]))?.value)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/${gated[1]}/industries/${gated[2]}`;
      url.search = "?work=locked";
      return NextResponse.redirect(url);
    }
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)"],
};
