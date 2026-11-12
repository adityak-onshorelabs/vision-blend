import { notFound } from "next/navigation";
import { ClientLogos } from "@/components/site/client-logos";
import { ProjectForm } from "@/components/site/forms/project-form";
import { Hero } from "@/components/site/hero";
import { SectionHead } from "@/components/site/section-head";
import { SeriesLinks } from "@/components/site/series-links";
import { StatsRow } from "@/components/site/stats";
import { WorkGallery } from "@/components/site/work-gallery";
import { getContent } from "@/content";
import type { ClientLogo, Content, WorkItem } from "@/content/types";
import { hasLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

/*
  Home, in the confirmed order (brief, 11 Nov 2026): hero, our clients, brand films, A Week at
  Vision Blend, start a project. The work index, industries, beliefs and process sections were
  removed; the standalone Work page is gone, and industry portfolios sit behind their enquiry form.
*/

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return { alternates: { canonical: `${siteUrl}/${lang}` } };
}

const TOTAL = 4;

/** Every sector's client logos, taken in turn from each sector so the strip mixes them, without repeats */
function mixedLogos(c: Content): ClientLogo[] {
  const lists = c.industries.map((s) => s.detail?.clients?.logos ?? []);
  const seen = new Set<string>();
  const out: ClientLogo[] = [];
  for (let i = 0; i < Math.max(0, ...lists.map((l) => l.length)); i++) {
    for (const list of lists) {
      const logo = list[i];
      const key = logo?.name.trim().toLowerCase();
      if (!logo || !key || seen.has(key)) continue;
      seen.add(key);
      out.push(logo);
    }
  }
  return out;
}

/** The brand films, in the order picked, from the industry portfolios */
function brandFilms(c: Content): WorkItem[] {
  const all = c.industries.flatMap((s) => s.detail?.work?.items ?? []);
  return c.home.films.picks.map((id) => all.find((w) => w.drive === id)).filter((w): w is WorkItem => !!w);
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const h = c.home;
  const logos = mixedLogos(c);
  const films = brandFilms(c);

  return (
    <>
      <Hero lang={lang} tagline={c.company.tagline} copy={h} services={c.industries} labels={{ startProject: c.ui.startProject }} />

      {logos.length > 0 && (
        <section className="band" aria-labelledby="clients-title">
          <div className="frame">
            <SectionHead id="clients-title" label={h.clients.label} index={1} total={TOTAL} title={h.clients.title} />
            <ClientLogos logos={logos} />
            {/* The studio's figures, under the logos (12 Nov 2026); same as the Industries headline */}
            <StatsRow stats={c.industriesPage.stats} className="mt-[clamp(40px,5vw,72px)]" />
          </div>
        </section>
      )}

      {films.length > 0 && (
        <section className="band" aria-labelledby="films-title">
          <div className="frame">
            <SectionHead id="films-title" label={h.films.label} index={2} total={TOTAL} title={h.films.title} text={h.films.text} />
            <WorkGallery items={films} variant="films" />
          </div>
        </section>
      )}

      <section className="band band-dark" aria-labelledby="series-title">
        <div className="frame">
          <SectionHead id="series-title" label={h.series.label} index={3} total={TOTAL} title={h.series.title} text={h.series.text} />
          <SeriesLinks episodes={c.episodes.filter((e) => e.ep > 0)} openLabel="Watch on Instagram" />
          <div className="mt-6 flex flex-wrap justify-between gap-3 text-[0.88rem] text-muted-foreground">
            <span>Previews load from Instagram</span>
            <span className="flex flex-wrap gap-6">
              <a className="u text-ink" href={c.seriesUrl} target="_blank" rel="noopener noreferrer">Watch the series ↗</a>
              <a className="u text-ink" href={c.company.instagram} target="_blank" rel="noopener noreferrer">Follow {c.company.instagramHandle}</a>
            </span>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="contact-title">
        <div className="frame">
          <SectionHead id="contact-title" label={h.contact.label} index={4} total={TOTAL} title={h.contact.title} text={h.contact.text} />
          <div className="max-w-[860px]">
            <ProjectForm copy={c.forms} idPrefix="home" />
          </div>
        </div>
      </section>
    </>
  );
}
