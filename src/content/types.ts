export type Crop = {
  /** CSS background-position for the copper placeholder crop */
  pos: string;
  /** CSS background-size for the crop */
  sz: string;
  bw?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  sub: string;
  category: string;
  date: string;
  /** true when the project is published on Vision Blend's Instagram */
  real: boolean;
  summary: string;
  body?: string[];
  credits?: string[];
  instagram?: { url: string; kind: "post" | "reel" };
  /** How the Instagram media is shaped, so the embed can be cropped to it. */
  embed?: "landscape" | "portrait" | "reel";
  /** The Work page's hero film (exactly one project) */
  featured?: boolean;
  /** Uploaded still (from the admin), shown where the line drawing would be */
  cover?: string;
  crop: Crop;
};

/** An industry the studio works in, with the services it offers that industry. */
export type Industry = {
  slug: string;
  name: string;
  /** Short clarification under the name, when the name alone is ambiguous */
  note?: string;
  services: string[];
  /** One-line pitch shown on the industries index card */
  summary?: string;
  /** Full page for the industry. PLACEHOLDER content until Vision Blend sends the real copy. */
  detail?: IndustryDetail;
};

/**
 * An industry page. Each page is shared on its own with prospects from that industry, so it has
 * to work as a complete landing page. The optional fields are filled once Vision Blend's copy for
 * the industry is in (see the "Industry handoff" tab of the project tracker); pages without them
 * fall back to the generic headings.
 */
export type IndustryDetail = {
  /** Small line above the H1, e.g. "Creative & marketing for real estate" */
  eyebrow?: string;
  /** The H1. Falls back to the industry name. */
  headline?: string;
  lead: string;
  introTitle?: string;
  paragraphs: string[];
  servicesTitle?: string;
  offerings: Offering[];
  /** "What the work is designed to do": replaces the placeholder challenges when present */
  value?: { title: string; items: { title: string; text: string }[] };
  challenges: { title: string; text: string }[];
  process?: { title: string; steps: Step[] };
  faqTitle?: string;
  faqs: { q: string; a: string }[];
  /** Closing section. `text` is optional; `primary`/`secondary` override the two button labels. */
  cta?: { title: string; text?: string; primary?: string; secondary?: string };
  /** Shown on the contact page when the visitor came from this industry's page, and used in the emailed brief */
  enquiry?: { prompt: string; placeholder: string };
  hero?: Photo;
  meta?: { title: string; description: string };
  /** Portfolio subpage (/industries/<slug>/work). Absent: the industry has no subpage. */
  work?: { title: string; lead: string; items: WorkItem[] };
  /** Client logo strip under the hero. Absent: no strip. */
  clients?: { title?: string; logos: ClientLogo[] };
};

/**
 * A client's logo as a one-colour mask: white on transparent, trimmed to the mark. The page tints it
 * to the text colour, so every logo reads the same on light or dark and none clashes with the brand.
 */
export type ClientLogo = {
  name: string;
  /** Site path or https link to the mask PNG */
  logo: string;
  /** The mask's width and height, so the strip can size every logo to the same visual area */
  ratio: [number, number];
  /** Nudges a logo that reads too heavy or too light next to the others (1 = as measured) */
  scale?: number;
};

/**
 * One piece on an industry's portfolio subpage, from Google Drive or Instagram, so nothing but this
 * record lives on the site. A Drive piece shows Drive's own thumbnail on the card and plays in
 * Drive's player; an Instagram piece shows Instagram's embed on both. Exactly one of `drive` and
 * `instagram` is set.
 */
export type WorkItem = {
  title: string;
  /** The content category it belongs to, e.g. "Ads". The page's filters are built from these. */
  category: string;
  client?: string;
  /** Drive file id. Plays from ImageKit when listed in hosted-work.ts; otherwise from Drive, which needs it shared "anyone with the link". */
  drive?: string;
  /** Instagram post or reel link */
  instagram?: string;
  kind: "film" | "still";
  /** The piece's own frame, width and height. The thumbnail is cropped to it (drops letterbox bars). */
  ratio: [number, number];
  /** Overrides Drive's thumbnail, for films whose first frame is a dark title card */
  poster?: string;
};

