import { STANDARD_PROCESS, withDetails } from "./industry-details";
/*
  Vision Blend site content (English).

  Sources
  - Instagram @vision.blend, read 27 Oct 2026: bio ("Building brands with taste. Since 2023"),
    captions of the 12 most recent posts (projects, beliefs, A Week at Vision Blend reels,
    "Six people... one year" from People Files Edit 001, collaboration and hiring notes).
  - Brand assets supplied by the studio: wordmark (brown and white) and the copper key visual.

  - Project tracker sheet, filled in by the studio 1 Nov 2026: contact details, team, the five
    industries and the services under each.

  Still to come (tracked in README "Before launch")
  - Sharjeel's photo (the others came from the studio's Team folder, 13 Nov 2026).
  - Real project stills (project images are copper crops until then; reel previews load from Instagram).
*/
import { gmailCompose } from "@/lib/mail";
import { teamLine } from "@/lib/cms/team";
import type { Content, Member } from "./types";

const ig = "https://www.instagram.com/";

// Addresses from the studio's sheet, 1 Nov 2026: briefs go to Aquib, copied to Gursimar
const EMAIL = "aquib@visionblend.com";
const EMAIL_CC = "gursimar@visionblend.com";

const MEMBERS: Member[] = [
  { name: "Aquib Shaikh", role: "CEO and co-founder" },
  { name: "Gursimar Anand", role: "Creative director and co-founder" },
  { name: "Sheena Dave", role: "Design and post-production head", photo: "/images/team/sheena-dave.jpg" },
  { name: "Rohit Pathania", role: "Head of production", photo: "/images/team/rohit-pathania.jpg" },
  { name: "Rupesh Bhawar", role: "Head of cinematography", photo: "/images/team/rupesh-bhawar.jpg" },
  // 13 Nov 2026 (studio's updated changes): Shazia Shaikh removed from the roster, Sharjeel added,
  // in the doc's order. FROM SIMAR: Sharjeel's surname and role
  { name: "Sharjeel", role: "Team member" },
  // Photo from the studio's Team folder (13 Nov 2026), filed as "Aditya Suryavanshi": CONFIRM the surname
  { name: "Aditya Rajput", role: "Senior editor", photo: "/images/team/aditya.jpg" },
];
/** "Seven people": the count follows the team list (the admin swaps it wherever it appears) */
const TEAM = teamLine(MEMBERS.length);
/** The pre-filled project brief behind every email link (the admin can change the addresses) */
export const enquiryDraft = {
  to: EMAIL,
  cc: EMAIL_CC,
  subject: "New project enquiry",
  body: [
    "Hi Vision Blend,",
    "",
    "Brand or company:",
    "Industry:",
    "What we need (films, social media, ads, branding, launches):",
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
    team: TEAM,
    teamSize: MEMBERS.length,
    instagram: `${ig}vision.blend/`,
    instagramHandle: "@vision.blend",
    website: "visionblend.in",
    email: EMAIL,
    emailCc: EMAIL_CC,
    enquiryGmail: gmailCompose(enquiryDraft),
    phones: [
      { name: "Aquib", number: "+91 90045 01607" },
      { name: "Gursimar", number: "+91 89282 79852" },
    ],
    location: "Mumbai",
    // Brief, 11 Nov 2026. FROM SIMAR: confirm this is Aquib's WhatsApp number.
    whatsapp: {
      label: "Get in touch",
      name: "Aquib",
      number: "+91 90045 01607",
      url: "https://wa.me/919004501607",
      // The secondary option on Contact
      title: "Rather *talk* first?",
      text: "Message Aquib on WhatsApp.",
      cta: "Message on WhatsApp",
    },
  },
  // Four primary pages; the standalone Work page was removed (brief, 11 Nov 2026)
  nav: [
    { href: "", label: "Home" },
    { href: "/industries", label: "Industries" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  // "Work with us" in the top bar, next to Industries (final changes, 12 Nov 2026), and in the footer
  navMoreLabel: "Work with us",
  navMore: [
    { href: "/careers", label: "Careers", text: "Full-time roles and internships" },
    { href: "/partners", label: "Partner with us", text: "Refer a client or collaborate as an agency" },
  ],
  forms: {
    optional: "Optional",
    sending: "Sending",
    verifying: "Verifying",
    verify: {
      checking: "Checking you're human",
      interactive: "One quick check before we send",
      verified: "Verified",
      error: "We couldn't verify this browser.",
      retry: "Try again",
    },
    privacy: "We use these details only to reply to you. We don't share them.",
    failed: "This could not be sent. Please try again, or message us on WhatsApp.",
    labels: {
      name: "Name",
      email: "Email",
      phone: "Phone number",
      business: "Your business",
      industry: "Your industry",
      about: "Tell us about your project",
      company: "Company / agency",
      partnerType: "Partnership type",
      opportunityAbout: "Tell us about the opportunity",
      city: "City",
      discipline: "Discipline",
      opportunity: "Opportunity",
      portfolio: "Portfolio or work-sample link",
      cv: "CV",
    },
    placeholders: { about: "What you need, and when.", portfolio: "https://", industry: "Choose one" },
    cvHint: "PDF or Word, up to 3 MB.",
    errors: {
      name: "Add your name.",
      email: "Add an email address like you@brand.com.",
      businessEmail: "Please use your business email address, e.g. name@company.com.",
      phone: "Add a phone number with at least 7 digits.",
      business: "Add your business or brand name.",
      industry: "Choose your industry, or Other.",
      company: "Add your company or agency.",
      partnerType: "Choose how you'd like to partner.",
      opportunityAbout: "Tell us a little about the opportunity.",
      city: "Add your city.",
      discipline: "Choose a discipline.",
      opportunity: "Choose full-time or internship.",
      portfolio: "Add a link to your work, starting with https://",
      cv: "Attach your CV as a PDF or Word file.",
      cvSize: "The CV must be 3 MB or smaller.",
    },
    project: {
      submit: "Send enquiry",
      sentTitle: "Enquiry received",
      sent: "Thank you. Your enquiry is with the studio, and we'll be in touch.",
      industryOther: "Other / not sure yet",
    },
    portfolio: {
      title: "See our work",
      intro: "Share a few details to explore our {industry} portfolio.",
      submit: "Submit & view work",
      close: "Close",
      opening: "Opening the portfolio",
    },
    partner: {
      submit: "Discuss a partnership",
      sentTitle: "Thank you",
      sent: "Your enquiry is with the studio, and we'll be in touch to discuss it.",
    },
    careers: {
      submit: "Send application",
      sentTitle: "Application received",
      sent: "Thank you for your interest in Vision Blend. We'll be in touch if there's a fit.",
      steps: ["About you", "Discipline and opportunity", "Your work"],
      cvDrop: "Drop your CV here, or",
      cvBrowse: "browse",
      cvReplace: "Replace",
      cvRemove: "Remove",
      portfolioOptional: "Optional for Sales & Business Development and Studio Operations.",
    },
  },
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
    lead: "Vision Blend is a marketing studio for brands that want to be remembered, not just seen.",
    facts: [
      { label: "Since", value: "2023" },
      { label: "Team", value: TEAM },
      { label: "Industries", value: "Four" },
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
      title: "Production *files*",
      text: "Films and studio projects, filed the way we post them. Hover a project to preview it.",
    },
    services: {
      label: "Services",
      title: "Four industries, *one team*",
      text: "Real estate, D2C, hospitality and service businesses, and automobile. Each gets the services it needs, made by the same team.",
    },
    beliefs: {
      label: "Beliefs",
      title: "*Opinions*, not rules",
      text: "Things we keep saying anyway. Each one started as a post on our feed.",
    },
    process: {
      label: "Process",
      title: "How a project *runs*",
      text: "The same four stages on every project, from script to delivery.",
    },
    series: {
      label: "Series",
      title: "A *Week* at Vision Blend",
      text: "From concepts to creations. A behind-the-scenes reel from the studio, most weeks.",
    },
    contact: {
      label: "Contact",
      title: "Start a *project*",
      text: "Tell us about your business and what it needs.",
    },
    clients: { label: "Our Clients", title: "A selection of client *partnerships*" },
    films: {
      label: "Brand films",
      title: "Selected *films*",
      text: "One at a time. Swipe through, then press play.",
      // INTERIM until Simar supplies the 3 to 4 horizontal films and their order: the Real Estate
      // portfolio's horizontal films (Meghna One, FIFA at Sai World Empire, What Home Means to Me,
      // the Presidence One walkthrough).
      picks: [
        "1KMTPWlexhYShufdPGsr1nWFMvBDZ4LNN",
        "1gZlwDXM3aOM0yA8PuwWBA6Q0l7chFQEs",
        "1DsE2gCe-hPG4Y7NM5BRfaLh-FEm89WY_",
        "1nCQyqf2hQBEkQpAToOk7hSUWX14-UuWA",
      ],
    },
  },
  projects: [
    {
      slug: "fifa-x-paradise",
      featured: true,
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
  industries: withDetails([
    { slug: "real-estate", name: "Real Estate", services: ["AV films", "Social media", "Ads", "Branding", "Event launches"] },
    { slug: "d2c", name: "D2C", note: "Direct-to-consumer brands", services: ["Social media", "Ads", "Product shoots", "Brand films", "Event launches"] },
    // One page for both since the 5 Nov 2026 brief; the old /hospitality and /services addresses redirect here
    { slug: "hospitality-services", name: "Hospitality & Services", services: ["Social media", "Ads", "Brand films", "Events & launches", "Branding"] },
    { slug: "automobile", name: "Automobile", services: ["Social media and ads", "Brand films", "Events and launches"] },
  ]),
  beliefs: [
    { text: "Good creative doesn't ask for attention. It earns it.", date: "Sep 2026", url: `${ig}p/DdosU14Eu4Z/` },
    { text: "Attention is temporary. Recognition compounds.", date: "Aug 2026", url: `${ig}p/DcA9_fKqHeb/` },
    { text: "Virality isn't the enemy. Chasing it is.", date: "Sep 2026", url: `${ig}p/DdJkd4WII4j/` },
    { text: "Build to be remembered, not just seen.", date: "Aug 2026", url: `${ig}p/DcA9_fKqHeb/` },
  ],
  // The same four stages as every industry page (final changes, 12 Nov 2026)
  process: STANDARD_PROCESS.steps,
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
    metaDescription: `A marketing studio of ${TEAM.toLowerCase()}, building brands with taste since 2023.`,
    title: "A small studio that builds brands to be *remembered*",
    lead: "Vision Blend started in 2023 with one idea: good creative doesn't ask for attention, it earns it.",
    paragraphs: [
      "We work with real estate, D2C, service, hospitality and automobile brands, so a brand's films, its feed and its launches come from the same brief and the same people.",
      "We care about reach, but more about recognition. A million views mean very little if nobody remembers who made the work.",
    ],
    team: {
      title: `${TEAM}. *One studio*.`,
      text: "Different personalities, showing up, figuring things out and making good work together. Meet them in People Files, Edit 001.",
      url: `${ig}p/DerceBciGd5/`,
      reel: `${ig}reel/DbvYEMToEz0/`,
      members: MEMBERS,
    },
    join: {
      title: "Work *with us*",
      text: "Creatives looking to collaborate on future projects can DM us on Instagram.",
    },
  },
  workPage: {
    metaTitle: "Work",
    metaDescription: "Films, studio projects and series from Vision Blend: FIFA x Paradise, Hands Behind The Brand and more.",
    title: "Production *files*",
    lead: "Films and studio projects, filed the way we post them. Press play on any of them.",
    indexLabel: "In this file",
    studioTitle: "From the *studio*",
    studioText: "Our own work: the people behind Vision Blend and the week-to-week of making it.",
    nextTitle: "Next in the file",
    nextText: "Case studies we are writing up now.",
    ctaTitle: "Have a *brief* like these",
    ctaText: "Tell us about the brand and what it needs. We read every brief and reply with next steps.",
  },
  industriesPage: {
    metaTitle: "Industries",
    lead: "Pick an industry to see how we work with brands in it.",
    metaDescription: "Films, social media, ads, branding and launches for real estate, D2C, service businesses, hospitality and automobile brands.",
    title: "Four industries, *one team*",
    // Brief, 11 Nov 2026. FROM SIMAR: verify the content count before launch.
    // *stars* mark the figure
    stats: ["*10,000+* content pieces created", "*₹50 Cr+* revenue generated", "*4* industries"],
  },
  // About Us, approved website copy (brief, 11 Nov 2026). Portraits FROM SIMAR.
  aboutCopy: {
    title: "Creative thinking. *Commercial intent*",
    paragraphs: [
      "Founded in 2023, Vision Blend brings together business strategy, creative storytelling, and performance marketing to help brands grow.",
      "We believe compelling content earns attention. When it reaches the right audience with a clear purpose, it can shape perception, influence decisions, and create demand.",
      "Our work connects what a brand says, how it is seen, and what happens next.",
    ],
    founders: {
      title: "Our *founders*",
      people: [
        {
          name: "Aquib Shaikh",
          role: "Founder & CEO",
          photo: "/images/team/aquib-shaikh-portrait.jpg",
          bio: [
            "Aquib leads business strategy, sales, and operations at Vision Blend.",
            "Previously Chief Business Officer at Brego Business, formerly Savage & Palmer, he built and scaled its marketing vertical. He brings a commercial perspective to the studio, connecting creative ambition with business priorities.",
          ],
        },
        {
          name: "Gursimar Anand",
          role: "Co-founder & Creative Director",
          photo: "/images/team/gursimar-anand.jpg",
          bio: [
            "Gursimar leads creative strategy, storytelling, and content at Vision Blend.",
            "His experience includes work with CarWale and Mercedes-Benz, alongside building his own content presence. His approach combines a creator’s instinct with a brand’s perspective: work that captures attention and gives people a reason to remember.",
          ],
        },
      ],
    },
    partner: {
      label: "Our performance partner",
      name: "DigiNerd",
      line: "Strategy, media, and measurement",
      text: "DigiNerd leads Vision Blend’s performance marketing vertical, spanning digital advertising, media buying, lead generation, campaign optimisation, and analytics.",
      people: [
        {
          name: "Abhilash Gaur",
          role: "Co-founder, DigiNerd",
          photo: "/images/team/abhilash-gaur-portrait.jpg",
          bio: ["Abhilash brings expertise in growth strategy, performance marketing, and business development, helping align campaigns with broader commercial objectives."],
        },
        {
          name: "Dilip Gehlot",
          role: "Co-founder, DigiNerd",
          photo: "/images/team/dilip-gehlot.jpg",
          bio: ["Dilip specialises in campaign execution, optimisation, and analytics, with a focus on improving advertising efficiency and returns."],
        },
      ],
    },
    advisory: {
      title: "Investment & *advisory*",
      people: [
        {
          // Approved correction (final changes, 12 Nov 2026): full name, roles in this order, revised bio
          name: "Mr. Abdul Gani Abdul Rehman Dadan",
          role: "Director, Dadan Enterprises | Strategic Investor, Vision Blend",
          photo: "/images/team/abdul-gani-dadan.jpg",
          bio: [
            "A Navi Mumbai-based real estate entrepreneur, Mr Dadan brings expertise in development, land acquisition, and business expansion.",
            "He also serves as a Director at Space Realty, specialising in plan sanctions and legal operations. At Vision Blend, he contributes industry insight and a long-term commercial perspective.",
          ],
        },
        {
          name: "Inderpal Anand",
          role: "Strategic Advisor",
          photo: "/images/team/inderpal-anand.jpg",
          bio: [
            "With approximately three decades of business leadership across automotive, petroleum, and other industries, Mr Anand advises Vision Blend on growth, sales, marketing, and operations.",
            "As CEO of Garnet Motors, he brings practical experience in building businesses and strengthening their market presence.",
          ],
        },
      ],
    },
    approach: {
      title: "One connected *approach*",
      paragraphs: [
        "Business understanding shapes the strategy. Creative thinking gives it expression. Performance marketing brings distribution, measurement, and refinement.",
        "Together, we work towards stronger brands, qualified enquiries, and sustainable growth.",
      ],
    },
    // FROM SIMAR: confirm the current team names and roles, and supply portraits
    // 13 Nov 2026 (studio's updated changes): heading and subtitle as given
    team: {
      label: "Core team",
      title: "Meet Our *Core Team*",
      text: "The people leading the work, backed by 30+ execution team members who bring it to life.",
    },
    more: {
      title: "Work *with us*",
      links: [
        { href: "/careers", title: "Careers", text: "Full-time roles and internships, in the studio." },
        { href: "/partners", title: "Partner with us", text: "Refer a client, or bring us into your agency's next brief." },
      ],
    },
  },
  // WORKING COPY (brief, 11 Nov 2026): full-time roles, internships, in-studio work and the disciplines are confirmed
  careersPage: {
    metaTitle: "Careers",
    metaDescription: "Full-time roles and internships at Vision Blend, in the studio in Mumbai.",
    title: "Good work begins with *good people*",
    line: "For people with a point of view, and the craft to express it.",
    lead: "Explore opportunities at Vision Blend.",
    model: "Full-time roles and internships · In-studio",
    // The disciplines as confirmed in the brief; Sales & Business Development added 13 Nov 2026
    disciplines: [
      { title: "Strategy & Ideation", text: "Content strategy, concepts and ideation." },
      { title: "Film & Production", text: "Cinematographer and cinematography assistant." },
      { title: "Post-production", text: "Video editor." },
      { title: "Design", text: "Designer." },
      { title: "Social Media", text: "Social media manager." },
      { title: "Sales & Business Development", text: "Client acquisition, partnerships and account growth." },
      { title: "Studio Operations", text: "Operations and coordination." },
    ],
    culture: {
      label: "Culture",
      title: "Beyond the *brief*",
      text: "Studio days, shared milestones, and time away from the desk. A glimpse of the people and moments that make Vision Blend.",
    },
    // Beyond the brief: the team away from work, from the studio's Drive (13 Nov 2026)
    gallery: [
      { src: "/images/careers/01-villa-team-photo.jpg", alt: "The team together on a villa terrace by the pool", w: 1280, h: 720 },
      { src: "/images/careers/02-villa-poolside.jpg", alt: "Three of the team laughing on poolside loungers", w: 1280, h: 720 },
      { src: "/images/careers/03-villa-pool-fun.jpg", alt: "The team splashing about in a villa pool", w: 1280, h: 720 },
      { src: "/images/careers/04-villa-dj.jpg", alt: "A teammate in sunglasses at the DJ decks", w: 1280, h: 720 },
      { src: "/images/careers/05-villa-candid.jpg", alt: "Teammates chatting on a sunny terrace", w: 1280, h: 720 },
      { src: "/images/careers/06-creative-meeting.jpg", alt: "A creative meeting around the studio table", w: 1280, h: 720 },
      { src: "/images/careers/07-lighting-crew.jpg", alt: "The crew rigging lights on set in an empty apartment", w: 900, h: 1600 },
      { src: "/images/careers/08-gimbal-bts.jpg", alt: "Filming on a gimbal among the trees, behind the scenes", w: 1600, h: 1068 },
      { src: "/images/careers/09-casual-group.jpg", alt: "Five of the team squeezed onto a sofa for a photo", w: 1280, h: 720 },
      { src: "/images/careers/10-festival-dinner.jpg", alt: "The team at a long festive dinner table", w: 1600, h: 1068 },
      { src: "/images/careers/11-diwali-smiles.jpg", alt: "Teammates smiling over dinner at Diwali", w: 1600, h: 1068 },
      { src: "/images/careers/12-lonavala-cake.jpg", alt: "Cutting a cake on a night out in Lonavala", w: 1280, h: 720 },
    ],
    // FROM SIMAR: recognition images, captions, names and dates
    people: {
      label: "People in focus",
      title: "People in *focus*",
      text: "Recognition and milestones from the studio.",
      features: [{ label: "Employee of the Month" }],
    },
    apply: {
      label: "Apply",
      title: "Find your place at *Vision Blend*",
      text: "Share your experience, your interests, and a selection of your work.",
      openings: "Open applications",
      openingsText: "We hire across these areas through the year. Apply, and we'll be in touch when there's a fit.",
    },
  },
  // WORKING COPY (brief, 11 Nov 2026): client referrals, agency partnerships, individually agreed terms
  partnersPage: {
    metaTitle: "Partner with us",
    metaDescription: "Refer a client or collaborate as an agency. Partnerships with Vision Blend, on individually agreed terms.",
    title: "Partnerships, with *purpose*",
    lead: "Introduce a brand. Extend your agency’s capabilities. Create something together.",
    line: "Let’s explore where our work meets yours.",
    ways: {
      label: "Ways to partner",
      title: "Two ways to *work together*",
      items: [
        {
          title: "Refer a client",
          text: "Connect us with a business looking for branding, films, content, or performance marketing. We’ll discuss the opportunity and agree the partnership terms with you.",
        },
        {
          title: "Collaborate as an agency",
          text: "Bring Vision Blend into your next client brief. From creative development to production and content, we can shape a scope around the project.",
        },
      ],
    },
    bring: {
      label: "What we bring",
      title: "What we *bring*",
      text: "Brand identity, films, content, and production, with performance marketing delivered through our strategic partner, DigiNerd.",
    },
    steps: {
      label: "How it begins",
      title: "How it *begins*",
      items: ["Introduce yourself", "Discuss the opportunity", "Agree the scope and terms"],
      note: "Commercial terms are agreed individually. Project-specific ownership, scope and referral recognition are settled with each partner.",
    },
    form: { label: "Partnership enquiry", title: "Start a *conversation*", text: "Tell us who you are and what you have in mind." },
  },
  contactPage: {
    metaTitle: "Start a project",
    metaDescription: "Tell Vision Blend about your brand and what it needs.",
    title: "Start a *project*",
    lead: "Tell us about your business and what it needs.",
    collaborate: "Creatives looking to collaborate on future projects can DM us on Instagram.",
    email: {
      label: "Email the studio",
      ccNote: "Briefs also reach",
      phone: "Or call",
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
      title: "Rather *talk* first?",
      text: "Message the studio on Instagram. The same team reads the DMs.",
      cta: "Message @vision.blend",
    },
    explore: {
      title: "Not *ready* yet?",
      links: [
        { href: "/work", title: "See the work", text: "Films and studio projects, filed the way we post them." },
        { href: "/industries", title: "Industries we serve", text: "Films, social, ads and launches for four industries." },
        { href: "/about", title: "Who we are", text: `${TEAM} building brands to be remembered.` },
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
