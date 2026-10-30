import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstagramMedia } from "@/components/site/instagram-media";
import { ProjectVisual } from "@/components/site/project-visual";
import { Reveal } from "@/components/site/reveal";
import { Tbc } from "@/components/site/section-head";
import { SeriesLinks } from "@/components/site/series-links";
import { getContent } from "@/content";
import type { Project } from "@/content/types";
import { hasLocale } from "@/i18n/config";
import { hl, plain } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.workPage.metaTitle, description: c.workPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/work` } };
}

/*
  Layout rhythm (top to bottom): the featured film as the hero, the project index on its own
  band, a split (story left, film right), a staggered two-up of more work in its native shapes
  (any further published projects in a row of three below it), a quieter set of case-study
  slots, the series band, then a closing call to action. Everything follows the order and the
  featured project set in the admin.
*/
export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const w = c.workPage;
  const total = c.projects.length;
  const number = (p: Project) => String(c.projects.indexOf(p) + 1).padStart(2, "0");

  const shown = (p: Project) => p.real && !!p.instagram && !!p.embed;
  const featured = c.projects.find((p) => p.featured && shown(p)) ?? c.projects.find(shown);
  if (!featured) notFound();
  const published = c.projects.filter((p) => p !== featured && shown(p));
  const second = published[0];
  const studio = published.slice(1, 3);
  const more = published.slice(3);
  const slots = c.projects.filter((p) => !shown(p));

  return (
    <>
      {/* Hero: the featured film, chosen in the admin. */}
      <section id={featured.slug} aria-labelledby="work-title" className="band scroll-mt-20">
        <div className="frame grid gap-[clamp(28px,3.5vw,48px)]">
          <div className="index-row !mb-0">
            <span className="t-label marker">Featured film</span>
            <span className="count">
              <b>{number(featured)}</b> / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-8">
              <span className="t-label">{featured.sub}</span>
              <h1 id="work-title" className="t-display">
                {featured.name}
                <span className="stop">.</span>
              </h1>
            </div>
            <p className="t-lead text-muted-foreground lg:col-span-4">{featured.summary}</p>
          </div>
          <InstagramMedia url={featured.instagram!.url} kind={featured.embed!} title={featured.name} priority />
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <dl className="grid grid-cols-3 gap-5 border-t border-border pt-4 lg:col-span-5">
              {[
                ["Type", featured.category],
                ["Series", featured.sub],
                ["Released", featured.date],
              ].map(([k, v]) => (
                <div key={k} className="grid content-start gap-1">
                  <dt className="t-label">{k}</dt>
                  <dd className="text-[0.96rem]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid content-start gap-5 lg:col-span-5 lg:col-start-8">
              {(featured.body ?? [featured.summary]).map((t) => (
                <p key={t}>{t}</p>
              ))}
              <div className="flex flex-wrap gap-2.5">
                <InstagramLink url={featured.instagram!.url} label={c.ui.viewOnInstagram} />
                <a href="#index-title" className="cta cta-line cta-sm self-center border-transparent">
                  All projects <span className="arr" aria-hidden="true">&darr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The file's index, moved out of the hero: every project, numbered, as jump links. */}
      <section className="band band-tint" aria-labelledby="index-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{w.indexLabel}</span>
            <span className="count">
              <b>{String(total).padStart(2, "0")}</b> projects
            </span>
          </div>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-5 lg:col-span-5">
              <h2 id="index-title" className="t-h2 scroll-mt-24">
                {hl(w.title)}
                <span className="stop">.</span>
              </h2>
              <p className="max-w-[36ch] text-muted-foreground">{w.lead}</p>
            </div>
            <ol className="border-t border-border lg:col-span-6 lg:col-start-7">
              {c.projects.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`#${p.slug}`}
                    className="group grid min-h-14 grid-cols-[36px_minmax(0,1fr)_auto_16px] items-baseline gap-4 border-b border-border py-3.5 transition-colors hover:text-brand"
                  >
                    <span className="text-[0.78rem] font-medium text-[var(--faint)] transition-colors group-hover:text-brand">{number(p)}</span>
                    <span className="t-h3 !text-[1.25rem] transition-transform duration-500 ease-[var(--ease)] group-hover:translate-x-1.5">{p.name}</span>
                    <span className="text-[0.86rem] text-muted-foreground">{p.real ? p.category : "Slot"}</span>
                    <span aria-hidden="true" className="translate-y-[-3px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      &darr;
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Split: story left, film right. */}
      {second && (
        <section id={second.slug} aria-labelledby={`${second.slug}-t`} className="band scroll-mt-20">
          <div className="frame grid gap-7">
            <ProjectMeta p={second} n={number(second)} total={total} />
            <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-6">
              <Reveal className="order-2 grid content-start gap-5 lg:order-1 lg:col-span-4">
                <h2 id={`${second.slug}-t`} className="t-h2">
                  {second.name}
                  <span className="stop">.</span>
                </h2>
                <p className="text-muted-foreground">{second.sub}</p>
                {(second.body ?? [second.summary]).map((t) => (
                  <p key={t}>{t}</p>
                ))}
                <InstagramLink url={second.instagram!.url} label={c.ui.viewOnInstagram} />
              </Reveal>
              <div className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
                <InstagramMedia url={second.instagram!.url} kind={second.embed!} title={second.name} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* More work: two pieces in their native shapes, staggered, then any others in a row of three. */}
      {studio.length > 0 && (
        <section className="band band-tint" aria-labelledby="studio-title">
          <div className="frame">
            <div className="index-row">
              <span className="t-label marker">{plain(w.studioTitle)}</span>
            </div>
            <div className="s-head">
              <h2 id="studio-title" className="t-h2">
                {hl(w.studioTitle)}
                <span className="stop">.</span>
              </h2>
              <p>{w.studioText}</p>
            </div>
            <div className="grid items-start gap-14 md:grid-cols-12 md:gap-6">
              {studio.map((p, i) => (
                <article
                  key={p.slug}
                  id={p.slug}
                  aria-labelledby={`${p.slug}-t`}
                  className={cn("grid scroll-mt-24 content-start gap-5", i === 0 ? "md:col-span-6" : "md:col-span-4 md:col-start-8 md:mt-32")}
                >
                  <WorkCard p={p} n={number(p)} total={total} label={c.ui.viewOnInstagram} />
                </article>
              ))}
            </div>
            {more.length > 0 && (
              <div className="mt-[clamp(56px,7vw,96px)] grid items-start gap-14 md:grid-cols-3 md:gap-6">
                {more.map((p) => (
                  <article key={p.slug} id={p.slug} aria-labelledby={`${p.slug}-t`} className="grid scroll-mt-24 content-start gap-5">
                    <WorkCard p={p} n={number(p)} total={total} label={c.ui.viewOnInstagram} />
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Slots: quieter, smaller, clearly marked. */}
      {slots.length > 0 && (
        <section className="band" aria-labelledby="next-title">
          <div className="frame">
            <div className="index-row">
              <span className="t-label marker">{w.nextTitle}</span>
            </div>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
              <div className="grid content-start gap-4 lg:col-span-4">
                <h2 id="next-title" className="t-h2">
                  {w.nextTitle}
                  <span className="stop">.</span>
                </h2>
                <p className="text-muted-foreground">{w.nextText}</p>
              </div>
              <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                {slots.map((p) => (
                  <li key={p.slug} id={p.slug} className="group grid scroll-mt-24 content-start gap-4">
                    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden well text-ink">
                      <ProjectVisual project={p} artClassName="h-[78%] w-auto" label={p.cover ? p.name : `${c.ui.placeholderImage}: ${p.name}`} />
                    </div>
                    <div className="grid gap-1">
                      <span className="t-label">
                        <b className="font-medium text-ink">{number(p)}</b> / {String(total).padStart(2, "0")} &nbsp; {p.category}
                      </span>
                      <h3 className="t-h3">
                        {p.name}
                        <Tbc>Slot</Tbc>
                      </h3>
                      <p className="text-[0.96rem] text-muted-foreground">{p.summary}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="band band-dark" aria-labelledby="series-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{c.home.series.label}</span>
          </div>
          <div className="s-head">
            <h2 id="series-title" className="t-h2">
              {hl(c.home.series.title)}
              <span className="stop">.</span>
            </h2>
            <p>{c.home.series.text}</p>
          </div>
          <SeriesLinks episodes={c.episodes.filter((e) => e.ep > 0)} openLabel="Watch on Instagram" />
          <a className="u mt-6 inline-block text-[0.92rem]" href={c.seriesUrl} target="_blank" rel="noopener noreferrer">
            Watch the series ↗
          </a>
        </div>
      </section>

      {/* Close: never end on a dead end. */}
      <section className="band" aria-labelledby="cta-title">
        <div className="frame grid items-end gap-8 lg:grid-cols-12 lg:gap-6">
          <h2 id="cta-title" className="t-h1 lg:col-span-7">
            {hl(w.ctaTitle)}
            <span className="stop">?</span>
          </h2>
          <div className="grid content-start gap-6 lg:col-span-4 lg:col-start-9">
            <p className="text-muted-foreground">{w.ctaText}</p>
            <Link href={`/${lang}/contact`} className="cta justify-self-start">
              {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function WorkCard({ p, n, total, label }: { p: Project; n: string; total: number; label: string }) {
  return (
    <>
      <InstagramMedia url={p.instagram!.url} kind={p.embed!} title={p.name} />
      <div className="grid gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="t-label">
            <b className="font-medium text-ink">{n}</b> / {String(total).padStart(2, "0")} &nbsp; {p.category}
          </span>
          <span className="text-[0.86rem] text-muted-foreground">{p.date}</span>
        </div>
        <h3 id={`${p.slug}-t`} className="t-h3">
          {p.name}
          <span className="stop">.</span>
        </h3>
        <p className="text-[0.96rem] text-muted-foreground">{p.summary}</p>
        <InstagramLink url={p.instagram!.url} label={label} small />
      </div>
    </>
  );
}

function ProjectMeta({ p, n, total }: { p: Project; n: string; total: number }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border pt-5">
      <span className="t-label">
        <b className="font-medium text-ink">{n}</b> / {String(total).padStart(2, "0")} &nbsp; {p.category}
      </span>
      <span className="text-[0.86rem] text-muted-foreground">
        {p.sub}, {p.date}
      </span>
    </div>
  );
}

function InstagramLink({ url, label, small = false }: { url: string; label: string; small?: boolean }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cn("cta cta-line justify-self-start", small && "cta-sm mt-2")}>
      {label} <span className="arr" aria-hidden="true">↗</span>
    </a>
  );
}