/**
 * One card in an industry's services / content section.
 * - Service card: `title`, optional `headline` and `text`, optional `image`.
 * - Content category (set `subtitle`): the title leads, the short subtitle sits under it, and one
 *   showcase video plays above. No paragraph. `image` is the poster, and stands in until `video` arrives.
 */
export type Offering = {
  title: string;
  headline?: string;
  text: string;
  subtitle?: string;
  image?: Photo;
  /** Showcase film (muted loop), a public/ path or ImageKit URL via media(). Absent until the studio's edit is in. */
  video?: string;
  /** Instagram post or reel shown in the card instead of a looping film (Instagram's own player) */
  instagram?: string;
  /**
   * The film's own frame, width and height (e.g. [9, 16] for a reel). The card is cut to exactly
   * this shape: no crop, no letterbox, no blurred fill. Defaults to 16:9.
   */
  ratio?: [number, number];
  /** INTERNAL handoff note: the Drive folder the studio put this category's assets in. Never rendered. */
  assets?: string;
};

/** A photo in public/. `placeholder` marks stock stand-ins until the studio sends its own. */
export type Photo = { src: string; alt: string; placeholder?: boolean };

export type Phone = { name: string; number: string };

/** A team member. Photos show on the site only once everyone has one. */
export type Member = { name: string; role: string; photo?: string };

export type Belief = { text: string; date: string; url: string };

export type Step = { name: string; text: string; out?: string };

export type Episode = {
  ep: number;
  title: string;
  date: string;
  url: string;
  by?: string;
  crop: Crop;
};

export type NavItem = { href: string; label: string };

/** A person on About (founders, partners, advisors). No photo: an initials tile stands in. */
export type Person = { name: string; role: string; bio: string[]; photo?: string };

/** Copy shared by every form on the site (src/components/site/forms) */
export type FormCopy = {
  optional: string;
  sending: string;
  verifying: string;
  verify: { checking: string; interactive: string; verified: string; error: string; retry: string };
  privacy: string;
  failed: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    business: string;
    about: string;
    company: string;
    partnerType: string;
    opportunityAbout: string;
    city: string;
    discipline: string;
    opportunity: string;
    portfolio: string;
    cv: string;
  };
  placeholders: { about: string; portfolio: string };
  cvHint: string;
  errors: {
    name: string;
    email: string;
    phone: string;
    business: string;
    company: string;
    partnerType: string;
    opportunityAbout: string;
    city: string;
    discipline: string;
    opportunity: string;
    portfolio: string;
    cv: string;
    cvSize: string;
  };
  project: { submit: string; sentTitle: string; sent: string };
  portfolio: { title: string; intro: string; submit: string; close: string; opening: string };
  partner: { submit: string; sentTitle: string; sent: string };
  careers: {
    submit: string;
    sentTitle: string;
    sent: string;
    /** The three parts of the application, in order */
    steps: [string, string, string];
    cvDrop: string;
    cvBrowse: string;
    cvReplace: string;
    cvRemove: string;
    portfolioOptional: string;
  };
};

