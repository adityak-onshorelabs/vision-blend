import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryCard } from "@/components/site/industry-card";
import { ProcessRail } from "@/components/site/process-rail";
import { Reveal } from "@/components/site/reveal";
import { SectionHead } from "@/components/site/section-head";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/industries">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.industriesPage.metaTitle, description: c.industriesPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/industries` } };
}

export default async function IndustriesPage({ params }: PageProps<"/[lang]/industries">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const total = c.industries.length;

  return (
    <>
      <section className="band" aria-labelledby="industries-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Industries</span>
            <span className="count">
              <b>{String(total).padStart(2, "0")}</b> Industries
            </span>
          </div>

          <div className="mb-[clamp(40px,5vw,72px)] grid items-end gap-6 md:grid-cols-12">
            <h1 id="industries-title" className="t-h1 md:col-span-8">
              {hl(c.industriesPage.title)}
              <span className="stop">.</span>
            </h1>
            <p className="t-lead text-muted-foreground md:col-span-4">{c.industriesPage.lead}</p>
          </div>

          {/* Each card is a preview of that industry's own page. Four sit two by two; five run two large, then three. */}
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5" aria-label="Industry pages">
            {c.industries.map((s, i) => (
              <Reveal
                as="li"
                key={s.slug}
                delay={(i % 3) * 0.06}
                className={cn("grid", i < 2 || total === 4 ? "lg:col-span-3" : "lg:col-span-2", i === total - 1 && total % 2 === 1 && "md:col-span-2 lg:col-span-2")}
              >
                <IndustryCard industry={s} lang={lang} index={i} total={total} size={i < 2 || total === 4 ? "lg" : "md"} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band-tint" aria-labelledby="process-title">
        <div className="frame">
          <SectionHead id="process-title" label={c.home.process.label} title={c.home.process.title} text={c.home.process.text} />
          <ProcessRail steps={c.process} />
          <Link href={`/${lang}/contact`} className="cta mt-16">
            {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
