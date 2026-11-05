import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryArt } from "@/components/site/industry-art";
import { HeroHeader } from "@/components/site/hero-header";
import { IndustryCard } from "@/components/site/industry-card";
import { embedRatioOf } from "@/components/site/instagram-media";
import { ProcessReel } from "@/components/site/process-reel";
import { Reveal } from "@/components/site/reveal";
import { SectionHead } from "@/components/site/section-head";
import { ShowcaseMedia } from "@/components/site/showcase-media";
import { getContent } from "@/content";
import type { IndustryDetail, Photo } from "@/content/types";
import { hasLocale, locales } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { industryContactHref, industryGmail } from "@/lib/industry-enquiry";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
  An industry page. Each one is sent on its own to prospects from that industry, so it is built as
  a complete landing page for someone who has never seen the site: what the studio does for the
  industry, how, and how to get in touch, with the rest of the site one click away at the end.
  Order follows the industry handoff: hero, introduction, services, value, process, FAQs, enquiry.
  (Approved work for the industry slots in before the FAQs once the studio sends it.)
*/

type Params = PageProps<"/[lang]/industries/[slug]">["params"];

/*
  Every industry is prerendered (generateStaticParams), so in production this page is static and a
  navigation to it loads the prefetched page at once. Next's dev-only instant check reads the
  `await params` below as blocking; opting out says this segment may block, which it never does.
*/
export const instant = false;

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (lang) => ({ lang, c: await getContent(lang) })));
  return all.flatMap(({ lang, c }) => c.industries.map((s) => ({ lang, slug: s.slug })));
}

