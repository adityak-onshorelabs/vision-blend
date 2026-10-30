/*
  Vision Blend site content (English).

  Sources
  - Instagram @vision.blend, read 27 Oct 2026: bio ("Building brands with taste. Since 2023"),
    captions of the 12 most recent posts (projects, beliefs, A Week at Vision Blend reels,
    "Six people... one year" from People Files Edit 001, collaboration and hiring notes).
  - Brand assets supplied by the studio: wordmark (brown and white) and the copper key visual.

  Needs client confirmation (not marked on the page; tracked in README "Before launch")
  - Service deliverable lists (drafted from captions and hashtags).
  - Process steps.
  - Studio city/address (not public).
  - Whether "Six people" is the full team.
  - Real project stills (project images are copper crops until then; reel previews load from Instagram).
*/
import { gmailCompose } from "@/lib/mail";
import type { Content } from "./types";

const ig = "https://www.instagram.com/";

// Addresses from the studio, 30 Oct 2026 (typed as "visionblend@gmail.comm" and "gursimar@visionblend"; confirm both)
const EMAIL = "visionblend@gmail.com";
const EMAIL_CC = "gursimar@visionblend.in";
const DRAFT = {
  to: EMAIL,
  cc: EMAIL_CC,
  subject: "New project enquiry",
  body: [
    "Hi Vision Blend,",
    "",
    "Brand or company:",
    "What we need (branding, film, content):",
    "Timeline:",
    "A little about the project:",
    "",
    "Thanks,",
  ].join("\n"),
};

