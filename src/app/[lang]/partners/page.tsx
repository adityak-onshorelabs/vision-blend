import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BeginSteps } from "@/components/site/begin-steps";
import { PartnerForm } from "@/components/site/forms/partner-form";
import { SectionHead } from "@/components/site/section-head";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";

/*
  Partner with us (brief, 11 Nov 2026): introduction, ways to partner, what we bring, how it begins,
  partnership enquiry. Structure after bregobusiness.com/partners, in Vision Blend's own terms:
  client referrals and agency collaboration carry equal weight, and commercial terms are agreed
  with each partner, so no commissions, tiers or rewards are published.
  How it begins carries restrained motion graphics (begin-steps.tsx; final changes, 12 Nov 2026).
*/

export async function generateMetadata({ params }: PageProps<"/[lang]/partners">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  const p = c.partnersPage;
  return { title: p.metaTitle, description: p.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/partners` } };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function PartnersPage({ params }: PageProps<"/[lang]/partners">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const p = c.partnersPage;

  return (
    <>
      {/* Introduction */}
      <section className="band" aria-labelledby="partners-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Partner with us</span>
          </div>
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-6">
            <h1 id="partners-title" className="t-display max-w-[11ch] lg:col-span-7">
              {hl(p.title)}
              <span className="stop">.</span>
            </h1>
            <div className="grid content-end gap-6 lg:col-span-4 lg:col-start-9">
              <p className="t-lead">{p.lead}</p>
              <p className="text-muted-foreground">{p.line}</p>
              <a href="#partner-form" className="cta justify-self-start">
                {c.forms.partner.submit} <span className="arr" aria-hidden="true">&darr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to partner: the two, side by side, the same weight */}
      <section className="band" aria-labelledby="ways-title">
        <div className="frame">
          <SectionHead id="ways-title" label={p.ways.label} title={p.ways.title} />
          <ul className="grid gap-10 md:grid-cols-2 md:gap-6">
            {p.ways.items.map((w, i) => (
              <li key={w.title} className="grid content-start gap-4 border-t-2 border-brand pt-6">
                <span className="text-[0.78rem] font-medium text-[var(--faint)]">{pad(i + 1)}</span>
                <h3 className="t-h2">{w.title}</h3>
                <p className="max-w-[46ch] text-muted-foreground">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we bring */}
      <section className="band band-dark" aria-labelledby="bring-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{p.bring.label}</span>
          </div>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-6">
              <h2 id="bring-title" className="t-h1">
                {hl(p.bring.title)}
                <span className="stop">.</span>
              </h2>
              <p className="t-lead max-w-[38ch] text-muted-foreground">{p.bring.text}</p>
            </div>
            {/* The wordmark alone on the dark band, transparent (13 Nov 2026: no copper/brown ground) */}
            <figure className="flex lg:col-span-5 lg:col-start-8 lg:justify-end">
              <Image src="/images/logo-white.png" alt="Vision Blend" width={900} height={180} sizes="(min-width: 1024px) 34vw, 80vw" className="h-auto w-full max-w-[460px]" />
            </figure>
          </div>
        </div>
      </section>

      {/* How it begins */}
      <section className="band" aria-labelledby="steps-title">
        <div className="frame">
          <SectionHead id="steps-title" label={p.steps.label} title={p.steps.title} />
          <BeginSteps items={p.steps.items} />
          <p className="mt-12 max-w-[60ch] text-muted-foreground">{p.steps.note}</p>
        </div>
      </section>

      {/* Partnership enquiry */}
      <section id="partner-form" className="band band-tint scroll-mt-20" aria-labelledby="form-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{p.form.label}</span>
          </div>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-4">
              <h2 id="form-title" className="t-h2">
                {hl(p.form.title)}
                <span className="stop">.</span>
              </h2>
              <p className="t-lead text-muted-foreground">{p.form.text}</p>
            </div>
            <div className="border-t-2 border-brand pt-6 sm:pt-8 lg:col-span-7 lg:col-start-6">
              <PartnerForm copy={c.forms} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
