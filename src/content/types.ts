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
  };
  nav: NavItem[];
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
  industriesPage: { metaTitle: string; metaDescription: string; title: string; lead: string };
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