async function load(params: Params) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return null;
  const c = await getContent(lang);
  const index = c.industries.findIndex((s) => s.slug === slug);
  if (index < 0) return null;
  return { lang, c, index, industry: c.industries[index] };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/industries/[slug]">): Promise<Metadata> {
  const d = await load(params);
  if (!d) return {};
  const { lang, industry } = d;
  const meta = industry.detail?.meta;
  const description = meta?.description ?? industry.summary ?? industry.detail?.lead;
  const url = `${siteUrl}/${lang}/industries/${industry.slug}`;
  return {
    // The approved titles already end in "| Vision Blend", so they skip the layout's template
    title: meta ? { absolute: meta.title } : industry.name,
    description,
    alternates: { canonical: url },
    // These pages are shared as links on their own, so the preview names the industry
    openGraph: { title: meta?.title ?? `${industry.name} | ${d.c.company.name}`, description, url },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");
/** A card's frame: an Instagram card takes the embed's window, a film its own frame */
const frameOf = (o: { ratio?: [number, number]; instagram?: string; video?: string }): [number, number] =>
  o.instagram && !o.video ? embedRatioOf(o.instagram) : (o.ratio ?? [16, 9]);
const aspect = (o: { ratio?: [number, number]; instagram?: string; video?: string }) => {
  const [w, h] = frameOf(o);
  return w / h;
};

/**
 * Splits the showcase cards into justified rows. A row takes at least two cards and keeps adding
 * (up to four) until the frames' combined aspect ratio reaches 2, so a wide film pairs with a reel
 * (as on Real Estate) while a run of reels and posts sits three or four across instead of two
 * very tall cards. Each card's share of its row is its aspect over the row's total; a row that
 * falls short (the last one) takes the row above's total, so its cards keep the same scale.
 */
function rowsOf(aspects: number[]) {
  const out: { share: number; gaps: number }[] = [];
  let last = 2;
  for (let i = 0; i < aspects.length; ) {
    let n = 1;
    let sum = aspects[i];
    while (i + n < aspects.length && n < 4 && (n < 2 || sum < 2)) sum += aspects[i + n++];
    // A short last row takes the scale of the row above it
    const total = n === 1 ? Math.max(sum, 2.4) : sum < 2 ? Math.max(last, 2) : sum;
    last = total;
    for (let k = 0; k < n; k++) out.push({ share: aspects[i + k] / total, gaps: n - 1 });
    i += n;
  }
  return out;
}

/** Marks a stock stand-in so nobody mistakes it for the studio's own work. */
function PhotoTag({ photo }: { photo: Photo }) {
  if (!photo.placeholder) return null;
  return (
    <span className="absolute end-3 top-3 bg-[oklch(0.17_0.006_40/0.6)] px-2 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--on-night)] backdrop-blur-sm">
      Placeholder photo
    </span>
  );
}

export default async function IndustryPage({ params }: PageProps<"/[lang]/industries/[slug]">) {
  const d = await load(params);
  if (!d) notFound();
  const { lang, c, industry: s } = d;
  const detail = s.detail;
  const offerings: IndustryDetail["offerings"] = detail?.offerings ?? s.services.map((title) => ({ title, text: "" }));
  // Content categories (title + subtitle + one showcase video) instead of service cards
  const showcase = offerings.some((o) => o.subtitle);
  const rows = rowsOf(offerings.map(aspect));
  const unit = showcase ? "categories" : "services";
  const others = c.industries.filter((x) => x.slug !== s.slug);
  // Both routes into an enquiry carry the industry, so the studio knows which page it came from
  const contact = industryContactHref(lang, s);
  const brief = industryGmail(c.company, s);
  // The portfolio subpage, when the industry has one
  const work = detail?.work ? `/${lang}/industries/${s.slug}/work` : null;

  return (
    <>
      {/* Hero: what the studio does for this industry, the two actions, and a photo */}
      {detail?.hero ? (
        /*
          With a photo, the photo is the hero: full screen, running up behind the transparent
          header, settling in from a slight zoom. The text sits on it at the lower left, where the
          scrim is darkest; the eyebrow row stays at the top.
        */
        <section data-hero className="ind-hero" aria-labelledby="industry-title">
          <HeroHeader />
          <div className="hero-still absolute inset-0">
            <Image src={detail.hero.src} alt={detail.hero.alt} fill priority quality={90} sizes="100vw" className="object-cover" />
          </div>
          <div className="ind-hero-scrim" aria-hidden="true" />

          <div className="band-dark !bg-transparent">
            <div className="frame ind-hero-content">
              <div className="index-row">
                <span className="t-label marker">{detail.eyebrow ?? s.note ?? s.name}</span>
                <Link href={`/${lang}/industries`} className="t-label u shrink-0 whitespace-nowrap">
                  All industries
                </Link>
              </div>

              <div />

              <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
                <div className="grid gap-6 lg:col-span-8 lg:gap-7">
                  <h1 id="industry-title" className="t-h1 max-w-[14ch] text-balance">
                    {hl(detail.headline ?? s.name)}
                    <span className="stop">.</span>
                  </h1>
                  <p className="t-lead max-w-[42ch] text-muted-foreground">{detail.lead}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href={contact} className="cta">
                      {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
                    </Link>
                    {work && (
                      <Link href={work} className="cta cta-line">
                        See our work <span className="arr" aria-hidden="true">&rarr;</span>
                      </Link>
                    )}
                    <a href="#industry-services" className="cta cta-line">
                      Explore our services <span className="arr" aria-hidden="true">&darr;</span>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:col-span-4 lg:justify-end">
                  <span className="t-label">
                    {pad(offerings.length)} {unit}
                  </span>
                  {detail.hero.placeholder && (
                    <span className="t-label border border-[var(--rule)] px-2 py-1 text-muted-foreground">Placeholder photo</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
      <section className="band" aria-labelledby="industry-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{detail?.eyebrow ?? s.note ?? s.name}</span>
            <Link href={`/${lang}/industries`} className="t-label u">
              All industries
            </Link>
          </div>

          <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-6">
            <div className={cn("grid gap-8 lg:col-span-7 lg:pe-8", detail?.headline ? "content-center lg:gap-10" : "content-between")}>
              <div className="grid content-start gap-5 lg:gap-6">
                <h1 id="industry-title" className={detail?.headline ? "t-h1 max-w-[14ch]" : "t-display"}>
                  {hl(detail?.headline ?? s.name)}
                  <span className="stop">.</span>
                </h1>
                {detail && <p className="t-lead max-w-[46ch] text-muted-foreground">{detail.lead}</p>}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={contact} className="cta">
                  {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
                </Link>
                {work && (
                  <Link href={work} className="cta cta-line">
                    See our work <span className="arr" aria-hidden="true">&rarr;</span>
                  </Link>
                )}
                <a href="#industry-services" className="cta cta-line">
                  Explore our services <span className="arr" aria-hidden="true">&darr;</span>
                </a>
              </div>
            </div>
            <div className="panel relative grid aspect-[4/3] place-items-center overflow-hidden lg:col-span-5 lg:aspect-auto lg:h-[clamp(320px,calc(100svh-var(--header-h)-200px),580px)]">
              <IndustryArt slug={s.slug} className="h-auto max-h-[78%] w-[78%] text-ink" />
              <span className="absolute bottom-4 start-4 t-label">
                {pad(offerings.length)} {unit}
              </span>
            </div>
          </div>
        </div>
      </section>
      )}

      {detail && detail.paragraphs.length > 0 && (
        <section className="band" aria-labelledby="overview-title">
          <div className="frame">
            <SectionHead id="overview-title" label="Introduction" title={detail.introTitle ?? `How we work with *${s.name}*`} />
            {detail.paragraphs.length === 1 ? (
              <div className="grid md:grid-cols-12 md:gap-6">
                <p className="t-lead max-w-[56ch] md:col-span-8 md:col-start-5">{detail.paragraphs[0]}</p>
              </div>
            ) : (
              <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-2 md:gap-6">
                {detail.paragraphs.map((p, j) => (
                  <p key={p} className={j === 0 ? "t-lead md:pe-10" : "text-[1.1rem] leading-relaxed text-muted-foreground md:pt-1"}>
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="industry-services" className="band scroll-mt-24" aria-labelledby="make-title">
        <div className="frame">
          <SectionHead
            id="make-title"
            label="Services"
            title={detail?.servicesTitle ?? "What we *make*"}
            text={detail?.servicesTitle ? undefined : `The services we offer ${s.name} brands, made by one team.`}
          />
          {showcase ? (
            /*
              Content categories: one showcase video each, the title as the main text and a short
              subtitle under it. Every film keeps its own frame (a reel stays 9:16). On wide screens
              they sit two to a row as a justified row: each card's width is its share of the row's
              combined aspect ratio, so both films come out the same height and titles line up.
              Narrower screens stack them, with vertical films held to a phone-like width.
            */
            <ol className="grid gap-y-12 lg:flex lg:flex-wrap lg:gap-x-5 lg:gap-y-16">
              {offerings.map((o, j) => {
                const ar = aspect(o);
                const { share, gaps } = rows[j];
                return (
                  <Reveal
                    as="li"
                    key={o.title}
                    delay={(j % 4) * 0.06}
                    className="group grid min-w-0 content-start gap-5 lg:shrink-0 lg:basis-[calc((100%-var(--gaps)*1.25rem-1px)*var(--share))]"
                    style={{ "--share": share, "--gaps": gaps } as CSSProperties}
                  >
                    <ShowcaseMedia
                      video={o.video}
                      instagram={o.instagram}
                      title={o.title}
                      poster={o.image}
                      ratio={frameOf(o)}
                      sizes={`(min-width: 1360px) ${Math.round(1280 * share)}px, (min-width: 1024px) ${Math.round(share * 100)}vw, ${ar < 1 ? "18rem" : "100vw"}`}
                      className={cn(ar < 1 && "max-lg:max-w-[min(100%,18rem)]")}
                    />
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1.5">
                      <span className="text-[0.78rem] font-medium tabular-nums tracking-[0.12em] text-[var(--faint)] transition-colors group-hover:text-brand">
                        {pad(j + 1)}
                      </span>
                      <h3 className="text-[clamp(1.6rem,1.15rem+1.5vw,2.5rem)] font-[340] leading-[1.05] tracking-[-0.025em]">{o.title}</h3>
                      {o.subtitle && <p className="col-start-2 text-[0.98rem] text-muted-foreground">{o.subtitle}</p>}
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          ) : (
          /* Five cards sit 2 + 3 on wide screens (six-column grid), so no card is left alone on a row */
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {offerings.map((o, j) => (
              <Reveal
                as="li"
                key={o.title}
                delay={(j % 3) * 0.06}
                className={cn(
                  "panel group relative grid content-start overflow-hidden",
                  offerings.length === 5 ? (j < 2 ? "lg:col-span-3" : "lg:col-span-2") : "lg:col-span-2",
                  offerings.length % 2 === 1 && j === offerings.length - 1 && "md:col-span-2 lg:col-span-2",
                )}
              >
                {o.image && (
                  <div className={cn("relative overflow-hidden", offerings.length === 5 && j < 2 ? "aspect-[16/9]" : "aspect-[4/3]")}>
                    <Image
                      src={o.image.src}
                      alt={o.image.alt}
                      fill
                      sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <PhotoTag photo={o.image} />
                  </div>
                )}
                <div className="grid content-start gap-3 p-6 md:p-7">
                  <div className="flex items-center gap-3">
                    <span className="text-[0.78rem] font-medium tabular-nums tracking-[0.12em] text-[var(--faint)] transition-colors group-hover:text-brand">
                      {pad(j + 1)}
                    </span>
                    {o.headline && <span className="t-label text-ink">{o.title}</span>}
                  </div>
                  <h3 className="t-h3">{o.headline ?? o.title}</h3>
                  {o.text && <p className="text-muted-foreground">{o.text}</p>}
                </div>
              </Reveal>
            ))}
          </ol>
          )}
          {/* The full pieces live on the portfolio subpage */}
          {work && detail?.work && (
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <span className="t-label">{pad(detail.work.items.length)} pieces, played in full</span>
              <Link href={work} className="cta cta-line">
                See the work <span className="arr" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {detail && (detail.value || detail.challenges.length > 0) && (
        <section className="band band-dark" aria-labelledby="value-title">
          <div className="frame">
            {detail.value ? (
              <SectionHead id="value-title" label="Why it works" title={detail.value.title} />
            ) : (
              <SectionHead id="value-title" label="The brief" title="What the *industry* asks for" text="The problems we hear most often, and plan the work around." />
            )}
            <ol className={cn("grid gap-10 md:gap-6", (detail.value?.items ?? detail.challenges).length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
              {(detail.value?.items ?? detail.challenges).map((ch, j) => (
                <li key={ch.title} className="grid content-start gap-4 border-t border-border pt-6">
                  <span className="t-h2 text-brand tabular-nums">{pad(j + 1)}</span>
                  <h3 className="t-h3">{ch.title}</h3>
                  <p className="text-muted-foreground">{ch.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {detail?.process && (
        <section className="band band-tint" aria-labelledby="process-title">
          <div className="frame">
            {/* The label would only repeat a title that is itself "Process" */}
            <SectionHead id="process-title" label={detail.process.title === "Process" ? "How we work" : "Process"} title={detail.process.title} />
            <ProcessReel steps={detail.process.steps} />
          </div>
        </section>
      )}

      {detail && detail.faqs.length > 0 && (
        <section className="band" aria-labelledby="faq-title">
          <div className="frame">
            <SectionHead
              id="faq-title"
              label="Questions"
              title={detail.faqTitle ?? "Asked *often*"}
              text={detail.faqTitle ? undefined : "Something not covered here? Send it with your brief."}
            />
            {/* Numbered rows like the services list: number, question, plus/minus. The answer lines up under the question. */}
            <div className="faq border-t border-border">
              {detail.faqs.map((f, j) => (
                <details key={f.q} className="group border-b border-border">
                  <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-3 py-5 md:grid-cols-[repeat(12,minmax(0,1fr))] md:gap-6 [&::-webkit-details-marker]:hidden">
                    <span className="text-[0.78rem] font-medium tabular-nums tracking-[0.12em] text-[var(--faint)] transition-colors group-hover:text-brand group-open:text-brand md:col-span-1">
                      {pad(j + 1)}
                    </span>
                    <span className="text-[clamp(1.1rem,1rem+0.4vw,1.3rem)] font-[360] tracking-[-0.01em] transition-transform duration-500 ease-[var(--ease)] group-hover:translate-x-1.5 md:col-span-10">
                      {f.q}
                    </span>
                    <span aria-hidden="true" className="faq-icon justify-self-end md:col-span-1">
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8 H13" />
                        <path className="faq-v" d="M8 3 V13" />
                      </svg>
                    </span>
                  </summary>
                  <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 pb-7 md:grid-cols-[repeat(12,minmax(0,1fr))] md:gap-6">
                    <p className="col-start-2 max-w-[62ch] text-muted-foreground md:col-[2/span_8]">{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enquiry: the page may be the only one a prospect opens, so the ways to reach the studio are right here */}
      <section className="band" aria-labelledby="enquiry-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Start a project</span>
          </div>
          {/* A heading on its own (no supporting line) centres against the buttons instead of sinking below them */}
          <div className={cn("grid gap-10 lg:grid-cols-12 lg:gap-6", detail?.cta && !detail.cta.text ? "items-center" : "items-end")}>
            <div className="grid gap-5 lg:col-span-7">
              <h2 id="enquiry-title" className="t-h1 max-w-[16ch]">
                {hl(detail?.cta?.title ?? `Have a brief for *${s.name}*`)}
                <span className="stop">{detail?.cta ? "." : "?"}</span>
              </h2>
              {detail?.cta?.text && <p className="t-lead max-w-[44ch] text-muted-foreground">{detail.cta.text}</p>}
            </div>
            <div className="grid gap-5 lg:col-span-5 lg:justify-items-start">
              <div className="flex flex-wrap gap-3">
                <Link href={contact} className="cta">
                  {detail?.cta?.primary ?? c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
                </Link>
                {brief && (
                  <a href={brief} target="_blank" rel="noopener noreferrer" className="cta cta-line">
                    {detail?.cta?.secondary ?? "Email the studio"} <span className="arr" aria-hidden="true">&#8599;</span>
                  </a>
                )}
              </div>
              {c.company.phones.length > 0 && (
                <p className="text-[0.94rem] text-muted-foreground">
                  {c.contactPage.email.phone}{" "}
                  {c.company.phones.map((p, i) => (
                    <span key={p.number}>
                      {i > 0 && " or "}
                      {p.name} on{" "}
                      <a href={`tel:${p.number.replace(/[^\d+]/g, "")}`} className="u whitespace-nowrap text-ink">
                        {p.number}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The way into the rest of the site, for someone who arrived on this page alone */}
      <section className="band" aria-labelledby="more-title">
        <div className="frame">
          <SectionHead id="more-title" label={`More from ${c.company.name}`} title="Other *industries*" text={c.home.lead} />
          <ul className={cn("grid gap-4 sm:grid-cols-2 lg:gap-5", others.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
            {others.map((x) => (
              <li key={x.slug} className="grid">
                <IndustryCard industry={x} lang={lang} index={c.industries.indexOf(x)} total={c.industries.length} size="sm" />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
            <Link href={`/${lang}/work`} className="t-label u text-ink">
              {c.ui.seeWork} &rarr;
            </Link>
            <Link href={`/${lang}/about`} className="t-label u text-ink">
              About the studio &rarr;
            </Link>
            <Link href={`/${lang}/industries`} className="t-label u text-ink">
              All industries &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
