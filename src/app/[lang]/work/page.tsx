import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstagramMedia } from "@/components/site/instagram-media";
import { ProjectArt } from "@/components/site/project-art";
import { Reveal } from "@/components/site/reveal";
import { Tbc } from "@/components/site/section-head";
import { SeriesLinks } from "@/components/site/series-links";
import { getContent } from "@/content";
import type { Project } from "@/content/types";
import { hasLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getContent(lang);
  return { title: c.workPage.metaTitle, description: c.workPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/work` } };
}

/*
  Layout rhythm (top to bottom): header with a project index, one full-width featured film,
  a split (story left, film right), a staggered two-up of studio work in its native shapes,
  a quieter pair of case-study slots, the series band, then a closing call to action.
*/
export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);
  const w = c.workPage;
  const total = c.projects.length;
  const bySlug = (slug: string) => c.projects.find((p) => p.slug === slug)!;
  const number = (p: Project) => String(c.projects.indexOf(p) + 1).padStart(2, "0");

  const featured = bySlug("fifa-x-paradise");
  const second = bySlug("hands-behind-the-brand");
  const studio = [bySlug("people-files"), bySlug("a-week-at-vision-blend")];
  const slots = c.projects.filter((p) => !p.real);

  return (
    <>
      {/* Header: title and lead left, the file's index right. */}
      <section className="band" aria-labelledby="work-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Work</span>
            <span className="count">
              <b>{String(total).padStart(2, "0")}</b> projects
            </span>
          </div>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-7">
              <h1 id="work-title" className="t-display max-w-[9ch]">
                {w.title}
                <span className="stop">.</span>
              </h1>
              <p className="t-lead max-w-[36ch] text-muted-foreground">{w.lead}</p>
            </div>
            <nav aria-label={w.indexLabel} className="grid content-end gap-3 lg:col-span-4 lg:col-start-9">
              <span className="t-label">{w.indexLabel}</span>
              <ol className="border-t border-border">
                {c.projects.map((p) => (
                  <li key={p.slug}>
                    <a
                      href={`#${p.slug}`}
                      className="group flex min-h-11 items-baseline gap-4 border-b border-border py-2.5 text-[0.98rem] transition-colors hover:text-brand"
                    >
                      <span className="w-6 text-[0.78rem] font-medium text-[var(--faint)] transition-colors group-hover:text-brand">{number(p)}</span>
                      <span className="flex-1">{p.name}</span>
                      <span className="text-[0.86rem] text-muted-foreground">{p.category}</span>
                      <span aria-hidden="true" className="translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        &darr;
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* 01 Featured: the film full width, meta underneath. */}
      <section id={featured.slug} aria-labelledby={`${featured.slug}-t`} className="band scroll-mt-20">
        <div className="frame grid gap-7">
          <ProjectMeta p={featured} n={number(featured)} total={total} />
          <InstagramMedia url={featured.instagram!.url} kind={featured.embed!} title={featured.name} priority />
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
            <h2 id={`${featured.slug}-t`} className="t-h1 lg:col-span-6">
              {featured.name}
              <span className="stop">.</span>
            </h2>
            <div className="grid content-start gap-5 lg:col-span-5 lg:col-start-8">
              <p className="text-muted-foreground">{featured.sub}</p>
              {(featured.body ?? [featured.summary]).map((t) => (
                <p key={t}>{t}</p>
              ))}
              <InstagramLink url={featured.instagram!.url} label={c.ui.viewOnInstagram} />
            </div>
          </div>
        </div>
      </section>

      {/* 02 Split: story left, film right, on the tint band for a change of pace. */}
      <section id={second.slug} aria-labelledby={`${second.slug}-t`} className="band band-tint scroll-mt-20">
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

      {/* 03 + 04 Studio: two pieces in their native shapes, staggered. */}
      <section className="band" aria-labelledby="studio-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{w.studioTitle}</span>
          </div>
          <div className="s-head">
            <h2 id="studio-title" className="t-h2">
              {w.studioTitle}
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
                <InstagramMedia url={p.instagram!.url} kind={p.embed!} title={p.name} />
                <div className="grid gap-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="t-label">
                      <b className="font-medium text-ink">{number(p)}</b> / {String(total).padStart(2, "0")} &nbsp; {p.category}
                    </span>
                    <span className="text-[0.86rem] text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 id={`${p.slug}-t`} className="t-h3">
                    {p.name}
                    <span className="stop">.</span>
                  </h3>
                  <p className="text-[0.96rem] text-muted-foreground">{p.summary}</p>
                  <InstagramLink url={p.instagram!.url} label={c.ui.viewOnInstagram} small />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 05 + 06 Slots: quieter, smaller, clearly marked. */}
      {slots.length > 0 && (
        <section className="band band-tint" aria-labelledby="next-title">
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
                    <div className="grid aspect-[4/3] place-items-center bg-paper text-ink">
                      <ProjectArt slug={p.slug} className="h-[78%] w-auto" label={`${c.ui.placeholderImage}: ${p.name}`} />
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
              {c.home.series.title}
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
            {w.ctaTitle}
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
