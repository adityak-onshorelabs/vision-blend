import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProcessRail } from "@/components/site/process-rail";
import { SectionHead } from "@/components/site/section-head";
import { ServiceIllustration } from "@/components/site/service-illustration";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getContent(lang);
  return { title: c.servicesPage.metaTitle, description: c.servicesPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/services` } };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);

  return (
    <>
      <section className="band" aria-labelledby="services-title">
        <div className="frame">
          <SectionHead as="h1" id="services-title" label="Services" title={c.servicesPage.title} text={c.servicesPage.lead} />
          <div className="grid border-t border-border">
            {c.services.map((s, i) => (
              <article
                key={s.slug}
                id={s.slug}
                aria-labelledby={`${s.slug}-t`}
                className="group relative grid scroll-mt-24 gap-8 border-b border-border py-[clamp(40px,5vw,72px)] before:absolute before:start-0 before:top-[-1px] before:h-px before:w-full before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-700 hover:before:scale-x-100 lg:grid-cols-12 lg:gap-6"
              >
                <div className="grid content-start gap-4 lg:col-span-5">
                  <span className="t-label">
                    <b className="font-medium text-ink">{String(i + 1).padStart(2, "0")}</b> / {String(c.services.length).padStart(2, "0")}
                  </span>
                  <h2 id={`${s.slug}-t`} className="t-h2">
                    {s.name}
                    <span className="stop">.</span>
                  </h2>
                  <p className="t-lead text-muted-foreground">{s.line}</p>
                </div>
                <div className="grid content-start gap-6 lg:col-span-6 lg:col-start-7">
                  <ServiceIllustration slug={s.slug} className="aspect-[3/2] h-auto w-full max-w-[480px] bg-tint text-ink" />
                  <p>{s.intro}</p>
                  <ul className="grid gap-x-6 border-t border-border sm:grid-cols-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex gap-3 border-b border-border py-2.5 before:text-[var(--faint)] before:content-['\2013']">
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[0.95rem]">
                    <span className="t-label me-3">Outcome</span>
                    {s.outcome}
                  </p>
                </div>
              </article>
            ))}
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
