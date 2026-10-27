import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeriesLinks } from "@/components/site/series-links";
import { ProjectArt } from "@/components/site/project-art";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, Tbc } from "@/components/site/section-head";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getContent(lang);
  return { title: c.workPage.metaTitle, description: c.workPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/work` } };
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);
  const total = c.projects.length;

  return (
    <>
      <section className="band" aria-labelledby="work-title">
        <div className="frame">
          <SectionHead as="h1" id="work-title" label="Work" title={c.workPage.title} text={c.workPage.lead} />
          <ol className="grid gap-[clamp(56px,7vw,104px)]">
            {c.projects.map((p, i) => (
              <Reveal as="li" key={p.slug}>
                <article id={p.slug} aria-labelledby={`${p.slug}-t`} className="group grid scroll-mt-24 gap-6 border-t border-border pt-6 lg:grid-cols-12">
                  <div className="flex items-baseline justify-between gap-4 lg:col-span-12">
                    <span className="t-label">
                      <b className="font-medium text-ink">{String(i + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")} &nbsp; {p.category}
                    </span>
                    <span className="text-[0.88rem] text-muted-foreground">{p.date}</span>
                  </div>
                  <div className="relative grid aspect-[3/2] place-items-center overflow-hidden bg-tint text-ink lg:col-span-7">
                    <ProjectArt
                      slug={p.slug}
                      label={`${c.ui.placeholderImage}: ${p.name}`}
                      className="h-[86%] w-auto transition-transform duration-[1200ms] ease-[var(--ease)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-3 start-3 bg-paper/90 px-2 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {c.ui.placeholderImage}
                    </span>
                  </div>
                  <div className="grid content-start gap-4 lg:col-span-4 lg:col-start-9">
                    <h2 id={`${p.slug}-t`} className="t-h2">
                      {p.name}
                      {p.real ? <span className="stop">.</span> : <Tbc>Slot</Tbc>}
                    </h2>
                    <p className="text-muted-foreground">{p.sub}</p>
                    {(p.body ?? [p.summary]).map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                    {p.instagram && (
                      <a href={p.instagram.url} target="_blank" rel="noopener noreferrer" className="cta cta-line mt-2 justify-self-start">
                        {c.ui.viewOnInstagram} <span className="arr" aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
          <p className="mt-12 text-[0.88rem] text-muted-foreground">
            {c.ui.conceptNote} <Tbc />
          </p>
        </div>
      </section>

      <section className="band band-dark" aria-labelledby="series-title">
        <div className="frame">
          <SectionHead id="series-title" label={c.home.series.label} title={c.home.series.title} text={c.home.series.text} />
          <SeriesLinks episodes={c.episodes.filter((e) => e.ep > 0)} openLabel="Watch on Instagram" />
          <div className="mt-6 flex flex-wrap gap-6 text-[0.88rem]">
            <a className="u" href={c.seriesUrl} target="_blank" rel="noopener noreferrer">Watch the series ↗</a>
            <Link className="u" href={`/${lang}/contact`}>{c.ui.startProject} &rarr;</Link>
          </div>
        </div>
      </section>
    </>
  );
}
