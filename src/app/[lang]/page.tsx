import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Beliefs } from "@/components/site/beliefs";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { ProcessRail } from "@/components/site/process-rail";
import { Reach } from "@/components/site/reach";
import { SeriesLinks } from "@/components/site/series-links";
import { Reveal } from "@/components/site/reveal";
import { SectionHead } from "@/components/site/section-head";
import { ServiceCards } from "@/components/site/service-cards";
import { WorkIndex } from "@/components/site/work-index";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return { alternates: { canonical: `${siteUrl}/${lang}` } };
}

const TOTAL = 6;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);
  const h = c.home;

  return (
    <>
      {/* Hero: copy left, key visual right. No entrance animation so it paints immediately. */}
      <section aria-labelledby="hero-title">
        <div className="frame grid gap-12 pb-[var(--section)] pt-12 md:pt-[clamp(48px,7vw,104px)] lg:grid-cols-12 lg:gap-6">
          <div className="grid min-w-0 content-between gap-[clamp(36px,5vw,64px)] lg:col-span-7">
            <h1 id="hero-title" className="t-display max-w-[10ch]">
              Building brands with taste<span className="stop">.</span>
            </h1>
            <div className="grid max-w-[30rem] gap-7">
              <p className="t-lead">{h.lead}</p>
              <div className="flex flex-wrap gap-2.5">
                <Link href={`/${lang}/contact`} className="cta">
                  {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
                </Link>
                <Link href={`/${lang}/work`} className="cta cta-line">
                  {c.ui.seeWork} <span className="arr" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <dl className="grid max-w-[34rem] gap-5 border-t border-border pt-4 sm:grid-cols-3">
              {h.facts.map((f) => (
                <div key={f.label} className="grid gap-1">
                  <dt className="t-label">{f.label}</dt>
                  <dd className="text-[0.98rem]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="group grid min-w-0 content-start gap-3 lg:col-span-5 lg:col-start-8">
            {/* Key visual: the original copper background with a slow, gentle drift; the wordmark
                stays still on top. Static with reduced motion. */}
            <div className="relative aspect-[3/2] overflow-hidden bg-night lg:aspect-[4/5]">
              <Image src="/images/key-bg.jpg" alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="hero-blend-a object-cover" />
              <div className="absolute inset-0 grid place-items-center">
                <Image
                  src="/images/logo-white.png"
                  alt="Vision Blend wordmark on the copper key visual"
                  width={900}
                  height={180}
                  priority
                  className="h-auto w-[38%] lg:w-[72%]"
                />
              </div>
            </div>
            <figcaption className="flex justify-between gap-4 text-[0.78rem] text-muted-foreground">
              <span>{h.visualCaption[0]}</span>
              <span>{h.visualCaption[1]}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="band" aria-labelledby="work-title">
        <div className="frame">
          <SectionHead id="work-title" label={h.work.label} index={1} total={TOTAL} title={h.work.title} text={h.work.text} />
          <WorkIndex
            projects={c.projects}
            labels={{ viewOnInstagram: c.ui.viewOnInstagram, realProject: c.ui.realProject, slot: "Slot", placeholder: c.ui.placeholderImage }}
          />
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.88rem] text-muted-foreground">
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-brand" /> {c.ui.realProject}</span>
            <Link href={`/${lang}/work`} className="u ms-auto text-ink">All work &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="band band-tint" aria-labelledby="services-title">
        <div className="frame">
          <SectionHead id="services-title" label={h.services.label} index={2} total={TOTAL} title={h.services.title} text={h.services.text} />
          <Reveal>
            <ServiceCards services={c.services} lang={lang} linkLabel="More on this" />
          </Reveal>
        </div>
      </section>

      <section className="band" aria-labelledby="beliefs-title">
        <div className="frame">
          <SectionHead id="beliefs-title" label={h.beliefs.label} index={3} total={TOTAL} title={h.beliefs.title} text={h.beliefs.text} />
          <Beliefs beliefs={c.beliefs} />
        </div>
      </section>

      <section className="band band-tint" aria-labelledby="process-title">
        <div className="frame">
          <SectionHead id="process-title" label={h.process.label} index={4} total={TOTAL} title={h.process.title} text={h.process.text} />
          <ProcessRail steps={c.process} />
        </div>
      </section>

      <section className="band band-dark" aria-labelledby="series-title">
        <div className="frame">
          <SectionHead id="series-title" label={h.series.label} index={5} total={TOTAL} title={h.series.title} text={h.series.text} />
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
          <SectionHead id="contact-title" label={h.contact.label} index={6} total={TOTAL} title={h.contact.title} text={h.contact.text} />
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <Reach content={c} />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm copy={c.contactPage.form} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
