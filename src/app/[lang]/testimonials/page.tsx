import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TestimonialFilm } from "@/components/site/testimonial-film";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";

/*
  Testimonials (studio's request, 20 Nov 2026): a page of its own for the "Behind the Blend" films,
  from the studio's Drive folder. Each film plays here in Drive's player; beside it, who is speaking
  and the lines and figures the film itself puts on screen (testimonialsPage in src/content/en.ts).
  Films alternate sides on wide screens; on phones the film comes first.
*/

export async function generateMetadata({ params }: PageProps<"/[lang]/testimonials">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  const p = c.testimonialsPage;
  return { title: p.metaTitle, description: p.metaDescription, alternates: { canonical: `${siteUrl}/${lang}/testimonials` } };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function TestimonialsPage({ params }: PageProps<"/[lang]/testimonials">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const p = c.testimonialsPage;
  const films = [...p.films].sort((a, b) => a.ep - b.ep);

  return (
    <>
      {/* Introduction */}
      <section className="band" aria-labelledby="testimonials-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{p.label}</span>
            <span className="count">
              {pad(films.length)} {films.length === 1 ? "film" : "films"}
            </span>
          </div>
          <div className="grid gap-6">
            <h1 id="testimonials-title" className="t-display max-w-[14ch]">
              {hl(p.title)}
              <span className="stop">.</span>
            </h1>
            <p className="t-lead max-w-[40ch] text-muted-foreground">{p.lead}</p>
          </div>
        </div>
      </section>

      {/* The films */}
      {films.map((f, i) => {
        const flip = i % 2 === 1;
        const id = `film-${f.ep}`;
        return (
          <section key={f.drive} className="band" aria-labelledby={id}>
            <div className="frame">
              <div className="index-row">
                <span className="t-label marker">Ep {pad(f.ep)}</span>
                <span className="count">{f.industry}</span>
              </div>
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
                <div className={cn("lg:col-span-6", flip && "lg:order-2 lg:col-start-7")}>
                  <TestimonialFilm
                    drive={f.drive}
                    poster={f.poster}
                    title={`${f.name}, ${f.company}: Behind the Blend, episode ${f.ep}`}
                    duration={f.duration}
                    priority={i === 0}
                  />
                </div>

                <div className={cn("grid content-start gap-8 lg:col-span-5", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
                  <blockquote className="grid gap-4">
                    <p className="t-quote max-w-[18ch]">
                      <span aria-hidden="true" className="text-brand">&ldquo;</span>
                      {hl(f.quote)}.
                      <span aria-hidden="true" className="text-brand">&rdquo;</span>
                    </p>
                  </blockquote>

                  <div className="grid gap-1.5 border-t border-border pt-6">
                    <h2 id={id} className="t-h3">
                      {f.name}
                    </h2>
                    <p className="text-[1.05rem]">
                      <strong className="font-medium">{f.company}</strong>
                    </p>
                    <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.9rem] text-muted-foreground">
                      {f.facts.map((fact) => (
                        <li key={fact} className="flex items-center gap-2">
                          <span aria-hidden="true" className="text-brand">/</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {f.stat && (
                    <p className="grid gap-1">
                      <span className="text-[clamp(2.4rem,1.8rem+2vw,3.5rem)] font-[300] leading-none tracking-[-0.03em] text-brand tabular-nums">{f.stat.value}</span>
                      <span className="text-[0.95rem] text-muted-foreground">{f.stat.text}</span>
                    </p>
                  )}

                  {f.chapters.length > 0 && (
                    <div className="grid gap-3">
                      <span className="t-label">In this film</span>
                      <ol className="grid">
                        {f.chapters.map((ch, j) => (
                          <li key={ch} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-border py-3 text-[0.98rem]">
                            <span className="pt-0.5 text-[0.78rem] font-medium text-[var(--faint)] tabular-nums">{pad(j + 1)}</span>
                            {ch}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Next story */}
      <section className="band band-dark" aria-labelledby="testimonials-cta">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{c.navMoreLabel}</span>
          </div>
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="grid gap-4 lg:col-span-8">
              <h2 id="testimonials-cta" className="t-h1">
                {hl(p.cta.title)}
                <span className="stop">.</span>
              </h2>
              <p className="t-lead max-w-[36ch]">{p.cta.text}</p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Link href={`/${lang}/contact`} className="cta">
                {p.cta.label} <span className="arr" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
