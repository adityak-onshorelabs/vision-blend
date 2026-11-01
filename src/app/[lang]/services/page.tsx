import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryArt } from "@/components/site/industry-art";
import { IndustryRail } from "@/components/site/industry-rail";
import { ProcessRail } from "@/components/site/process-rail";
import { SectionHead } from "@/components/site/section-head";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.servicesPage.metaTitle, description: c.servicesPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/services` } };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);

  return (
    <>
      <section className="band" aria-labelledby="services-title">
        <div className="frame">
          {/* Own head, not SectionHead: the lead lines up with the industry column below the rail */}
          <div className="index-row">
            <span className="t-label marker">Services</span>
            <span className="count">
              <b>{String(c.industries.length).padStart(2, "0")}</b> Industries
            </span>
          </div>
          <div className="mb-[clamp(48px,6vw,88px)] grid gap-6 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-8">
            <h1 id="services-title" className="t-h1 lg:col-span-12">
              {hl(c.servicesPage.title)}
              <span className="stop">.</span>
            </h1>
            <p className="t-lead max-w-[42ch] text-muted-foreground lg:col-span-6 lg:col-start-4">{c.servicesPage.lead}</p>
          </div>

          {/* Small screens: the industries as a jump list (the sticky rail takes over from lg) */}
          <nav aria-label="Industries" className="mb-[clamp(40px,6vw,64px)] grid grid-cols-2 gap-x-6 border-t border-border sm:grid-cols-3 lg:hidden">
            {c.industries.map((s, i) => (
              <a key={s.slug} href={`#${s.slug}`} className="group grid min-h-11 grid-cols-[28px_minmax(0,1fr)] items-center border-b border-border py-2.5 text-[0.98rem]">
                <span className="text-[0.74rem] font-medium tabular-nums text-[var(--faint)] transition-colors group-hover:text-brand">{String(i + 1).padStart(2, "0")}</span>
                {s.name}
              </a>
            ))}
          </nav>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="hidden lg:col-span-3 lg:block">
              <IndustryRail items={c.industries.map(({ slug, name }) => ({ slug, name }))} label="Industries" />
            </div>

            <div className="grid lg:col-span-9">
              {c.industries.map((s, i) => (
                <article
                  key={s.slug}
                  id={s.slug}
                  aria-labelledby={`${s.slug}-t`}
                  className="group grid scroll-mt-28 gap-10 border-t border-border py-[clamp(48px,6vw,96px)] first:border-t-0 first:pt-0 last:pb-0"
                >
                  <div className="grid items-start gap-8 md:grid-cols-9 md:gap-6">
                    <div className="grid content-start gap-5 md:col-span-5">
                      <span className="t-label">
                        <b className="font-medium text-brand">{String(i + 1).padStart(2, "0")}</b> / {String(c.industries.length).padStart(2, "0")}
                      </span>
                      <h2 id={`${s.slug}-t`} className="t-h1">
                        {s.name}
                        <span className="stop">.</span>
                      </h2>
                      {s.note && <p className="t-lead text-muted-foreground">{s.note}</p>}
                    </div>
                    <IndustryArt slug={s.slug} className="aspect-[3/2] h-auto w-full max-w-[440px] well text-ink md:col-span-4" />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="t-label">What we make</span>
                      <span className="text-[0.78rem] font-medium tracking-[0.12em] text-[var(--faint)]">
                        {String(s.services.length).padStart(2, "0")} {s.services.length === 1 ? "SERVICE" : "SERVICES"}
                      </span>
                    </div>
                    <ol className="border-t border-border">
                      {s.services.map((d, j) => (
                        <li
                          key={d}
                          className="group/row relative grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-[clamp(14px,1.6vw,20px)] before:absolute before:start-0 before:bottom-[-1px] before:h-px before:w-full before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-500 before:ease-[var(--ease)] hover:before:scale-x-100"
                        >
                          <span className="text-[0.78rem] font-medium tabular-nums text-[var(--faint)] transition-colors group-hover/row:text-brand">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[clamp(1.2rem,1rem+0.7vw,1.55rem)] font-[340] tracking-[-0.015em] transition-transform duration-500 ease-[var(--ease)] group-hover/row:translate-x-2">
                            {d}
                          </span>
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand opacity-0 transition-opacity duration-300 group-hover/row:opacity-100" />
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>
              ))}
            </div>
          </div>
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
