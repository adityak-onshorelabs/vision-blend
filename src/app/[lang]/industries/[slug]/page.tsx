import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryArt } from "@/components/site/industry-art";
import { IndustryCard } from "@/components/site/industry-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHead } from "@/components/site/section-head";
import { getContent } from "@/content";
import { hasLocale, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

type Params = PageProps<"/[lang]/industries/[slug]">["params"];

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
  return {
    title: industry.name,
    description: industry.summary ?? industry.detail?.lead,
    alternates: { canonical: `${siteUrl}/${lang}/industries/${industry.slug}` },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function IndustryPage({ params }: PageProps<"/[lang]/industries/[slug]">) {
  const d = await load(params);
  if (!d) notFound();
  const { lang, c, index, industry: s } = d;
  const detail = s.detail;
  const total = c.industries.length;
  const offerings = detail?.offerings ?? s.services.map((title) => ({ title, text: "" }));
  // The other industries, starting from the next one, so "More industries" reads as a sequence
  const others = [...c.industries.slice(index + 1), ...c.industries.slice(0, index)];

  return (
    <>
      {/* Hero: breadcrumb, title, lead, actions, and the drawing in a large panel */}
      <section className="band" aria-labelledby="industry-title">
        <div className="frame">
          <div className="index-row">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 t-label">
                <li>
                  <Link href={`/${lang}/industries`} className="marker u">
                    Industries
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[var(--faint)]">/</li>
                <li aria-current="page" className="text-ink">{s.name}</li>
              </ol>
            </nav>
            <span className="count">
              <b>{pad(index + 1)}</b> / {pad(total)}
            </span>
          </div>

          {/* On lg the hero is sized to fit one screen: the panel takes the height left after the
              header and the index row. */}
          <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-between gap-8 lg:col-span-7 lg:pe-8">
              <div className="grid content-start gap-4 lg:gap-5">
                {s.note && <span className="t-label">{s.note}</span>}
                <h1 id="industry-title" className="t-display">
                  {s.name}
                  <span className="stop">.</span>
                </h1>
                {detail && <p className="t-lead max-w-[42ch] text-muted-foreground">{detail.lead}</p>}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/${lang}/contact`} className="cta">
                  {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
                </Link>
                <a href="#services" className="cta cta-line">
                  What we make <span className="arr" aria-hidden="true">&darr;</span>
                </a>
              </div>
            </div>
            <div className="panel group relative grid aspect-[4/3] place-items-center lg:col-span-5 lg:aspect-auto lg:h-[clamp(280px,calc(100svh-var(--header-h)-200px),520px)]">
              <IndustryArt slug={s.slug} className="h-auto max-h-[78%] w-[78%] text-ink" />
              <span className="absolute bottom-4 start-4 t-label">
                {pad(offerings.length)} services
              </span>
            </div>
          </div>


        </div>
      </section>

      {detail && (
        <section className="band" aria-labelledby="overview-title">
          <div className="frame">
            <SectionHead id="overview-title" label="Overview" title={`How we work with *${s.name}*`} />
            <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-2 md:gap-6">
              {detail.paragraphs.map((p, j) => (
                <p key={p} className={j === 0 ? "t-lead md:pe-10" : "text-[1.1rem] leading-relaxed text-muted-foreground md:pt-1"}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="services" className="band scroll-mt-24" aria-labelledby="make-title">
        <div className="frame">
          <SectionHead id="make-title" label="Services" title="What we *make*" text={`The services we offer ${s.name} brands, made by one team.`} />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {offerings.map((o, j) => (
              <Reveal as="li" key={o.title} delay={(j % 3) * 0.06} className="panel group relative grid content-start gap-4 p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-[0.78rem] font-medium tabular-nums tracking-[0.12em] text-[var(--faint)] transition-colors group-hover:text-brand">
                    {pad(j + 1)}
                  </span>
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand opacity-40 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="t-h3">{o.title}</h3>
                {o.text && <p className="text-muted-foreground">{o.text}</p>}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {detail && (
        <section className="band band-dark" aria-labelledby="challenges-title">
          <div className="frame">
            <SectionHead id="challenges-title" label="The brief" title="What the *industry* asks for" text="The problems we hear most often, and plan the work around." />
            <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
              {detail.challenges.map((ch, j) => (
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

      {detail && (
        <section className="band" aria-labelledby="faq-title">
          <div className="frame">
            <SectionHead id="faq-title" label="Questions" title="Asked *often*" text="Something not covered here? Send it with your brief." />
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

      <section className="band" aria-labelledby="more-title">
        <div className="frame">
          <SectionHead id="more-title" label="More industries" title="Other *industries*" text="See how we work with brands in the rest of the industries we serve." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {others.map((x) => (
              <li key={x.slug} className="grid">
                <IndustryCard industry={x} lang={lang} index={c.industries.indexOf(x)} total={total} size="sm" />
              </li>
            ))}
          </ul>
          <div className="mt-[clamp(56px,7vw,104px)] flex flex-wrap items-end justify-between gap-8 border-t border-border pt-8">
            <p className="t-h2 max-w-[18ch]">
              Have a brief for <span className="hl">{s.name}</span>
              <span className="stop">?</span>
            </p>
            <Link href={`/${lang}/contact`} className="cta">
              {c.ui.startProject} <span className="arr" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