export type Content = {
  company: {
    name: string;
    legalName: string;
    tagline: string;
    founded: number;
    team: string;
    teamSize: number;
    instagram: string;
    instagramHandle: string;
    website: string;
    email: string | null;
    emailCc: string | null;
    /** Gmail web compose link with the pre-filled project enquiry; every email link opens it */
    enquiryGmail: string;
    phones: Phone[];
    location: string | null;
    /** The floating "Get in touch" button on every page */
    whatsapp: { label: string; name: string; number: string; url: string; title: string; text: string; cta: string };
  };
  /** Primary navigation (header) */
  nav: NavItem[];
  /** Supporting pages: in the footer and linked from About */
  navMore: NavItem[];
  forms: FormCopy;
  ui: {
    startProject: string;
    seeWork: string;
    viewOnInstagram: string;
    placeholderImage: string;
    realProject: string;
    skip: string;
  };
  home: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    lead: string;
    facts: { label: string; value: string }[];
    visualCaption: [string, string];
    showreel: {
      label: string;
      title: string;
      sub: string;
      date: string;
      src: string;
      poster: string;
      instagram: string;
      soundOn: string;
      soundOff: string;
      watch: string;
      pressPlay: string;
      card: { left: string; right: string; place: string; line: string; hint: string };
    };
    work: { label: string; title: string; text: string };
    services: { label: string; title: string; text: string };
    beliefs: { label: string; title: string; text: string };
    process: { label: string; title: string; text: string };
    series: { label: string; title: string; text: string };
    contact: { label: string; title: string; text: string };
    clients: { label: string; title: string };
    /**
     * Brand films after the client logos: horizontal films only. `picks` are Drive ids of portfolio
     * pieces (any industry's work), in order. INTERIM picks until the studio supplies its 3 to 4 films.
     */
    films: { label: string; title: string; text: string; picks: string[] };
  };
  projects: Project[];
  industries: Industry[];
  beliefs: Belief[];
  process: Step[];
  episodes: Episode[];
  seriesUrl: string;
  about: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    paragraphs: string[];
    team: { title: string; text: string; url: string; reel: string; members: Member[] };
    join: { title: string; text: string };
  };
  workPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    indexLabel: string;
    studioTitle: string;
    studioText: string;
    nextTitle: string;
    nextText: string;
    ctaTitle: string;
    ctaText: string;
  };
  /** `stats` is the overview headline (brief, 11 Nov 2026); `title` stays for the admin */
  industriesPage: { metaTitle: string; metaDescription: string; title: string; lead: string; stats: string[] };
  /** About, in the approved wording (brief, 11 Nov 2026). Not editable in the admin. */
  aboutCopy: {
    title: string;
    paragraphs: string[];
    founders: { title: string; people: Person[] };
    partner: { label: string; name: string; line: string; text: string; people: Person[] };
    advisory: { title: string; people: Person[] };
    approach: { title: string; paragraphs: string[] };
    team: { label: string; title: string; text: string };
    more: { title: string; links: { href: string; title: string; text: string }[] };
  };
  careersPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    line: string;
    lead: string;
    model: string;
    disciplines: { title: string; text: string }[];
    culture: { label: string; title: string; text: string };
    people: { label: string; title: string; text: string; features: { label: string; name?: string; date?: string; caption?: string; photo?: string }[] };
    apply: { label: string; title: string; text: string; openings: string; openingsText: string };
  };
  partnersPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    line: string;
    ways: { label: string; title: string; items: { title: string; text: string }[] };
    bring: { label: string; title: string; text: string };
    steps: { label: string; title: string; items: string[]; note: string };
    form: { label: string; title: string; text: string };
  };
  contactPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    collaborate: string;
    email: { label: string; ccNote: string; phone: string; gmail: string; hint: string };
    next: { title: string; steps: { title: string; text: string }[] };
    talk: { title: string; text: string; cta: string };
    explore: { title: string; links: { href: string; title: string; text: string }[] };
    form: {
      steps: [string, string, string];
      progress: string;
      sentTitle: string;
      sentNext: string;
      needLabel: string;
      needs: string[];
      whenLabel: string;
      whens: string[];
      aboutLabel: string;
      aboutPlaceholder: string;
      name: string;
      brand: string;
      brandPlaceholder: string;
      email: string;
      phone: string;
      next: string;
      back: string;
      submit: string;
      sending: string;
      verifying: string;
      verify: { checking: string; interactive: string; verified: string; error: string; retry: string };
      edit: string;
      sent: string;
      failed: string;
      errors: { needs: string; brand: string; about: string; name: string; email: string; phone: string };
    };
  };
};
