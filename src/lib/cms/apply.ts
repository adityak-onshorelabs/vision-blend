import { enquiryDraft } from "@/content/en";
import type { Content, Crop, Episode, Project } from "@/content/types";
import { gmailCompose } from "@/lib/mail";
import { docSchemas, type DocKey, type Docs } from "./schema";
import { NUMBER_WORDS as WORDS, teamLine } from "./team";

/*
  Merges what the team saved in /admin over the defaults in src/content/en.ts. Anything not
  saved yet (or saved in an older shape that no longer validates) falls back to the default.
*/

const DEFAULT_CROP: Crop = { pos: "50% 50%", sz: "300%" };

/** Keeps only the saved documents that still validate. */
export function parseDocs(raw: Partial<Record<DocKey, unknown>>): Partial<Docs> {
  const out: Partial<Record<DocKey, unknown>> = {};
  for (const key of Object.keys(docSchemas) as DocKey[]) {
    if (raw[key] === undefined) continue;
    const parsed = docSchemas[key].safeParse(raw[key]);
    if (parsed.success) out[key] = parsed.data;
  }
  return out as Partial<Docs>;
}

/** The admin forms start from these when nothing has been saved yet. */
export function cmsDefaults(c: Content): Docs {
  return {
    studio: { teamSize: c.company.teamSize, email: c.company.email ?? "", emailCc: c.company.emailCc ?? undefined, phone: c.company.phone ?? undefined },
    hero: { eyebrow: c.home.eyebrow, tagline: c.company.tagline.replace(/\.$/, ""), lead: c.home.lead },
    projects: c.projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      sub: p.sub,
      category: p.category,
      date: p.date,
      summary: p.summary,
      body: p.body,
      real: p.real,
      featured: !!p.featured,
      instagram: p.instagram,
      embed: p.embed,
      cover: p.cover,
    })),
    episodes: c.episodes.filter((e) => e.ep > 0).map(({ ep, title, date, url, by }) => ({ ep, title, date, url, by })),
  };
}

export function applyCms(base: Content, docs: Partial<Docs>): Content {
  const c: Content = structuredClone(base);

  if (docs.studio) {
    const { teamSize, email, emailCc, phone } = docs.studio;
    // Swap the team count wherever the copy states it ("Six people", "six people")
    const from = WORDS[base.company.teamSize] ?? String(base.company.teamSize);
    const [word, noun] = teamLine(teamSize).split(" ");
    const count = new RegExp(`\\b${from} (people|person)\\b`, "gi");
    const swap = (s: string) => s.replace(count, (m) => `${m[0] === m[0].toUpperCase() ? word : word.toLowerCase()} ${noun}`);
    c.company.teamSize = teamSize;
    c.company.team = teamLine(teamSize);
    c.home.facts = c.home.facts.map((f) => ({ ...f, value: swap(f.value) }));
    c.about.metaDescription = swap(c.about.metaDescription);
    c.about.team.title = swap(c.about.team.title);
    c.contactPage.explore.links = c.contactPage.explore.links.map((l) => ({ ...l, text: swap(l.text) }));

    c.company.email = email;
    c.company.emailCc = emailCc ?? null;
    c.company.phone = phone ?? null;
    c.company.enquiryGmail = gmailCompose({ ...enquiryDraft, to: email, cc: emailCc });
  }

  if (docs.hero) {
    c.home.eyebrow = docs.hero.eyebrow;
    c.company.tagline = `${docs.hero.tagline}.`;
    c.home.lead = docs.hero.lead;
  }

  if (docs.projects) {
    c.projects = docs.projects.map(
      (p): Project => ({
        ...p,
        // keep the placeholder crop of a project that existed in code, else a neutral one
        crop: base.projects.find((b) => b.slug === p.slug)?.crop ?? DEFAULT_CROP,
      }),
    );
  }

  if (docs.episodes) {
    const withCrop = docs.episodes.map(
      (e): Episode => ({ ...e, crop: base.episodes.find((b) => b.url === e.url)?.crop ?? { ...DEFAULT_CROP, bw: true } }),
    );
    // The intro reel (ep 0, used on About) stays from code; numbered episodes come from the admin
    c.episodes = [...base.episodes.filter((e) => e.ep === 0), ...withCrop];
  }

  return c;
}
