import { NextResponse, type NextRequest } from "next/server";
import { getContent } from "@/content";
import { defaultLocale } from "@/i18n/config";
import { LEAD_COOKIE, readLead } from "@/lib/gate";
import { recordIndustry } from "@/lib/sheets";

/*
  A known lead opened an industry's portfolio (sent once per industry per browser by
  portfolio-visit.tsx on the work page). The industry is added to that lead's existing row in the
  sheet, so exploring another industry never asks for another form or makes a duplicate lead
  (src/lib/gate.ts). Recording is best effort: the portfolio is already open either way.
*/

export async function POST(request: NextRequest) {
  const lead = readLead(request.cookies.get(LEAD_COOKIE)?.value);
  if (!lead) return NextResponse.json({ ok: false, error: "Not a known lead" }, { status: 401 });

  let slug: unknown;
  try {
    slug = ((await request.json()) as { industry?: unknown }).industry;
  } catch {}
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,60}$/.test(slug)) return NextResponse.json({ ok: false, error: "Invalid industry" }, { status: 422 });
  const industry = (await getContent(defaultLocale)).industries.find((s) => s.slug === slug && s.detail?.work);
  if (!industry) return NextResponse.json({ ok: false, error: "Unknown portfolio" }, { status: 422 });

  const recorded = await recordIndustry(lead.email, industry.name, [
    ["Industry", industry.name],
    ["Name", lead.name],
    ["Business", lead.business],
    ["Email", lead.email],
    ["Phone", lead.phone],
  ]);
  if (!recorded && process.env.NODE_ENV !== "production") console.log("[portfolio] visit (sheet not written):", lead.email, industry.name);
  return NextResponse.json({ ok: true, recorded });
}
