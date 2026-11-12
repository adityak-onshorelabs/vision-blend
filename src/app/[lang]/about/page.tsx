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

/*
  About, in the approved wording (brief, 11 Nov 2026): opening, founders, DigiNerd, investment &
  advisory, the connected approach. Then the studio team, kept apart from founders, partners and
  advisors, and the way to Careers and Partner with us.
  Final changes (12 Nov 2026): clearer structure, no cutouts. Every person (founders, DigiNerd,
  advisory) has the same profile: a rule, a small square monogram (a rectangular photo once the
  studio supplies one), name, roles on their own lines, then the bio. No large empty portrait
  frames while photos are pending.
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
    .filter((w) => /^[A-Z]/.test(w) && !/^(Mr|Mrs|Ms|Dr)\.?$/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

function Monogram({ person }: { person: Person }) {
  return (
    <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center bg-[var(--well)] text-[1.05rem] font-[400] tracking-[0.02em] text-muted-foreground">
      {initials(person.name)}
    </span>
  );
}

/** One person: rule, monogram (or photo), name, each role on its own line, bio */
function PersonCard({ person }: { person: Person }) {
  const roles = person.role.split(" | ");
  return (
    <li className="grid content-start gap-5 border-t border-border pt-6">
      {person.photo && (
        <div className="relative aspect-[4/5] max-w-[360px] overflow-hidden bg-[var(--well)]">
          <Image src={person.photo} alt={person.name} fill sizes="(min-width: 640px) 360px, 100vw" className="object-cover" />
        </div>
      )}
      <div className="flex items-start gap-4">
        {!person.photo && <Monogram person={person} />}
        <div className="grid min-w-0 gap-1.5 pt-0.5">
          <h3 className="t-h3">{person.name}</h3>
          <p className="grid gap-0.5">
            {roles.map((role) => (
              <span key={role} className="t-label">
                {role}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="grid max-w-[54ch] gap-3 text-muted-foreground">
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
          <ul className="grid gap-12 md:grid-cols-2 md:gap-x-6">
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
