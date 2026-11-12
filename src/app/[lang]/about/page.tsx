import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead } from "@/components/site/section-head";
import { TeamList } from "@/components/site/team-list";
import { getContent } from "@/content";
import type { Person } from "@/content/types";
import { hasLocale } from "@/i18n/config";
import { hl } from "@/lib/highlight";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
  About, in the approved wording (brief, 11 Nov 2026): opening, founders, DigiNerd, investment &
  advisory, the connected approach. Then the studio team, kept apart from founders, partners and
  advisors, and the way to Careers and Partner with us. Portraits come from the studio; until then
  each person has an initials tile.
*/

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.about.metaTitle, description: c.aboutCopy.paragraphs[0], alternates: { canonical: `${siteUrl}/${lang}/about` } };
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

function Portrait({ person, className }: { person: Person; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden bg-[var(--well)]", className)}>
      {person.photo ? (
        <Image src={person.photo} alt={person.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-[clamp(2.5rem,1.6rem+3vw,4.5rem)] font-[250] tracking-[-0.04em] text-[var(--faint)]">
          {initials(person.name)}
        </span>
      )}
    </div>
  );
}

function PersonCard({ person, portrait = true }: { person: Person; portrait?: boolean }) {
  return (
    <li className="grid content-start gap-5">
      {portrait && <Portrait person={person} className="max-w-[420px]" />}
      <div className="grid gap-1">
        <h3 className="t-h3">{person.name}</h3>
        <p className="t-label">{person.role}</p>
      </div>
      <div className="grid max-w-[52ch] gap-3 text-muted-foreground">
        {person.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </li>
  );
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = await getContent(lang);
  const a = c.aboutCopy;
  const leaders = new Set([...a.founders.people, ...a.partner.people, ...a.advisory.people].map((p) => p.name));
  // The studio team: everyone on the team list who is not a founder, partner or advisor
  const studio = c.about.team.members.filter((m) => !leaders.has(m.name));

  return (
    <>
      {/* Opening */}
      <section className="band" aria-labelledby="about-title">
        <div className="frame">
          <SectionHead as="h1" id="about-title" label="About" title={a.title} />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-6 lg:col-span-6">
              <p className="t-lead">{a.paragraphs[0]}</p>
              {a.paragraphs.slice(1).map((p) => (
                <p key={p} className="max-w-[56ch] text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
            <figure className="grid content-start lg:col-span-5 lg:col-start-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-night">
                <Image src="/images/key-visual.jpg" alt="Vision Blend wordmark on the copper key visual" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="band" aria-labelledby="founders-title">
        <div className="frame">
          <SectionHead id="founders-title" label="Founders" title={a.founders.title} />
          <ul className="grid gap-14 md:grid-cols-2 md:gap-6">
            {a.founders.people.map((p) => (
              <PersonCard key={p.name} person={p} />
            ))}
          </ul>
        </div>
      </section>

      {/* DigiNerd, the performance partner */}
      <section className="band band-dark" aria-labelledby="partner-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">{a.partner.label}</span>
          </div>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-6">
            <div className="grid content-start gap-5 lg:col-span-5">
              <h2 id="partner-title" className="t-h1">
                {a.partner.name}
                <span className="stop">.</span>
              </h2>
              <p className="t-label">{a.partner.line}</p>
              <p className="t-lead max-w-[40ch] text-muted-foreground">{a.partner.text}</p>
            </div>
            <ul className="grid content-start gap-10 sm:grid-cols-2 sm:gap-6 lg:col-span-6 lg:col-start-7">
              {a.partner.people.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Investment & advisory */}
      <section className="band" aria-labelledby="advisory-title">
        <div className="frame">
          <SectionHead id="advisory-title" label="Investment & advisory" title={a.advisory.title} />
          <ul className="grid gap-14 md:grid-cols-2 md:gap-6">
            {a.advisory.people.map((p) => (
              <PersonCard key={p.name} person={p} />
            ))}
          </ul>
        </div>
      </section>

      {/* One connected approach */}
      <section className="band band-tint" aria-labelledby="approach-title">
        <div className="frame">
          <div className="index-row">
            <span className="t-label marker">Approach</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <h2 id="approach-title" className="t-h1 max-w-[12ch] lg:col-span-6">
              {hl(a.approach.title)}
              <span className="stop">.</span>
            </h2>
            <div className="grid content-end gap-5 lg:col-span-5 lg:col-start-8">
              {a.approach.paragraphs.map((p, i) => (
                <p key={p} className={i === 0 ? "t-lead" : "text-muted-foreground"}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The studio team, apart from founders, partners and advisors */}
      {studio.length > 0 && (
        <section className="band" aria-labelledby="team-title">
          <div className="frame">
            <SectionHead id="team-title" label={a.team.label} title={a.team.title} text={a.team.text} />
            <TeamList members={studio} />
          </div>
        </section>
      )}

      {/* Careers and Partner with us */}
      <section className="band band-tint" aria-labelledby="more-title">
        <div className="frame">
          <SectionHead id="more-title" label="Join us" title={a.more.title} />
          <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
            {a.more.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={`/${lang}${l.href}`}
                  className="group relative grid h-full content-start gap-3 surface pb-2 pt-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-[600ms] hover:before:scale-x-100 focus-visible:before:scale-x-100"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="t-h2">{l.title}</span>
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                  <span className="text-muted-foreground">{l.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
