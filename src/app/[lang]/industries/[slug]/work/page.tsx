import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkGallery } from "@/components/site/work-gallery";
import { getContent } from "@/content";
import { hasLocale, locales } from "@/i18n/config";
import { hl, plain } from "@/lib/highlight";
import { industryContactHref } from "@/lib/industry-enquiry";
import { siteUrl } from "@/lib/site";

/*
  An industry's portfolio subpage (/industries/<slug>/work), for industries whose detail has
  `work`. A short head, the pieces (each opening in a lightbox that plays the full piece from
  Google Drive), then the way back to the industry page and into an enquiry.
*/

type Params = PageProps<"/[lang]/industries/[slug]/work">["params"];

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (lang) => ({ lang, c: await getContent(lang) })));
  return all.flatMap(({ lang, c }) => c.industries.filter((s) => s.detail?.work).map((s) => ({ lang, slug: s.slug })));
}

async function load(params: Params) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return null;
  const c = await getContent(lang);
  const industry = c.industries.find((s) => s.slug === slug);
  const work = industry?.detail?.work;
  if (!industry || !work) return null;
  return { lang, c, industry, work };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/industries/[slug]/work">): Promise<Metadata> {
  const d = await load(params);
  if (!d) return {};
  const url = `${siteUrl}/${d.lang}/industries/${d.industry.slug}/work`;
  const title = `${plain(d.work.title)} | ${d.c.company.name}`;
  return {
    title: { absolute: title },
    description: d.work.lead,
    alternates: { canonical: url },
    openGraph: { title, description: d.work.lead, url },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function IndustryWorkPage({ params }: PageProps<"/[lang]/industries/[slug]/work">) {
  const d = await load(params);
  if (!d) notFound();
  const { lang, c, industry: s, work } = d;
  const back = `/${lang}/industries/${s.slug}`;

  return (
    <>
      <section className="band" aria-labelledby="work-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{s.name} &middot; Work</span>
            <Link href={back} className="t-label u shrink-0 whitespace-nowrap">
              &larr; {s.name}
            </Link>
          </div>
          <div className="mb-[clamp(40px,5vw,72px)] grid items-end gap-6 lg:grid-cols-12">
            <h1 id="work-title" className="t-h1 max-w-[14ch] lg:col-span-8">
              {hl(work.title)}
              <span className="stop">.</span>
            </h1>
            <div className="grid gap-3 lg:col-span-4">
              <p className="t-lead text-muted-foreground">{work.lead}</p>
              <span className="t-label">{pad(work.items.length)} pieces</span>
            </div>
          </div>

          <WorkGallery items={work.items} />
        </div>
      </section>

      <section className="band" aria-labelledby="work-next-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Start a project</span>
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
            <h2 id="work-next-title" className="t-h1 max-w-[16ch] lg:col-span-7">
              {hl(s.detail?.cta?.title ?? `Have a brief for *${s.name}*`)}
              <span className="stop">.</span>
            </h2>
            <div className="flex flex-wrap gap-3 lg:col-span-5">
              <Link href={industryContactHref(lang, s)} className="cta">
                {s.detail?.cta?.primary ?? c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
              </Link>
              <Link href={back} className="cta cta-line">
                What we make for {s.name} <span className="arr" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
