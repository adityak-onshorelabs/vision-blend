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
  /** Uploaded still (from /admin), shown where the line drawing would be */
  cover?: string;
  crop: Crop;
};

export type Service = {
  slug: "branding" | "production" | "content";
  name: string;
  line: string;
  intro: string;
  deliverables: string[];
  outcome: string;
};

export type Belief = { text: string; date: string; url: string };

export type Step = { name: string; text: string; out: string };

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
    phone: string | null;
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
  services: Service[];
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
    team: { title: string; text: string; url: string; reel: string };
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
  servicesPage: { metaTitle: string; metaDescription: string; title: string; lead: string };
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
