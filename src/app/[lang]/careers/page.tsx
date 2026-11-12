import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareersForm } from "@/components/site/forms/careers-form";
import { SectionHead, Tbc } from "@/components/site/section-head";
import { SeriesLinks } from "@/components/site/series-links";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";

/*
  Careers (brief, 11 Nov 2026): introduction, find your discipline, beyond the brief, people in
  focus, apply. Structure after bregobusiness.com/careers, in Vision Blend's own material.
  - Full-time roles and internships only, all in the studio. "Open applications" until the studio
    confirms live vacancies; no timelines or benefits are stated.
  - Beyond the brief: the studio's own A Week at Vision Blend reels stand in until Gursimar's
    montage of outings and celebrations is in.
  - People in focus: one slot per feature until the studio sends names, dates, photos and captions.
*/

export async function generateMetadata({ params }: PageProps<"/[lang]/careers">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  const p = c.careersPage;
  return { title: p.metaTitle, description: p.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/careers` } };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function CareersPage({ params }: PageProps<"/[lang]/careers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const p = c.careersPage;
  const intro = c.episodes.filter((e) => e.ep === 0);
  const reels = c.episodes.filter((e) => e.ep > 0);

  return (
    <>
      {/* Introduction */}
      <section className="band" aria-labelledby="careers-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Careers</span>
            <span className="count">{p.model}</span>
          </div>
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-7">
              <h1 id="careers-title" className="t-display max-w-[12ch]">
                {hl(p.title)}
                <span className="stop">.</span>
              </h1>
              <p className="t-lead max-w-[34ch]">{p.line}</p>
              <p className="text-muted-foreground">{p.lead}</p>
              <a href="#apply" className="cta justify-self-start">
                {p.apply.label} <span className="arr" aria-hidden="true">&darr;</span>
              </a>
            </div>
            {intro.length > 0 && (
              <div className="max-w-[360px] lg:col-span-4 lg:col-start-9">
                <SeriesLinks className="!grid-cols-1" episodes={intro} openLabel="Watch on Instagram" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Find your discipline */}
      <section className="band" aria-labelledby="disciplines-title">
        <div className="frame">
          <SectionHead id="disciplines-title" label="Disciplines" title="Find your *discipline*" text={p.model} />
          <ul className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {p.disciplines.map((d, i) => (
              <li key={d.title} className="group grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-border py-6">
                <span className="pt-1.5 text-[0.78rem] font-medium text-[var(--faint)] transition-colors group-hover:text-brand">{pad(i + 1)}</span>
                <div className="grid gap-1">
                  <h3 className="t-h3">{d.title}</h3>
                  <p className="text-[0.95rem] text-muted-foreground">{d.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Beyond the brief */}
      <section className="band band-dark" aria-labelledby="culture-title">
        <div className="frame">
          <SectionHead id="culture-title" label={p.culture.label} title={p.culture.title} text={p.culture.text} />
          <SeriesLinks episodes={reels} openLabel="Watch on Instagram" />
        </div>
      </section>

      {/* People in focus */}
      <section className="band" aria-labelledby="people-title">
        <div className="frame">
          <SectionHead id="people-title" label={p.people.label} title={p.people.title} text={p.people.text} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {p.people.features.map((f, i) => (
              <li key={`${f.label}-${i}`} className="grid content-start gap-4">
                <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-[var(--well)]">
                  {f.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.photo} alt={f.name ?? f.label} className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <Tbc>Photo to come</Tbc>
                  )}
                </div>
                <div className="grid gap-1">
                  <span className="t-label marker">{f.label}</span>
                  <span className="t-h3">{f.name ?? <Tbc />}</span>
                  {f.date && <span className="text-[0.92rem] text-muted-foreground">{f.date}</span>}
                  {f.caption && <p className="text-muted-foreground">{f.caption}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="band band-tint scroll-mt-20" aria-labelledby="apply-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{p.apply.label}</span>
            <span className="count">{p.apply.openings}</span>
          </div>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-4">
              <h2 id="apply-title" className="t-h2">
                {hl(p.apply.title)}
                <span className="stop">.</span>
              </h2>
              <p className="t-lead text-muted-foreground">{p.apply.text}</p>
              <div className="grid gap-2 border-t border-border pt-5">
                <span className="t-label !text-ink">{p.apply.openings}</span>
                <p className="text-[0.95rem] text-muted-foreground">{p.apply.openingsText}</p>
              </div>
            </div>
            <div className="border-t-2 border-brand pt-6 sm:pt-8 lg:col-span-7 lg:col-start-6">
              <CareersForm copy={c.forms} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