export const en: Content = {
  company: {
    name: "Vision Blend",
    legalName: "Vision Blend™",
    tagline: "Building brands with taste.",
    founded: 2023,
    team: "Six people",
    instagram: `${ig}vision.blend/`,
    instagramHandle: "@vision.blend",
    website: "visionblend.in",
    email: EMAIL,
    emailCc: EMAIL_CC,
    enquiryGmail: gmailCompose(DRAFT),
    location: null,
  },
  nav: [
    { href: "/work", label: "Work" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  ui: {
    startProject: "Start a project",
    seeWork: "See the work",
    viewOnInstagram: "View on Instagram",
    placeholderImage: "Illustration",
    realProject: "Published project",
    skip: "Skip to content",
  },
  home: {
    metaTitle: "Vision Blend. Building brands with taste.",
    metaDescription:
      "Vision Blend is a marketing studio for brands that want to be remembered, not just seen. Branding, film and production, and content, made by one team since 2023.",
    eyebrow: "Marketing studio · Est. 2023",
    lead: "Vision Blend is a marketing studio for brands that want to be remembered, not just seen. Identity, production and content, made by one team.",
    facts: [
      { label: "Since", value: "2023" },
      { label: "Team", value: "Six people" },
      { label: "Practice", value: "Brand, film, content" },
    ],
    visualCaption: ["Key visual, copper blend", "Est. 2023"],
    showreel: {
      label: "Production Files 001",
      title: "FIFA x Paradise",
      sub: "From concept to final cut.",
      date: "Aug 2026",
      // Drop the exported film at public/videos/fifa-x-paradise.mp4 (H.264, 1080p, under ~15 MB).
      // Until it exists the poster shows and the film opens on Instagram.
      src: "/videos/fifa-x-paradise.mp4",
      poster: "/images/key-bg.jpg",
      instagram: `${ig}p/DcGpzAIiJyo/`,
      soundOn: "Sound on",
      soundOff: "Sound off",
      watch: "Watch on Instagram",
      pressPlay: "Press play",
      // Typographic take on the film's opening card (FIFA | Paradise Group over the pitch at
      // Sai World Empire, Kharghar). No logos reproduced.
      card: {
        left: "FIFA",
        right: "Sai World Empire",
        place: "Paradise Group, Kharghar",
        line: "A Vision Blend film for FIFA x Paradise.",
        hint: "Scroll to open the film",
      },
    },
    work: {
      label: "Selected work",
      title: "Production files",
      text: "Films and studio projects, filed the way we post them. Hover a project to preview it.",
    },
    services: {
      label: "Services",
      title: "Three practices, one brief",
      text: "The identity, the film and the feed come from the same team, so they read as one brand.",
    },
    beliefs: {
      label: "Beliefs",
      title: "Opinions, not rules",
      text: "Things we keep saying anyway. Each one started as a post on our feed.",
    },
    process: {
      label: "Process",
      title: "How a project runs",
      text: "Four steps, each ending with something you sign off.",
    },
    series: {
      label: "Series",
      title: "A Week at Vision Blend",
      text: "From concepts to creations. A behind-the-scenes reel from the studio, most weeks.",
    },
    contact: {
      label: "Contact",
      title: "Start a project",
      text: "Tell us about the brand and what it needs. We read every brief and reply with next steps.",
    },
  },
  projects: [
    {
      slug: "fifa-x-paradise",
      name: "FIFA x Paradise",
      sub: "Production Files 001",
      category: "Film",
      date: "Aug 2026",
      real: true,
      summary: "A film for FIFA x Paradise. The production team breaks down what went into building it.",
      body: [
        "Production is where the idea meets reality. For FIFA x Paradise the team took the film from concept to final cut, and shared how it was made as the first entry in our Production Files series.",
      ],
      instagram: { url: `${ig}p/DcGpzAIiJyo/`, kind: "post" },
      embed: "landscape",
      crop: { pos: "18% 30%", sz: "300%" },
    },
    {
      slug: "hands-behind-the-brand",
      name: "Hands Behind The Brand",
      sub: "Delta Palm Beach, Production Files 002",
      category: "Film",
      date: "Sep 2026",
      real: true,
      summary: "A film that brings the people building Delta Palm Beach into focus.",
      body: [
        "Every project has a story beyond what meets the eye. Hands Behind The Brand turns the camera on the people building Delta Palm Beach, so the brand is seen through the work and the hands that make it.",
      ],
      instagram: { url: `${ig}p/Dc8S6nAiLmp/`, kind: "post" },
      embed: "landscape",
      crop: { pos: "92% 45%", sz: "280%" },
    },
    {
      slug: "people-files",
      name: "People Files",
      sub: "Edit 001",
      category: "Studio",
      date: "Oct 2026",
      real: true,
      summary: "Six people, six personalities, one year at Vision Blend. A portrait edit of the team.",
      instagram: { url: `${ig}p/DerceBciGd5/`, kind: "post" },
      embed: "portrait",
      crop: { pos: "62% 78%", sz: "320%", bw: true },
    },
    {
      slug: "a-week-at-vision-blend",
      name: "A Week at Vision Blend",
      sub: "Ongoing reel series",
      category: "Own series",
      date: "2026",
      real: true,
      summary: "Weekly behind-the-scenes reels: branding, production reviews and client alignments.",
      instagram: { url: `${ig}reel/Dcqo2EsIWcu/`, kind: "reel" },
      embed: "reel",
      crop: { pos: "76% 98%", sz: "240%", bw: true },
    },
    {
      slug: "identity-system",
      name: "Identity system",
      sub: "Case study slot",
      category: "Branding",
      date: "Slot",
      real: false,
      summary: "A slot for a full identity project: mark, palette, type and applications.",
      crop: { pos: "34% 58%", sz: "300%" },
    },
    {
      slug: "content-retainer",
      name: "Content retainer",
      sub: "Case study slot",
      category: "Content",
      date: "Slot",
      real: false,
      summary: "A slot for a monthly content client, with the feed before and after.",
      crop: { pos: "96% 22%", sz: "260%" },
    },
  ],
  services: [
    {
      slug: "branding",
      name: "Branding & identity",
      line: "Names, marks and the rules that keep a brand recognisable before anyone reads the name.",
      intro:
        "Real brand building happens when people recognise you before they read your name. We shape the voice, the visuals and what the brand stands for, then write it down so it stays consistent.",
      deliverables: ["Logo and wordmark", "Colour and type system", "Brand guidelines", "Packaging and print", "Brand refresh"],
      outcome: "A brand that looks like itself everywhere it shows up.",
    },
    {
      slug: "production",
      name: "Film & production",
      line: "Production is where the idea meets reality. Films and shoots planned from the concept to the final cut.",
      intro:
        "Brand films, shoots and short-form, made by the same team that knows the brand. Our Production Files series shows how the work gets made.",
      deliverables: ["Brand films", "Product and lifestyle shoots", "Reels and short-form", "Behind-the-scenes series", "Editing and colour"],
      outcome: "Footage that feels like the brand, not like a template.",
    },
    {
      slug: "content",
      name: "Content & social",
      line: "Reach gets you seen. Consistent, well-made content makes you recognisable.",
      intro:
        "Virality isn't the enemy, chasing it is. We plan content that earns attention and builds recognition over time, and we take reach and quality together, never one at the cost of the other.",
      deliverables: ["Content strategy", "Monthly calendars", "Post and reel design", "Content marketing", "Community and reporting"],
      outcome: "A feed people recognise before they read the handle.",
    },
  ],
  beliefs: [
    { text: "Good creative doesn't ask for attention. It earns it.", date: "Sep 2026", url: `${ig}p/DdosU14Eu4Z/` },
    { text: "Attention is temporary. Recognition compounds.", date: "Aug 2026", url: `${ig}p/DcA9_fKqHeb/` },
    { text: "Virality isn't the enemy. Chasing it is.", date: "Sep 2026", url: `${ig}p/DdJkd4WII4j/` },
    { text: "Build to be remembered, not just seen.", date: "Aug 2026", url: `${ig}p/DcA9_fKqHeb/` },
  ],
  process: [
    { name: "Listen", text: "A call and a short questionnaire about the business, the audience and what is not working yet.", out: "A one-page brief" },
    { name: "Shape", text: "Concepts, references and a plan, aligned with you before anything is made.", out: "The creative direction" },
    { name: "Make", text: "Branding, shoots and edits, with production team reviews at set points.", out: "Finished assets" },
    { name: "Run", text: "Launch, then monthly content and reporting for brands that stay on.", out: "A brand in motion" },
  ],
  episodes: [
    { ep: 0, title: "Meet the core team", date: "", url: `${ig}reel/DbvYEMToEz0/`, crop: { pos: "50% 50%", sz: "220%", bw: true } },
    { ep: 1, title: "A week at Vision Blend", date: "30 Aug 2026", url: `${ig}reel/Dcqo2EsIWcu/`, crop: { pos: "85% 88%", sz: "260%", bw: true } },
    { ep: 2, title: "Branding, reviews and client alignments", date: "13 Sep 2026", url: `${ig}reel/DdOXUn6yVjF/`, crop: { pos: "62% 80%", sz: "300%", bw: true } },
    { ep: 3, title: "A little rewind of our week", date: "9 Oct 2026", url: `${ig}reel/DeRnifryRlh/`, crop: { pos: "98% 52%", sz: "280%", bw: true } },
    { ep: 4, title: "Hiring & Hyrox", date: "23 Oct 2026", url: `${ig}reel/De12XERTfZF/`, by: "@si__mar", crop: { pos: "74% 98%", sz: "240%", bw: true } },
  ],
  seriesUrl: `${ig}vision.blend/reels/`,
  about: {
    metaTitle: "About Vision Blend",
    metaDescription: "A marketing studio of six people, building brands with taste since 2023.",
    title: "A small studio that builds brands to be remembered",
    lead: "Vision Blend started in 2023 with one idea: good creative doesn't ask for attention, it earns it.",
    paragraphs: [
      "We work across identity, film and content, so a brand's logo, its films and its feed come from the same brief and the same people.",
      "We care about reach, but more about recognition. A million views mean very little if nobody remembers who made the work.",
    ],
    team: {
      title: "Six people. One year.",
      text: "Six different personalities, one year of showing up, figuring things out and making good work together. People Files, Edit 001.",
      url: `${ig}p/DerceBciGd5/`,
      reel: `${ig}reel/DbvYEMToEz0/`,
    },
    join: {
      title: "Work with us",
      text: "Creatives looking to collaborate on future projects can DM us on Instagram.",
    },
  },
  workPage: {
    metaTitle: "Work",
    metaDescription: "Films, studio projects and series from Vision Blend: FIFA x Paradise, Hands Behind The Brand and more.",
    title: "Production files",
    lead: "Films and studio projects, filed the way we post them. Press play on any of them.",
    indexLabel: "In this file",
    studioTitle: "From the studio",
    studioText: "Our own work: the people behind Vision Blend and the week-to-week of making it.",
    nextTitle: "Next in the file",
    nextText: "Case studies we are writing up now.",
    ctaTitle: "Have a brief like these",
    ctaText: "Tell us about the brand and what it needs. We read every brief and reply with next steps.",
  },
  servicesPage: {
    metaTitle: "Services",
    metaDescription: "Branding and identity, film and production, and content and social, from one studio.",
    title: "Three practices, one brief",
    lead: "The identity, the film and the feed come from the same team, so they read as one brand.",
  },
  contactPage: {
    metaTitle: "Start a project",
    metaDescription: "Tell Vision Blend about your brand and what it needs.",
    title: "Start a project",
    lead: "Tell us about the brand and what it needs. We read every brief and reply with next steps.",
    collaborate: "Creatives looking to collaborate on future projects can DM us on Instagram.",
    email: {
      label: "Email the studio",
      ccNote: "Briefs also reach",
      gmail: "Send us a message",
      hint: "Opens Gmail with a short brief ready to fill in.",
    },
    next: {
      title: "What happens next",
      steps: [
        { title: "Send the brief", text: "Email us the brand, what it needs and when. The draft has the questions ready." },
        { title: "We read it", text: "The team reads every brief before anyone replies." },
        { title: "We reply with next steps", text: "Starting with a call to understand the brand and what it needs." },
      ],
    },
    talk: {
      title: "Rather talk first?",
      text: "Message the studio on Instagram. The same team reads the DMs.",
      cta: "Message @vision.blend",
    },
    explore: {
      title: "Not ready yet?",
      links: [
        { href: "/work", title: "See the work", text: "Films and studio projects, filed the way we post them." },
        { href: "/services", title: "What we make", text: "Branding, film and production, content and social." },
        { href: "/about", title: "Who we are", text: "Six people building brands to be remembered." },
      ],
    },
    form: {
      steps: ["What you need", "The brand", "Your details"],
      progress: "Step {n} of 3",
      sentTitle: "Brief received",
      sentNext: "While you wait",
      needLabel: "What do you need?",
      needs: ["Branding", "Film & production", "Content & social", "Not sure yet"],
      whenLabel: "When would you like to start?",
      whens: ["This month", "In 1 to 3 months", "Just exploring"],
      aboutLabel: "About the brand",
      aboutPlaceholder: "What you sell, who buys it, and what feels off about the brand today.",
      name: "Name",
      brand: "Brand name or company name",
      brandPlaceholder: "The name people know you by",
      email: "Email",
      phone: "Phone",
      next: "Next",
      back: "Back",
      submit: "Send the brief",
      sending: "Sending",
      verifying: "Verifying",
      verify: {
        checking: "Checking you're human",
        interactive: "One quick check before we send",
        verified: "Verified",
        error: "We couldn't verify this browser.",
        retry: "Try again",
      },
      edit: "Edit",
      sent: "Thanks. Your brief is with the studio and we will reply with next steps.",
      failed: "The brief could not be sent. Please try again, or message us on Instagram.",
      errors: {
        needs: "Pick at least one option.",
        brand: "Add your brand or company name.",
        about: "Tell us a little about the brand.",
        name: "Add your name so we know who to reply to.",
        email: "Add an email address like you@brand.com.",
        phone: "Add a phone number with at least 7 digits, like +91 98765 43210.",
      },
    },
  },
};
