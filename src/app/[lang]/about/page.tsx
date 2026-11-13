import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Portrait } from "@/components/site/portrait";
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
  advisors, and the way to Careers and Partner with us.
  Final changes (12 Nov 2026): clearer structure, no cutouts. Every person (founders, DigiNerd,
  advisory) has the same profile: a portrait (their photo from public/images/team/, else
  initials), name, roles on their own lines, then the bio.
  Updated changes (13 Nov 2026): portraits for leadership and the core team are vertical 4:5
  frames, reel style, instead of round avatars.
*/

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.about.metaTitle, description: c.aboutCopy.paragraphs[0], alternates: { canonical: `${siteUrl}/${lang}/about` } };
}

/**
 * One person, set like a contributor note: the 4:5 portrait, then name and role(s) in sentence
 * case, then the bio beside the portrait on wider screens. No boxes or rules around it.
 */
function PersonCard({ person, size }: { person: Person; size?: "md" | "lg" }) {
  const roles = person.role.split(" | ");
  const col = size === "lg" ? "sm:grid-cols-[clamp(160px,18vw,220px)_minmax(0,1fr)]" : "sm:grid-cols-[clamp(140px,15vw,190px)_minmax(0,1fr)]";
  return (
    <li className={cn("grid content-start gap-5 sm:gap-x-7", col)}>
      <span className="block w-full max-w-[220px] sm:max-w-none">
        <Portrait name={person.name} photo={person.photo} sizes="(min-width: 640px) 220px, 60vw" />
      </span>
      <div className="grid content-start gap-4 sm:pt-1">
        <div className="grid gap-1">
          <h3 className="t-h3">{person.name}</h3>
          {roles.map((role, i) => (
            <span key={role} className={cn("text-[0.95rem]", i === 0 ? "text-brand" : "text-muted-foreground")}>
              {role}
            </span>
          ))}
        </div>
        <div className="grid max-w-[52ch] gap-3 text-muted-foreground">
          {person.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
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
      {/* Opening (12 Nov 2026): the headline and the approved opening copy, with the black wordmark
          beside them, filling the first screen on its own (min-height, so a short screen grows
          instead of clipping). The founders follow in their own section. */}
      <section className="band" aria-labelledby="about-title">
        <div className="frame flex min-h-[calc(100svh-var(--header-h))] flex-col">
          <div className="index-row">
            <span className="t-label marker">About</span>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            {/*
              Two columns, one reading order: all the text on the left (headline, the opening line
              as the lead, then the two supporting paragraphs), and only the black wordmark on the
              right. Lines are kept to a comfortable measure.
            */}
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
              <div className="grid content-start gap-8 lg:col-span-7">
                <h1 id="about-title" className="t-h1">
                  {hl(a.title)}
                  <span className="stop">.</span>
                </h1>
                {/*
                  Two pieces of text, not three: the founding line as the statement, then one
                  supporting paragraph (the two approved sentences run together, wording unchanged).
                  Fewer, evenly sized blocks at one measure, so the column no longer steps down
                  like a ladder of shrinking paragraphs.
                */}
                <div className="grid max-w-[34rem] gap-6">
                  <p className="t-lead text-balance text-ink">{a.paragraphs[0]}</p>
                  {a.paragraphs.length > 1 && (
                    <p className="text-pretty leading-[1.7] text-muted-foreground">{a.paragraphs.slice(1).join(" ")}</p>
                  )}
                </div>
              </div>
              <div className="flex lg:col-span-4 lg:col-start-9 lg:justify-end">
                <Image src="/images/logo-brown.png" alt="" width={900} height={180} sizes="(min-width: 1024px) 30vw, 70vw" className="h-auto w-full max-w-[300px] self-center brightness-0 lg:max-w-[420px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="band" aria-labelledby="founders-title">
        <div className="frame">
          <SectionHead id="founders-title" label="Founders" title={a.founders.title} />
          <ul className="grid gap-12 lg:grid-cols-2 lg:gap-x-10">
            {a.founders.people.map((p) => (
              <PersonCard key={p.name} person={p} size="lg" />
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
            <div className="grid content-start gap-5 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <h2 id="partner-title" className="t-h1">
                {a.partner.name}
                <span className="stop">.</span>
              </h2>
              <p className="t-label">{a.partner.line}</p>
              <p className="t-lead max-w-[40ch] text-muted-foreground">{a.partner.text}</p>
            </div>
            <ul className="grid content-start gap-10 lg:col-span-6 lg:col-start-7">
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
          <ul className="grid gap-12 md:grid-cols-2 md:gap-x-6">
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
