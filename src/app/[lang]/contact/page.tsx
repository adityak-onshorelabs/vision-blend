import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/site/forms/project-form";
import { Reach } from "@/components/site/reach";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";

/*
  Contact: the enquiry form first, WhatsApp second (brief, 11 Nov 2026), then the plain details.
  INTERIM layout until Gursimar's visual reference and final copy arrive. Arriving from an industry
  page (?industry=<slug>), the form names the industry and sends it with the enquiry.
*/

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.contactPage.metaTitle, description: c.contactPage.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/contact` } };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const cp = c.contactPage;
  const wa = c.company.whatsapp;

  return (
    <>
      <section className="band" aria-labelledby="contact-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Contact</span>
          </div>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-4">
              <h1 id="contact-title" className="t-display max-w-[9ch]">
                {hl(cp.title)}
                <span className="stop">.</span>
              </h1>
              <p className="t-lead max-w-[30ch] text-muted-foreground">{cp.lead}</p>
            </div>
            <div className="border-t-2 border-brand pt-6 sm:pt-8 lg:col-span-7 lg:col-start-6">
              <ProjectForm copy={c.forms} industries={c.industries.map(({ slug, name }) => ({ slug, name }))} idPrefix="contact" />
            </div>
          </div>
        </div>
      </section>

      <section className="band band-dark" aria-labelledby="talk-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">WhatsApp</span>
          </div>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-6">
              <h2 id="talk-title" className="t-h2">
                {hl(wa.title.replace(/\?$/, ""))}
                <span className="stop">?</span>
              </h2>
              <p className="t-lead max-w-[32ch] text-muted-foreground">{wa.text}</p>
              <a href={wa.url} target="_blank" rel="noopener noreferrer" className="cta justify-self-start">
                {wa.cta} <span className="arr" aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <Reach content={c} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
