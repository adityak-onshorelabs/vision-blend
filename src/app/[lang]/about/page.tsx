import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Beliefs } from "@/components/site/beliefs";
import { SectionHead } from "@/components/site/section-head";
import { ProjectArt } from "@/components/site/project-art";
import { SeriesLinks } from "@/components/site/series-links";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getContent(lang);
  return { title: c.about.metaTitle, description: c.about.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/about` } };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);
  const a = c.about;

  return (
    <>
      <section className="band" aria-labelledby="about-title">
        <div className="frame">
          <SectionHead as="h1" id="about-title" label="About" title={a.title} />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-6">
              <p className="t-lead">{a.lead}</p>
              {a.paragraphs.map((p) => (
                <p key={p} className="text-muted-foreground">{p}</p>
              ))}
              <dl className="grid gap-5 border-t border-border pt-4 sm:grid-cols-3">
                {c.home.facts.map((f) => (
                  <div key={f.label} className="grid gap-1">
                    <dt className="t-label">{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="group grid content-start gap-3 lg:col-span-5 lg:col-start-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-night">
                <Image
                  src="/images/key-visual.jpg"
                  alt="Vision Blend wordmark on the copper key visual"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease)] group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="text-[0.78rem] text-muted-foreground">{c.home.visualCaption[0]}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="band band-dark" aria-labelledby="team-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Team</span>
            <span className="count">People Files, Edit 001</span>
          </div>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="max-w-[420px] lg:col-span-4">
              <SeriesLinks className="!grid-cols-1" episodes={c.episodes.filter((e) => e.url === a.team.reel)} openLabel="Watch on Instagram" />
            </div>
            <div className="grid content-start gap-9 lg:col-span-7 lg:col-start-6">
              <h2 id="team-title" className="t-h1">
                {hl(a.team.title.replace(/\.$/, ""))}
                <span className="stop">.</span>
              </h2>
              <p className="t-lead max-w-[38ch] text-muted-foreground">{a.team.text}</p>
              <dl className="grid gap-5 border-t border-border pt-5 sm:grid-cols-3">
                {c.home.facts.map((f) => (
                  <div key={f.label} className="grid gap-1">
                    <dt className="t-label">{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="grid items-center gap-8 border-t border-border pt-8 sm:grid-cols-[180px_minmax(0,1fr)]">
                <ProjectArt slug="people-files" className="w-[180px] max-w-full text-ink" />
                <div className="grid gap-4">
                  <p className="text-[0.95rem] text-muted-foreground">Six different personalities. One studio, one brief at a time.</p>
                  <div className="flex flex-wrap gap-2.5">
                    <a className="cta" href={a.team.reel} target="_blank" rel="noopener noreferrer">
                      Meet the core team <span className="arr" aria-hidden="true">↗</span>
                    </a>
                    <a className="cta cta-line" href={a.team.url} target="_blank" rel="noopener noreferrer">
                      People Files <span className="arr" aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="beliefs-title">
        <div className="frame">
          <SectionHead id="beliefs-title" label={c.home.beliefs.label} title={c.home.beliefs.title} text={c.home.beliefs.text} />
          <Beliefs beliefs={c.beliefs} />
        </div>
      </section>

      <section className="band band-tint" aria-labelledby="join-title">
        <div className="frame">
          <SectionHead id="join-title" label="Collaborate" title={a.join.title} text={a.join.text} />
          <div className="flex flex-wrap gap-2.5">
            <a className="cta" href={c.company.instagram} target="_blank" rel="noopener noreferrer">
              Message {c.company.instagramHandle} <span className="arr" aria-hidden="true">↗</span>
            </a>
            <Link className="cta cta-line" href={`/${lang}/contact`}>
              {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
