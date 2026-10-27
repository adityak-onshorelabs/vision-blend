import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { ProjectArt } from "@/components/site/project-art";
import { Reach } from "@/components/site/reach";
import { ServiceIllustration } from "@/components/site/service-illustration";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getContent(lang);
  return { title: c.contactPage.metaTitle, description: c.contactPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/contact` } };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);
  const cp = c.contactPage;
  const exploreArt = [
    <ProjectArt key="work" slug="fifa-x-paradise" className="w-full" />,
    <ServiceIllustration key="services" slug="branding" className="h-auto w-full" />,
    <ProjectArt key="about" slug="people-files" className="w-full" />,
  ];

  return (
    <>
      {/* 1. The brief: what happens next on the left, the stepped form on a card on the right. */}
      <section className="band" aria-labelledby="contact-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Contact</span>
            <span className="count">{c.company.instagramHandle}</span>
          </div>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-10 lg:col-span-5">
              <div className="grid gap-6">
                <h1 id="contact-title" className="t-display max-w-[9ch]">
                  {cp.title}
                  <span className="stop">.</span>
                </h1>
                <p className="t-lead max-w-[30ch] text-muted-foreground">{cp.lead}</p>
              </div>

              <div className="grid gap-4">
                <h2 className="t-label marker">{cp.next.title}</h2>
                <ol className="border-t border-border">
                  {cp.next.steps.map((s, i) => (
                    <li key={s.title} className="group grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-border py-4">
                      <span className="pt-1 text-[0.78rem] font-medium text-[var(--faint)] transition-colors group-hover:text-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="grid gap-1">
                        <span className="text-[1.05rem]">{s.title}</span>
                        <span className="text-[0.94rem] text-muted-foreground">{s.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="relative bg-tint px-5 pb-8 pt-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-brand sm:px-9 sm:pb-10 sm:pt-8">
                <EnquiryForm copy={cp.form}>
                  <div className="flex flex-wrap gap-2.5">
                    <Link href={`/${lang}/work`} className="cta cta-line">
                      {c.ui.seeWork} <span className="arr" aria-hidden="true">&rarr;</span>
                    </Link>
                    <a href={c.company.instagram} target="_blank" rel="noopener noreferrer" className="cta cta-line">
                      Follow {c.company.instagramHandle} <span className="arr" aria-hidden="true">↗</span>
                    </a>
                  </div>
                </EnquiryForm>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Rather talk: Instagram first, then the plain contact details. */}
      <section className="band band-dark" aria-labelledby="talk-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Talk</span>
            <span className="count">{c.company.website}</span>
          </div>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-6">
              <h2 id="talk-title" className="t-h2">
                {cp.talk.title.replace(/\?$/, "")}
                <span className="stop">?</span>
              </h2>
              <p className="t-lead max-w-[32ch] text-muted-foreground">{cp.talk.text}</p>
              <a href={c.company.instagram} target="_blank" rel="noopener noreferrer" className="cta justify-self-start">
                {cp.talk.cta} <span className="arr" aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <Reach content={c} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Not ready yet: three ways back into the site, so the page never dead-ends. */}
      <section className="band band-tint" aria-labelledby="explore-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Explore</span>
          </div>
          <h2 id="explore-title" className="t-h2 mb-[clamp(32px,4vw,56px)]">
            {cp.explore.title.replace(/\?$/, "")}
            <span className="stop">?</span>
          </h2>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
            {cp.explore.links.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={`/${lang}${l.href}`}
                  className="group relative grid h-full content-start gap-4 bg-paper p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-[600ms] hover:before:scale-x-100 focus-visible:before:scale-x-100"
                >
                  <span className="grid aspect-[3/2] place-items-center bg-tint p-3 text-ink">{exploreArt[i]}</span>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="t-h3">{l.title}</span>
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                  <span className="text-[0.95rem] text-muted-foreground">{l.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
