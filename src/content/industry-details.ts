/*
  Industry pages. Each one is shared on its own with prospects from that industry.

  Real Estate: Vision Blend's "Real Estate Landing Page: Approved Changes" doc (4 Nov 2026), which
  replaces the earlier tracker copy where they conflict. Hero, ten content categories, two purpose
  points, the four-step process and the closing are the doc's exact wording. FAQs are left as they
  were (their keep/remove/rewrite decision is still open with the studio). Titles drop a final full
  stop because the page adds the brand one; *stars* mark the highlighted key word. The hero photo
  (public/images/real-estate-hero-glass.jpg, 1536x1024, a cleaner version of the glass-corner shot
  the team picked) was chosen by the team and carries no placeholder tag. Branding plays the
  studio's own boards since 13 Nov 2026 (was an Unsplash stand-in).

  D2C, Hospitality & Services, Automobile: see the note above their entries below.

  No testimonials, metrics or results here: none have been approved for these pages. The one
  exception on client names is the logo strip on each sector page, from the studio's logos folders
  on Drive (Real Estate shared 5 Nov 2026; D2C, Hospitality & Services and Automobile 9 Nov 2026).
  Each file is turned into a one-colour mask (white on transparent, trimmed to the mark, at most
  900x220) in public/images/clients/<industry>/.
  - Real Estate: Mitkar's white windows, the black frame around Metro & Satyam, and the overlap of
    Meghna's text on its gold "1" were cleaned up in that step.
  - White text inside a solid shape is cut out of the mask (Revital, Neulife, Nova Fresh, Wedding
    Destination); Cup-ji and Dot came as JPGs on a solid ground, so only the mark was kept. ICE
    College and Mirana keep only their dark line work, MuscleBlaze's yellow "B" is a lighter tone.
  - Soft for want of larger files: Brego Land (198x23), Tata 1mg (320 px), Scratchgard (236x65),
    MuscleBlaze (404x316), Fang (200 px). Replace them when the studio has bigger ones.
*/
import { media } from "@/lib/media";
import type { Industry, IndustryDetail } from "./types";

type Extra = { summary: string; detail: IndustryDetail };

// Showcase clips: 12-second muted loops cut from the studio's Drive files, with their first frame as the poster
const clip = (name: string) => media(`/videos/real-estate/${name}.mp4`);
const reClip = (name: string, alt: string) => ({ src: media(`/videos/real-estate/${name}.jpg`), alt });
const ig = "https://www.instagram.com/";
/** A client logo mask from public/images/clients/<industry>/, with its measured size */
const logo = (industry: string, slug: string, name: string, w: number, h: number, scale?: number) => ({
  name,
  logo: `/images/clients/${industry}/${slug}.png`,
  ratio: [w, h] as [number, number],
  ...(scale ? { scale } : {}),
});
// `scale` evens out weight by eye: bold wordmarks down, the faint two-tone Meghna up
const reLogo = (slug: string, name: string, w: number, h: number, scale?: number) => logo("real-estate", slug, name, w, h, scale);
const d2cLogo = (slug: string, name: string, w: number, h: number, scale?: number) => logo("d2c", slug, name, w, h, scale);
const hsLogo = (slug: string, name: string, w: number, h: number, scale?: number) => logo("hospitality-services", slug, name, w, h, scale);
const autoLogo = (slug: string, name: string, w: number, h: number, scale?: number) => logo("automobile", slug, name, w, h, scale);

/*
  The one project process, shared by every sector page (the doc's wording, as on Real Estate) and
  the Industries overview. Final changes (12 Nov 2026): these four stages, in this order, wherever
  the process appears.
*/
export const STANDARD_PROCESS = {
  title: "Process",
  steps: [
    { name: "Strategy & Script", text: "Define the communication strategy and develop the script around the brand's purpose." },
    { name: "Visual Direction", text: "Present the visual deck and finalise the look and feel of the brand and content before production." },
    { name: "Shoot & Production", text: "Bring the approved script and visual direction to life through a planned shoot." },
    { name: "Editing & Delivery", text: "Refine the footage through editing, colour and sound, then deliver the finished content." },
  ],
};
const CLOSING = { title: "Let's *Work Together*", primary: "Start a Project", secondary: "Email Us" };
const designedToDo = (awareness: string, sales: string) => ({
  title: "What the work is *designed to do*",
  items: [
    { title: "Create Brand Awareness", text: awareness },
    { title: "Generate Sales", text: sales },
  ],
});
/** Until the studio sends sector photos: the copper key visual, tagged as a placeholder */
/*
  Sector heroes, in the Real Estate hero's manner (black and white, one calm detail, room for the
  heading). The brief leaves hero media to the studio ("editor to add an approved sector still or
  film"); none has been supplied, so these are Unsplash License photos, converted to B&W and resized
  to 2560 wide, until the studio sends its own: D2C, a stoneware bottle (Tom Crew, unsplash.com/photos/E64Hv5Ab_nQ);
  Hospitality & Services, a restaurant table (Michael Wave, unsplash.com/photos/gVkAiPchYhY);
  Automobile, a macro of a luxury saloon's LED headlight (Eyosias G, unsplash.com/photos/0ELj1YumPAI;
  swapped in 12 Nov 2026 for the earlier bodywork shot).
*/
const D2C_HERO = { src: "/images/d2c-hero-bottle.jpg", alt: "Black-and-white still life of a stoneware bottle on a table against a dark wall" };
const HOSPITALITY_HERO = {
  src: "/images/hospitality-services-hero-table.jpg",
  alt: "Black-and-white restaurant table in sunlight, with glassware casting long shadows across the cloth",
};
const AUTOMOBILE_HERO = { src: "/images/automobile-hero-headlight.jpg", alt: "Black-and-white macro of a luxury car's LED headlight under the bonnet line" };

const details: Record<string, Extra> = {
  "real-estate": {
    summary: "Films, branding and campaigns that bring your property story to life.",
    detail: {
      eyebrow: "Creative & marketing for real estate",
      headline: "Real Estate, *Articulated*",
      lead: "An exploration of spaces, identities and experiences through brand films, design and communication.",
      hero: {
        src: "/images/real-estate-hero-glass.jpg",
        alt: "Black-and-white view looking up at the glass corner of an office building against an overcast sky",
      },
      // The Introduction section was removed in the 4 Nov review: no intro paragraphs
      paragraphs: [],
      // Two rows in the strip: the first ten, then the rest. Mixed so neither row is all wordmarks.
      clients: {
        title: "Brands we've *worked with*",
        logos: [
          reLogo("hiranandani-communities", "Hiranandani Communities", 674, 220),
          reLogo("paradise-group", "Paradise Group", 521, 220),
          reLogo("aakasa", "Aakasa Shivaji Park", 748, 220),
          reLogo("sanghvi-realty", "Sanghvi Realty", 264, 220),
          reLogo("millennium", "Millennium", 900, 156),
          reLogo("meghna-realty", "Meghna Realty", 331, 220, 1.15),
          reLogo("krisala", "Krisala", 871, 159, 0.9),
          reLogo("delta", "Delta", 315, 220),
          reLogo("platinum-corp", "Platinum Corp", 900, 163, 0.85),
          reLogo("shelter", "Shelter Group", 282, 220),
          reLogo("house-of-hiranandani", "House of Hiranandani", 900, 158),
          reLogo("akshar", "Akshar", 340, 220),
          reLogo("presidence", "Presidence", 575, 220),
          reLogo("dream-developers", "Dream Developers", 433, 220),
          reLogo("platinum-group", "Platinum Group", 672, 139),
          reLogo("aura-realtors", "Aura Realtors", 266, 220),
          reLogo("metro-satyam", "Metro Group & Satyam Developers", 661, 220),
          reLogo("mitkar", "Mitkar Builders & Developers", 545, 220),
          reLogo("brego-land", "Brego Land", 198, 23, 0.72),
        ],
      },
      servicesTitle: "What we make for *real estate*",
      // Ten content categories, in the approved order. Public text is the title and subtitle only.
      // `assets` is the studio's Drive folder for each one (internal, never shown on the page).
      // Clips live in public/videos/real-estate/ (see the README there). `ratio` is each clip's own
      // frame (from the file), so reels stay vertical. Branding swipes through
      // the studio's brand boards (13 Nov 2026).
      offerings: [
        {
          title: "Testimonials",
          subtitle: "Stories from your customers",
          text: "",
          // Recut 13 Nov 2026 from the 1080 master (letterbox cropped), opening on the resident's name card
          image: reClip("testimonials", "A resident and his daughter on a garden bench, talking about their new home"),
          ratio: [1920, 816],
          video: clip("testimonials"),
          assets: "https://drive.google.com/drive/folders/1BGLnz80ZUdN1jyWVM9T1cGYt2Ov9UQ1S",
        },
        {
          title: "Social Media",
          subtitle: "Your brand's digital presence",
          text: "",
          image: reClip("social-media", "A presenter standing over an aerial view of a growing suburb, from a vertical reel"),
          ratio: [9, 16],
          video: clip("social-media"),
          assets: "https://drive.google.com/drive/folders/1MW6kiVgK0pYfjdnnr1NlBMbUtUyhYVqm",
        },
        {
          title: "Event Launches",
          subtitle: "The unveiling of a project",
          text: "",
          image: reClip("event-launches", "A speaker on stage at a project launch event"),
          ratio: [16, 9],
          video: clip("event-launches"),
          assets: "https://drive.google.com/drive/folders/1Uri1hR5l8YbHf4yK8Hr79OYjuZcCP_HM",
        },
        {
          // 13 Nov 2026: the studio's Branding folder (overall, print, grid boards) swiping one to the next
          title: "Branding",
          subtitle: "The visual identity of place",
          text: "",
          image: reClip("branding", "A real estate brand identity board: logo, type and stationery in black and gold"),
          ratio: [3, 4],
          video: clip("branding"),
          assets: "https://drive.google.com/drive/folders/10J2cs9gUg6v7pTyJ5LMXjk4wtsuS91Ua",
        },
        {
          title: "AV Films",
          subtitle: "Architecture, atmosphere and ambition",
          text: "",
          image: reClip("av-films", "A walkthrough of a commercial lobby with tall glass and polished stone"),
          ratio: [1646, 720],
          video: clip("av-films"),
          assets: "https://drive.google.com/drive/folders/1hJXjfH94d-zsEPxVAYQSn_GC_QRrIC06",
        },
        {
          title: "AI Films",
          subtitle: "Your vision, without a production shoot",
          text: "",
          image: reClip("ai-films", "An AI-generated scene of two people meeting in a wood-panelled office"),
          ratio: [16, 9],
          video: clip("ai-films"),
          assets: "https://drive.google.com/drive/folders/1nuk0f5uwJC-alyNsSOIGXYlyasyARtyw",
        },
        {
          title: "Construction Updates",
          subtitle: "A chronicle of progress",
          text: "",
          // Recut 13 Nov 2026 from Platinum Corp's 1080 file (was 480p)
          image: reClip("construction-updates", "A site supervisor in a hard hat reading plans among rising steel bars"),
          ratio: [16, 9],
          video: clip("construction-updates"),
          assets: "https://drive.google.com/drive/folders/1TxOvuLDke0N3T_aSLbOhMllsKHymoK9f",
        },
        {
          title: "Ads",
          subtitle: "To bring you sales",
          text: "",
          image: reClip("ads", "A vertical ad moving from the city skyline into a finished apartment"),
          ratio: [9, 16],
          video: clip("ads"),
          assets: "https://drive.google.com/drive/folders/1Hw1dZwzlV8cySOgGv2DiCTJNl-hkMgN3",
        },
        {
          title: "Campaign Film",
          subtitle: "High production documentary style videos",
          text: "",
          image: reClip("campaign-film", "Young players with a football on a rooftop pitch"),
          ratio: [16, 9],
          video: clip("campaign-film"),
          assets: "https://drive.google.com/drive/folders/1klXfQ4MsXOTAqcSrLLX-7qL9qJwVmf3d",
        },
        {
          // The Drive folder holds images only, so the clip is the seven slides swiping one to the next
          title: "Statics & Carousels",
          subtitle: "Narratives in composition",
          text: "",
          image: reClip("statics-carousels", "A set of carousel slides for a commercial building, swiping one to the next"),
          ratio: [4, 5],
          video: clip("statics-carousels"),
          assets: "https://drive.google.com/drive/folders/1ALLp5UZ8NJclhgIWglMjkMkZe--TNexw",
        },
      ],
      value: {
        title: "What the work is *designed to do*",
        items: [
          { title: "Create Brand Awareness", text: "Establish a distinct presence for your brand and its projects." },
          { title: "Generate Sales", text: "Turn buyer interest into enquiries and sales opportunities." },
        ],
      },
      challenges: [],
      process: {
        title: "Process",
        steps: [
          { name: "Strategy & Script", text: "Define the communication strategy and develop the script around your project's purpose." },
          { name: "Visual Direction", text: "Present the visual deck and finalise the look and feel of the brand and content before production." },
          { name: "Shoot & Production", text: "Bring the approved script and visual direction to life through a planned shoot." },
          { name: "Editing & Delivery", text: "Refine the footage through editing, colour and sound, then deliver the finished content." },
        ],
      },
      faqTitle: "A few things you might *want to know*",
      faqs: [
        { q: "Can we work with you for a single project launch?", a: "Yes. The scope can focus on a specific launch or combine selected services into a broader project campaign." },
        { q: "Can the film, social content and ads follow the same story?", a: "Yes. We can develop them around a shared creative direction so the project feels consistent across touchpoints." },
        { q: "What do you need to get started?", a: "Share the project brief, location, audience, launch timeline and available brand or project material. We can then discuss the services and assets needed." },
      ],
      cta: { title: "Let's *Work Together*", primary: "Start a Project", secondary: "Email Us" },
      enquiry: {
        prompt: "Tell us about your project.",
        placeholder: "What are you planning, who do you want to reach, and when would you like to launch?",
      },
      meta: {
        title: "Real Estate Films, Branding & Marketing | Vision Blend",
        description: "Explore real estate AV films, social media, ads, branding and event launches with Vision Blend. Build a clear story for your next property project.",
      },
      /*
        Portfolio subpage: every file in the studio's REAL ESTATE Drive folder (shared 5 Nov 2026,
        15 files across the category folders, AV/Ai included; Branding's 11 boards added 13 Nov 2026). Each file is one
        piece: Drive's thumbnail on the card, Drive's player in the lightbox. Ratios are measured
        from the files. FIFA and the Meghna film open on dark title cards, so they use the showcase
        posters instead. Titles and clients come from the file names and the slides' own headlines:
        DRAFT until the studio approves naming these clients (only Paradise is named elsewhere).
        Order: a mix of shapes and categories, so the grid does not read as one category at a time.
      */
      work: {
        title: "Work for *real estate*",
        lead: "Films, reels, launches and campaigns made for real estate brands, each one in full.",
        items: [
          { title: "Presidence One, BKC NEX walkthrough", category: "AV Films", drive: "1nCQyqf2hQBEkQpAToOk7hSUWX14-UuWA", kind: "film", ratio: [1280, 560] },
          { title: "Where Vision Meets Vista", category: "Ads", client: "Godrej", drive: "10nVCYk1p6P187ujbIGP_1X7H-LEvnaaT", kind: "film", ratio: [9, 16] },
          { title: "Where Better Work Begins", category: "Statics & Carousels", client: "Meghna Realty", drive: "1M_l_jlRKSJE4hXv4tJDpNFeC3RpWfNGT", kind: "still", ratio: [4, 5] },
          {
            title: "FIFA at Sai World Empire",
            category: "Campaign Film",
            client: "Paradise Group",
            drive: "1gZlwDXM3aOM0yA8PuwWBA6Q0l7chFQEs",
            kind: "film",
            ratio: [16, 9],
            poster: media("/videos/real-estate/campaign-film.jpg"),
          },
          // From the studio's brand films folder (13 Nov 2026), 4K
          { title: "Hands Behind the Brand: Site Supervisor", category: "Campaign Film", client: "Delta", drive: "1RF5iK-SKUm9dG63vSVAggjn56uMilnbw", kind: "film", ratio: [16, 9] },
          { title: "What Home Means to Me", category: "Testimonials", client: "Paradise Group", drive: "1DsE2gCe-hPG4Y7NM5BRfaLh-FEm89WY_", kind: "film", ratio: [1682, 720] },
          { title: "Upper Kharghar Growth Area", category: "Social Media", drive: "1PtF_MHTFZXERtyzO2KjttZXBylp77I2T", kind: "film", ratio: [9, 16] },
          { title: "Prime Business Address", category: "Statics & Carousels", client: "Meghna Realty", drive: "1OPcuhfV8kOCfRkNVke8jQ2_FGcztnciM", kind: "still", ratio: [4, 5] },
          { title: "Presidence One launch", category: "Event Launches", drive: "1eN3qZK8FqwKQZ_eS6-mHay9owxDsQlO_", kind: "film", ratio: [16, 9] },
          {
            title: "Meghna One brand film",
            category: "AI Films",
            client: "Meghna Realty",
            drive: "1KMTPWlexhYShufdPGsr1nWFMvBDZ4LNN",
            kind: "film",
            ratio: [16, 9],
            poster: media("/videos/real-estate/ai-films.jpg"),
          },
          { title: "IGBC-Certified Sustainable Landmark", category: "Statics & Carousels", client: "Meghna Realty", drive: "1ZHBWoN_SG5YY7crDp5C_OlCzPAREmiXd", kind: "still", ratio: [4, 5] },
          { title: "Site Supervisor", category: "Construction Updates", client: "Platinum Corp", drive: "10M-G_p2H5NBL6GNhvoyau2id5M5DCqkQ", kind: "film", ratio: [16, 9] },
          { title: "Your Office, Your Way", category: "Statics & Carousels", client: "Meghna Realty", drive: "1QZ8Njg2TvIIIpygOeKdvDAJ-nMY6gTqY", kind: "still", ratio: [4, 5] },
          { title: "A Smoother Start to Every Workday", category: "Statics & Carousels", client: "Meghna Realty", drive: "1OlhEiTcdKJGAt5_NEKBxzWcXcAMMg2TX", kind: "still", ratio: [4, 5] },
          { title: "Wellness Beyond the Workplace", category: "Statics & Carousels", client: "Meghna Realty", drive: "18ffMNJCo-xpfWW5VIXYEHD_vWQHbyi4a", kind: "still", ratio: [4, 5] },
          { title: "Your Own Personal Rainforest", category: "Statics & Carousels", client: "Meghna Realty", drive: "1NPcP56ChH6UOrCUdJoFsKsud0-zoiPu5", kind: "still", ratio: [4, 5] },
          // Branding (studio's Branding folder, 13 Nov 2026)
          { title: "Timeless luxury residence", category: "Branding", drive: "1s23o_HuDl1cha8HHrU7UetjWyYJE08_T", kind: "still", ratio: [1086, 1448] },
          { title: "Brand identity board", category: "Branding", drive: "1O1LIvSalEuWzS4X7B5UwsGeqJK_MBBsc", kind: "still", ratio: [736, 1104] },
          { title: "Brand story spreads", category: "Branding", drive: "1lxk6vcLKE5JacDPJCnSYejfmpMLIvogF", kind: "still", ratio: [736, 1308] },
          { title: "Stationery and print", category: "Branding", drive: "1g-YwsnWao-tqtwH8yxFlIvGDagH99_pH", kind: "still", ratio: [736, 1104] },
          { title: "Print brochure", category: "Branding", drive: "1TPrOB9cTYW3l1ZWMGHnkVtVNbkLrefIt", kind: "still", ratio: [1200, 2400] },
          { title: "Brochure mock-up", category: "Branding", drive: "1dAmCnd7Yzs6og-sKm-5xOj4Yw2vn0QeK", kind: "still", ratio: [1200, 1200] },
          { title: "Feed grid, refined brand", category: "Branding", drive: "16dyfK9XtF6Vw9NAt76QlSpq-13lAuJwL", kind: "still", ratio: [736, 920] },
          { title: "Feed grid, wellness", category: "Branding", drive: "1uEyJb9x4yYSa-gqMNYw--6LSOFW88mRC", kind: "still", ratio: [736, 1227] },
          { title: "Feed grid, residences", category: "Branding", drive: "1vdDb3sC1ENqvL0PXbWI0x9a2W_I1ensu", kind: "still", ratio: [2694, 1672] },
          { title: "Feed grid, launch", category: "Branding", drive: "1SF9vfLAUOHndm8kJnSWrFb0qPwrgCf1-", kind: "still", ratio: [2446, 2210] },
          { title: "Feed grid, new address", category: "Branding", drive: "1yuL2Bovd_xxHCG1clW5RXTiFTNIBocAf", kind: "still", ratio: [1973, 1633] },
        ],
      },
    },
  },
  /*
    D2C, Hospitality & Services, Automobile: the studio's "Industry Landing Pages: Master
    Reference" doc (5 Nov 2026), one tab per sector, built on the Real Estate layout. Hero,
    category titles and subtitles, purpose points, process and closing are the doc's wording.
    FAQs keep the current text until the studio approves the doc's drafts (the merged Hospitality
    & Services page has no current text, so it uses the drafts). Client names stay out of the
    work titles; the logo strips (see the top of this file) are the only place clients are named.

    D2C media (final content, 12 Nov 2026): the studio's category folders replace the Instagram
    reels. Product & AI, Cinematic / Event, Vox Pop, Founder-led and Festive lead with a 12-second
    loop cut from the first film in each folder; every film is on the work page, playing from
    Drive. Informative Carousels keeps its Instagram post; Product Creatives plays the studio's
    statics (13 Nov 2026), and the Creatives folder's statics and carousels are on the work page. Earlier note, still true for Model-led: it leads with
    a 12-second loop (public/videos/d2c/, 6-18 s of the centre Drive file, 1uWBG_iXqgcrGezrzCefu5I6DF70HGB-p,
    a private file shared with the team); the left file is the one the doc flags as the wrong
    film, so it is not used. Offer Creatives (placeholder) was removed 13 Nov 2026. Heroes: see the note above the hero
    constants.

    Final content (studio's portfolio Drive, 12 Nov 2026): Hospitality & Services and Automobile get
    their portfolios and lead card loops (12 s, cut by npm run media:import) from the category
    folders; categories whose folders are still empty (H&S Brand Films, Events & Launches,
    Branding, Statics; Automobile Ads, Statics) keep their placeholder cards. Automobile gains an
    AI Videos category from its Drive folder. Several automotive and one H&S film are the studio's
    Instagram downloads (360p-720p); ask for 1080p exports. Titles are ours, from the file names,
    kept free of client names.
  */
  d2c: {
    summary: "Product shoots, feeds and ads that turn scrolling into buying.",
    detail: {
      eyebrow: "Creative & marketing for D2C",
      headline: "D2C, *Considered*",
      lead: "An exploration of products, identities and everyday rituals through brand films, design and communication.",
      hero: D2C_HERO,
      paragraphs: [],
      // Two rows of eleven, wordmarks and marks mixed in each
      clients: {
        title: "Brands we've *worked with*",
        logos: [
          d2cLogo("tata-1mg", "Tata 1mg", 288, 64, 0.9),
          d2cLogo("frido", "Frido", 634, 220),
          d2cLogo("wellbeing-nutrition", "Wellbeing Nutrition", 233, 220),
          d2cLogo("bonkers-corner", "Bonkers Corner", 900, 214, 0.95),
          d2cLogo("muscleblaze", "MuscleBlaze", 174, 123, 0.85),
          d2cLogo("minimalist", "Minimalist", 900, 149, 0.9),
          d2cLogo("nova-fresh", "Nova Fresh", 229, 220),
          d2cLogo("paris-belle", "Paris Belle", 488, 220, 1.1),
          d2cLogo("neulife", "Neulife", 431, 220, 0.9),
          d2cLogo("supply6", "Supply6", 791, 220, 0.9),
          d2cLogo("cup-ji", "Cup-ji", 220, 220, 0.85),
          d2cLogo("truebasics", "TrueBasics", 900, 202, 0.9),
          d2cLogo("esbeda", "Esbeda", 295, 220),
          d2cLogo("chuckle", "Chuckle", 825, 220),
          d2cLogo("ajmal", "Ajmal", 121, 220, 1.05),
          d2cLogo("revital", "Revital", 736, 220),
          d2cLogo("onyc", "ONYC", 640, 220),
          d2cLogo("dot", "Dot", 279, 206, 0.9),
          d2cLogo("baller-athletik", "Baller Athletik", 900, 172),
          d2cLogo("smart-pet", "Smart Pet", 749, 173, 0.9),
          d2cLogo("ashiesh-shah", "Ashiesh Shah Architect", 900, 147, 1.1),
          d2cLogo("fang", "Fang", 200, 105, 0.8),
        ],
      },
      servicesTitle: "What we make for *D2C brands*",
      offerings: [
        {
          title: "Product & AI Content",
          subtitle: "Products in imagined and observed settings",
          text: "",
          image: { src: media("/videos/d2c/onyc-sketch-to-step.jpg"), alt: "A line sketch of a pair of children's shoes on a grey backdrop, from a vertical product reel" },
          ratio: [1080, 1920],
          video: media("/videos/d2c/onyc-sketch-to-step.mp4"),
        },
        {
          title: "Cinematic / Event Content",
          subtitle: "Brand narratives and occasions, on film",
          text: "",
          image: { src: media("/videos/d2c/esbeda-event-lake-shore-mall-post-event-reel.jpg"), alt: "A bag store's interior with the brand's name over it, from a vertical post-event reel" },
          ratio: [1080, 1920],
          video: media("/videos/d2c/esbeda-event-lake-shore-mall-post-event-reel.mp4"),
        },
        {
          title: "Vox Pop Content",
          subtitle: "Public perspectives, in conversation",
          text: "",
          image: { src: media("/videos/d2c/parisbelle-v4.jpg"), alt: "An interviewer with a microphone asking a guest about a fragrance launch, from a vertical vox pop reel" },
          ratio: [1080, 1920],
          video: media("/videos/d2c/parisbelle-v4.mp4"),
        },
        {
          title: "Founder-led Content",
          subtitle: "The perspective behind the brand",
          text: "",
          image: { src: media("/videos/d2c/up-and-run-ritu-intro-video-02.jpg"), alt: "A co-founder seated in an armchair, speaking to camera, from a vertical introduction reel" },
          ratio: [1080, 1920],
          video: media("/videos/d2c/up-and-run-ritu-intro-video-02.mp4"),
        },
        {
          title: "Model-led / UGC Content",
          subtitle: "Products through personal experience",
          text: "",
          image: { src: media("/videos/d2c/model-led-ugc.jpg"), alt: "A man in a brown shirt talking to camera about a fragrance, from a vertical reel" },
          ratio: [9, 16],
          video: media("/videos/d2c/model-led-ugc.mp4"),
        },
        {
          title: "Festive Campaigns",
          subtitle: "Brand stories within cultural occasions",
          text: "",
          image: { src: media("/videos/d2c/tvc-1-ajmal-bucket-3-storytelling-tvc-full-scripts-2.jpg"), alt: "A woman handing a boy a gift box at a festive gathering, from a vertical storytelling film" },
          ratio: [1080, 1920],
          video: media("/videos/d2c/tvc-1-ajmal-bucket-3-storytelling-tvc-full-scripts-2.mp4"),
        },
        { title: "Informative Carousels", subtitle: "Product knowledge, in sequence", text: "", instagram: `${ig}p/DQwf1RMki7a/` },
        {
          // 13 Nov 2026: the studio's statics and carousel covers swiping one to the next, replacing the Instagram post
          title: "Product Creatives",
          subtitle: "Form, benefit and detail in composition",
          text: "",
          image: { src: media("/videos/d2c/product-creatives.jpg"), alt: "A product static for a red leather work tote, the first of a set of D2C creatives" },
          ratio: [4, 5],
          video: media("/videos/d2c/product-creatives.mp4"),
        },
      ],
      value: designedToDo("Establish a distinct presence for your brand and its products.", "Turn product interest into purchases."),
      challenges: [],
      process: STANDARD_PROCESS,
      faqs: [
        { q: "Do you run the ads as well as make them?", a: "Yes, we can plan, make and run campaigns, or hand creative to your team." },
        { q: "How many creatives a month?", a: "It depends on the plan. We agree the number up front and stick to it." },
        { q: "Can you shoot at our warehouse?", a: "Yes, we shoot on location or in a studio." },
      ],
      cta: CLOSING,
      // The remaining links from each category row. Titles describe the piece, never the client.
      work: {
        title: "Work for *D2C brands*",
        lead: "Product films, launches, founder stories, vox pops and festive campaigns made for D2C brands, each one in full.",
        items: [
          { title: "Sketch to step", category: "Product & AI Content", drive: "1tkkC99yee4JwNLt7L1Mp_Xvq7-rnyKp4", kind: "film", ratio: [2160, 3840] },
          { title: "Unwrap their next pair", category: "Product & AI Content", drive: "1vTTI_rQmAqItIKCxB_hT9xERRYpNtB10", kind: "film", ratio: [1080, 1920] },
          { title: "Five ways to style a pin", category: "Product & AI Content", drive: "1uZj1_7qRhIRz4xpL7U6lWetRpupE1Uh1", kind: "film", ratio: [1080, 1920] },
          { title: "Name badges, made to order", category: "Product & AI Content", drive: "193xxky1Ksbo4S6Fp5QRofRU-oZ0dt9tK", kind: "film", ratio: [1080, 1920] },
          { title: "Malabar Coast", category: "Product & AI Content", drive: "17PJ9NbAwsYovarh6Bdh1HVgnox6JubCE", kind: "film", ratio: [1080, 1920] },
          { title: "Stepwell geometry", category: "Product & AI Content", drive: "1xmw1NO6mZzQ-DPUajdXS06_ebBTjMm5I", kind: "film", ratio: [1080, 1920] },
          { title: "Promesse", category: "Product & AI Content", drive: "1VKUzZNbaK06Rko59NcE_zvattHFEpAXN", kind: "film", ratio: [1080, 1920] },
          { title: "Zimara", category: "Product & AI Content", drive: "11ZDPDNQHbdfoeWfhPcTbaazHqAjLfZ5t", kind: "film", ratio: [1080, 1920] },
          { title: "Alara", category: "Product & AI Content", drive: "19dcWg8qnZOoky9aJPcFfqviEeKmRLTbb", kind: "film", ratio: [1080, 1920] },
          { title: "After the event", category: "Cinematic / Event Content", drive: "1zz5nV1UASZnUPfi6e76Lo4I_SOUt_Z0p", kind: "film", ratio: [1080, 1920] },
          { title: "Event highlights, day one", category: "Cinematic / Event Content", drive: "1zrt6tx7IXCTfQd0Gg07kocphoHTwIm_P", kind: "film", ratio: [1080, 1920] },
          { title: "The 2025 collection", category: "Cinematic / Event Content", drive: "1M44J2ylKzQ-aoClh1tORTWgmXnKhpG7K", kind: "film", ratio: [1080, 1920] },
          { title: "A celebrity launch", category: "Cinematic / Event Content", drive: "1O_JNapoX7rlYPZ5EvHydLuYwHowfy7NZ", kind: "film", ratio: [1080, 1920] },
          { title: "A celebrity launch, part two", category: "Cinematic / Event Content", drive: "1rtiuagPHjoEBR8H1T6jt7IiUE37WVJ5Q", kind: "film", ratio: [1080, 1920] },
          { title: "On the street", category: "Vox Pop Content", drive: "1Nr-ng6oQKXlF6eXjZSzIs07Jg5BClkyy", kind: "film", ratio: [1080, 1920] },
          { title: "On the street, part two", category: "Vox Pop Content", drive: "1SOwr2o62l2W6fqVaCMAPZ9mzNbpiotvR", kind: "film", ratio: [1080, 1920] },
          { title: "Quick takes", category: "Vox Pop Content", drive: "1lqRW23h0TF8Y6yFns_GIv1l2HjAHeAnz", kind: "film", ratio: [720, 1280] },
          { title: "Made for little adventures", category: "Vox Pop Content", drive: "1JWYRuqDYKKdwDvBwOT-2SdeKrckzN2l2", kind: "film", ratio: [1080, 1920] },
          { title: "Days before", category: "Vox Pop Content", drive: "16jaiIPTjSWPFdVru3908azGMQXepLPRB", kind: "film", ratio: [1080, 1920] },
          { title: "Meet the founder", category: "Founder-led Content", drive: "1GFZa8X_0PKptVmIsn0X8Zs3QOzgp1H3_", kind: "film", ratio: [1080, 1920] },
          { title: "You're not drinking water the right way", category: "Founder-led Content", drive: "1tiFzfVweSZwKRIOAhlquQ8Ogr9qD-kRI", kind: "film", ratio: [1080, 1920] },
          { title: "Promo film", category: "Founder-led Content", drive: "19dMrxMh-TzjYQQrQv66yni0j6c9l6nJY", kind: "film", ratio: [1080, 1920] },
          { title: "Exaggerated reviews", category: "Founder-led Content", drive: "1EOJP0IAXeNNDasFDMQe92Vf4GNwuL2eu", kind: "film", ratio: [1080, 1920] },
          { title: "Why we started", category: "Founder-led Content", drive: "1g72FZ7yq2emIwXt2CC_CmEUvBqA9Sarb", kind: "film", ratio: [1080, 1920] },
          { title: "Myths, slowly undone", category: "Founder-led Content", drive: "150RK7zbZ8ox1_AGswt510ImmMUUQlX6E", kind: "film", ratio: [1080, 1920] },
          { title: "A co-founder's story", category: "Founder-led Content", drive: "1tBRQWKpQKCdZ4v5sdAOUYgIMMeIOwsee", kind: "film", ratio: [2160, 3840] },
          { title: "A collaboration reel", category: "Founder-led Content", drive: "1UYw_yyfgvQt4BngT4MJ9LTtf24Bw1qZ5", kind: "film", ratio: [1080, 1920] },
          { title: "Five moments of 2025", category: "Founder-led Content", drive: "1Q2TnMXEkzWX5xYFNSQLwBgiot-NXGeB2", kind: "film", ratio: [1080, 1920] },
          { title: "In his own words", category: "Model-led / UGC Content", drive: "1YugXPKFfXTgGR3GifDqyn_muOIh_2WEj", kind: "film", ratio: [1080, 1920] },
          { title: "How to check good chicken", category: "Model-led / UGC Content", drive: "19MZBrdR8dVKYHR4Bt4Xb5tTXNV2fA8w3", kind: "film", ratio: [1080, 1920] },
          { title: "Comfort meets style", category: "Model-led / UGC Content", drive: "1bq0BAFRLY4jBclNjIzYbCeFzjXkNEqnG", kind: "film", ratio: [360, 640] },
          { title: "Control every meal", category: "Model-led / UGC Content", drive: "1vDGsgAn_-Z6Hn7eGPwMEhBjFcQuguMPy", kind: "film", ratio: [720, 1280] },
          { title: "Zermatt", category: "Model-led / UGC Content", drive: "1Oujx-pR8p3KBPv2YwdCLoWHXwCCeYcb9", kind: "film", ratio: [2160, 3840] },
          { title: "Lumi", category: "Model-led / UGC Content", drive: "175bbaY83uWv1GsXgSilAmWQdf5Ym_QL4", kind: "film", ratio: [2160, 3840] },
          { title: "A storytelling TVC", category: "Festive Campaigns", drive: "1M-SM9tPXv6S1FkLjEHEX3buhFTYrMp1p", kind: "film", ratio: [1080, 1920] },
          { title: "A TVC concept", category: "Festive Campaigns", drive: "1vRxG6ZmRBvuWnH-VUI58V3RcctXfmJeJ", kind: "film", ratio: [1080, 1920] },
          { title: "A shopping surprise", category: "Festive Campaigns", drive: "1tNiwtTotD1eO8bitqPrgUpQdtxoQ-H62", kind: "film", ratio: [1080, 1920] },
          { title: "Brand film", category: "Cinematic / Event Content", drive: "1P3c96N5JPt-a5UotCflab97zeSSJo0-t", kind: "film", ratio: [9, 16] },
          { title: "Product knowledge carousel", category: "Informative Carousels", instagram: `${ig}p/DTiSPVUjNlG/`, kind: "still", ratio: [4, 5] },
          { title: "UGC reel", category: "Model-led / UGC Content", drive: "1ZR6uzJ-kFU8o6KHfWqLvzkZD5c9eP-gv", kind: "film", ratio: [9, 16] },
          { title: "Does this smell expensive?", category: "Vox Pop Content", drive: "1FQM_LHpXd1DxJsUMSF8VoR-gZ2nmnaOM", kind: "film", ratio: [9, 16] },
          { title: "Brand film, part two", category: "Cinematic / Event Content", drive: "1h-SYunBHTuHehtjUyR2TMj_Y2liltn1R", kind: "film", ratio: [9, 16] },
          { title: "Product carousel", category: "Informative Carousels", instagram: `${ig}p/DPjAosrCAsc/`, kind: "still", ratio: [4, 5] },
          // Statics and carousels from the studio's Creatives folder (13 Nov 2026)
          { title: "Built for your 9 to 5", category: "Product Creatives", drive: "1upjRIFi1FTDMlXut452joP-7T96uNILT", kind: "still", ratio: [2160, 2700] },
          { title: "Chicken breast or thigh", category: "Product Creatives", drive: "13htniDh-s7cZyQopoDU5C9-cf8Potckc", kind: "still", ratio: [2160, 2700] },
          { title: "Know your chicken cuts", category: "Informative Carousels", drive: "1CxOrWYkuS9YpryhLgV0IAvZz4nps4T1S", kind: "still", ratio: [2160, 2700] },
          { title: "Know your chicken cuts, slide 2", category: "Informative Carousels", drive: "1CtbK2GYn5zLxO4S9s3aLEyiX3k9WAW-V", kind: "still", ratio: [2160, 2700] },
          { title: "Know your chicken cuts, slide 3", category: "Informative Carousels", drive: "1Qi4ElpysePN5i8WPwtgm_a45Vxcc93pK", kind: "still", ratio: [2160, 2700] },
          { title: "Know your chicken cuts, slide 4", category: "Informative Carousels", drive: "1WozcFVTj8I-LO5Fl_paFwgDKiSbirftw", kind: "still", ratio: [2160, 2700] },
          { title: "Know your chicken cuts, slide 5", category: "Informative Carousels", drive: "13yKLRwwPRpNADQ4EqGilqPtRajzvY2f8", kind: "still", ratio: [2160, 2700] },
          { title: "Know your chicken cuts, slide 6", category: "Informative Carousels", drive: "1c6M6DtEsCLax0df2MOxwzu6Kwy7mA45T", kind: "still", ratio: [2160, 2700] },
          { title: "Is your pet drinking enough", category: "Informative Carousels", drive: "1muW5vQzP7zjz-nAlbjwO1u0X7o96P48i", kind: "still", ratio: [2160, 2700] },
          { title: "Is your pet drinking enough, slide 2", category: "Informative Carousels", drive: "1swoQ4mM6hMPVVb-Fsh59eOQ7RpQEzU01", kind: "still", ratio: [2160, 2700] },
          { title: "Is your pet drinking enough, slide 3", category: "Informative Carousels", drive: "10uY9TtR1nzqn1K-Zkw2pRxhnwznsGjCC", kind: "still", ratio: [2160, 2700] },
          { title: "Is your pet drinking enough, slide 4", category: "Informative Carousels", drive: "11OWpc5MP5nenZOCwyZpzBqpNconAzTLy", kind: "still", ratio: [2160, 2700] },
          { title: "Is your pet drinking enough, slide 5", category: "Informative Carousels", drive: "1OTaqArsBh5HYwkzh-U4JtTmx3iHoTbKN", kind: "still", ratio: [2160, 2700] },
          { title: "Would you use a dirty toilet", category: "Informative Carousels", drive: "1oLLrfNjFyJh9p91KTFIem5s600mgNAn0", kind: "still", ratio: [2160, 2700] },
          { title: "Would you use a dirty toilet, slide 2", category: "Informative Carousels", drive: "1KCe7DIDJ-uBuDGz3I8Tx-hvlXzB6nxZm", kind: "still", ratio: [2160, 2700] },
          { title: "Would you use a dirty toilet, slide 3", category: "Informative Carousels", drive: "17JKhLGTrJbNh8nvrD2fiMvRwi_-Fx6Qa", kind: "still", ratio: [2160, 2700] },
          { title: "Would you use a dirty toilet, slide 4", category: "Informative Carousels", drive: "1u9Ms3MEuO3SePts535EZwQwUdljjRvBj", kind: "still", ratio: [2160, 2700] },
          { title: "Would you use a dirty toilet, slide 5", category: "Informative Carousels", drive: "18JjXR3hdh5V6t4--p120_qKxX1bou5yV", kind: "still", ratio: [2160, 2700] },
        ],
      },
    },
  },
  "hospitality-services": {
    summary: "Films, feeds and launches for venues and service businesses.",
    detail: {
      eyebrow: "Creative & marketing for hospitality & services",
      headline: "Hospitality & Services, *Articulated*",
      lead: "An exploration of places, expertise and human experiences through brand films, design and communication.",
      hero: HOSPITALITY_HERO,
      paragraphs: [],
      clients: {
        title: "Brands we've *worked with*",
        logos: [
          hsLogo("itc-hotels", "ITC Hotels", 416, 220, 1.1),
          hsLogo("oneabove-fitness", "Oneabove Fitness", 900, 213, 0.95),
          hsLogo("baker-street-cake", "Baker Street Cake", 231, 220, 1.1),
          hsLogo("cfosme", "CFOSME", 900, 194, 0.85),
          hsLogo("ice-college", "ICE College", 398, 220),
          hsLogo("cafe-basilico", "Café Basilico", 442, 220),
          hsLogo("ceo-rules", "CEO Rules", 900, 111),
          hsLogo("mirana", "Mirana", 301, 220, 0.9),
          hsLogo("shred-x-fitnest", "Shred X Fitnest", 899, 220),
          hsLogo("up-dentist", "Up Dentist", 330, 220, 1.05),
          hsLogo("wedding-destination", "Wedding Destination", 221, 220, 0.85),
        ],
      },
      servicesTitle: "What we make for *hospitality & service brands*",
      offerings: [
        {
          title: "Social Media",
          subtitle: "Your brand's digital presence",
          text: "",
          image: { src: media("/videos/hospitality-services/one-above-gym-borivali-cinematic.jpg"), alt: "A gym interior with a mural of a muscular back on a pillar, from a vertical reel" },
          ratio: [1080, 1920],
          video: media("/videos/hospitality-services/one-above-gym-borivali-cinematic.mp4"),
        },
        {
          title: "Ads",
          subtitle: "To bring you enquiries, bookings and sales",
          text: "",
          image: { src: media("/videos/hospitality-services/one-above-reel-2-ad-group-classes-one-above-kharghar.jpg"), alt: "The entrance of a fitness studio under a lit sign, from a vertical ad" },
          ratio: [1080, 1920],
          video: media("/videos/hospitality-services/one-above-reel-2-ad-group-classes-one-above-kharghar.mp4"),
        },
        {
          // 13 Nov 2026: the ITC film, kept square as delivered
          title: "Brand Films",
          subtitle: "The people, places and thinking behind your brand",
          text: "",
          image: { src: media("/videos/hospitality-services/itc-punjab-postcard.jpg"), alt: "A host in a red shirt and black turban on a palace lawn, from a square travel film" },
          ratio: [1, 1],
          video: media("/videos/hospitality-services/itc-punjab-postcard.mp4"),
        },
        // 13 Nov 2026: the studio's event reel, in Instagram's own player
        { title: "Events & Launches", subtitle: "Key moments in your brand's story", text: "", instagram: `${ig}reel/DJjyA8Fz8kw/` },
        { title: "Branding", subtitle: "A visual identity for your brand", text: "", ratio: [3, 4] },
        {
          title: "AI Videos",
          subtitle: "Your vision, without a production shoot",
          text: "",
          image: { src: media("/videos/hospitality-services/wedding-destination-ai-video-9-a-rose-tinted-wedding-dream.jpg"), alt: "Pink roses and white hydrangeas in a wedding arch, from an AI-generated reel" },
          ratio: [1080, 1920],
          video: media("/videos/hospitality-services/wedding-destination-ai-video-9-a-rose-tinted-wedding-dream.mp4"),
        },
        {
          // 13 Nov 2026: the studio's carousels swiping one to the next
          title: "Statics & Carousels",
          subtitle: "Narratives in composition",
          text: "",
          image: { src: media("/videos/hospitality-services/statics-carousels.jpg"), alt: "A gym carousel cover asking what your training time says about you" },
          ratio: [4, 5],
          video: media("/videos/hospitality-services/statics-carousels.mp4"),
        },
      ],
      work: {
        title: "Work for *hospitality & services*",
        lead: "Films, reels, ads, AI videos, statics and carousels made for venues and service businesses, each one in full.",
        items: [
          // 13 Nov 2026: the ITC film, the event reel, and the studio's statics and carousels
          { title: "A Punjab postcard", category: "Brand Films", drive: "132ZU2Y-4OVP1txX01vmgBsakOX5S-Q2l", kind: "film", ratio: [1, 1] },
          { title: "Launch night", category: "Events & Launches", instagram: `${ig}reel/DJjyA8Fz8kw/`, kind: "film", ratio: [9, 16] },
          { title: "What your gym time says about you", category: "Statics & Carousels", drive: "1fcGGdC4pKiIiSRP2a-wrG9M5X8oGlEOp", kind: "still", ratio: [2160, 2700] },
          { title: "What your gym time says about you, slide 2", category: "Statics & Carousels", drive: "1JSKJqM5JScwO-5bVtCWo5LWjpn6P2n4e", kind: "still", ratio: [2160, 2700] },
          { title: "What your gym time says about you, slide 3", category: "Statics & Carousels", drive: "1Xk-AqP7EXCKmRPCnDwPts_8mw3Zcp947", kind: "still", ratio: [2160, 2700] },
          { title: "What your gym time says about you, slide 4", category: "Statics & Carousels", drive: "1N3f9FeniAk_1f0Eiv_ljU46c0GZl8q8i", kind: "still", ratio: [2160, 2700] },
          { title: "What your gym time says about you, slide 5", category: "Statics & Carousels", drive: "1L9zpyIKZDkRX1ps0mySwjbm7kensGdNn", kind: "still", ratio: [2160, 2700] },
          { title: "What your gym time says about you, slide 6", category: "Statics & Carousels", drive: "1iEfWWJeWAMEOAVaHb4i9N8c2np43zRKU", kind: "still", ratio: [2160, 2700] },
          { title: "Wedding décor trends", category: "Statics & Carousels", drive: "1I38PgDWdOSrJNpl39PzyYBNF4CDwtwSe", kind: "still", ratio: [2160, 2700] },
          { title: "Wedding décor trends, slide 2", category: "Statics & Carousels", drive: "10S96Uh-tnVC6Jw6tG8CJ1DtTJdmgeLK4", kind: "still", ratio: [2160, 2700] },
          { title: "Wedding décor trends, slide 3", category: "Statics & Carousels", drive: "1VBYMfdsPPvsoDIqJXNOj_oJDoLmWr5Fo", kind: "still", ratio: [2160, 2700] },
          { title: "Wedding décor trends, slide 4", category: "Statics & Carousels", drive: "1ELE_6ij4NYBpdAKQGw1jL_gfB_8XlsiA", kind: "still", ratio: [2160, 2700] },
          { title: "Wedding décor trends, slide 5", category: "Statics & Carousels", drive: "1UxA7ZOkRB5NwO1oMbdvJGvudbJPguUcE", kind: "still", ratio: [2160, 2700] },
          { title: "Wedding décor trends, slide 6", category: "Statics & Carousels", drive: "13fzuR35I2_NvELTkjj9fcK-gjjxcz9HZ", kind: "still", ratio: [2160, 2700] },
          { title: "Wedding décor trends, slide 7", category: "Statics & Carousels", drive: "1NzkWh_WuDPdNo1cNRxba_z_mFrZZ0TtT", kind: "still", ratio: [2160, 2700] },
          { title: "The best gift for your bride", category: "Statics & Carousels", drive: "1R_X9nHL762O4MO29mEonEwviD4H8fQoq", kind: "still", ratio: [1080, 1350] },
          { title: "It's just a few minutes", category: "Statics & Carousels", drive: "194TrgQHZtKrUX_g-XbAMNe_KdQln9j1v", kind: "still", ratio: [2160, 2700] },
          { title: "It's just a few minutes, slide 2", category: "Statics & Carousels", drive: "11U_uTaMZvysPemG35_I_iugFf0K6JSiB", kind: "still", ratio: [2160, 2700] },
          { title: "It's just a few minutes, slide 3", category: "Statics & Carousels", drive: "1EpjIWSzIkxilwtoN2etUa6JqLLdxVv27", kind: "still", ratio: [2160, 2700] },
          { title: "It's just a few minutes, slide 4", category: "Statics & Carousels", drive: "1f5P-i2n-Y8cnclpRw_AcjLmX37t3x9hR", kind: "still", ratio: [2160, 2700] },
          { title: "Inside the gym", category: "Social Media", drive: "1-aG_ztgcatNJeVBXj-5DVcgS106NZFiN", kind: "film", ratio: [1080, 1920] },
          { title: "What you see inside", category: "Social Media", drive: "1uvJxTVWt5OVjTBZH-aC_Wj5jnQwTqNBR", kind: "film", ratio: [1080, 1920] },
          { title: "The art of bespoke", category: "Social Media", drive: "1GY961oxLTh4HKbv-ueiEWzNJJgAKYXuj", kind: "film", ratio: [720, 1280] },
          { title: "Two sides of a morning", category: "Social Media", drive: "1z9BGsWchV3Bz4UhfDQJbR8IXubUMfJXn", kind: "film", ratio: [1920, 1080] },
          { title: "Before and after", category: "Social Media", drive: "1FTqTDOvyDtnIODfrcEtSd06A-khkYaEZ", kind: "film", ratio: [3840, 2160] },
          { title: "Group classes", category: "Ads", drive: "1Mb_0Zagi7SznhjTvm1Tf7fOnHg7t6ku6", kind: "film", ratio: [1080, 1920] },
          { title: "Space and equipment", category: "Ads", drive: "1BcSo5gbwlRMX0m4niHPcWauC2wWOoomY", kind: "film", ratio: [1080, 1920] },
          { title: "Five cash-flow mistakes", category: "Ads", drive: "1TaQw8_wjIhPo1YB74K72152XQR_oPGVH", kind: "film", ratio: [1080, 1920] },
          { title: "Budget vs forecasting", category: "Ads", drive: "1d7n1NAquAF20sbM10sZ2IVr5uwHuO4rB", kind: "film", ratio: [1080, 1920] },
          { title: "A rose-tinted wedding", category: "AI Videos", drive: "1OrFsm7E8U8yMj84100jI0JnAWMOy7KZR", kind: "film", ratio: [1080, 1920] },
          { title: "A South Indian dream", category: "AI Videos", drive: "1jIuG0OREseTVdq_M0dF-YFE54llv-atC", kind: "film", ratio: [1080, 1920] },
          { title: "A home that grows with you", category: "AI Videos", drive: "1BCoShUXKCZmd_xBivVuyEzmO1sROvSCn", kind: "film", ratio: [1080, 1920] },
          { title: "Spaces that inspire", category: "AI Videos", drive: "1PPtk37URN6RMKR-yqglLnrG1494tbnTc", kind: "film", ratio: [1080, 1920] },
        ],
      },
      value: designedToDo("Establish a distinct presence for your brand, its expertise and experience.", "Turn interest into enquiries, bookings and sales opportunities."),
      challenges: [],
      process: STANDARD_PROCESS,
      // DRAFT from the doc: no current wording exists for the merged page
      faqTitle: "A few things you might *want to know*",
      faqs: [
        { q: "Can we work with you on a single launch or campaign?", a: "Yes. The scope can focus on one venue, service, opening or campaign." },
        { q: "Can films, branding, social content and ads share the same direction?", a: "Yes. A shared narrative and visual direction keep the brand consistent across formats." },
        { q: "What do you need to get started?", a: "A brief, details of the venue or service, brand guidelines, available assets and the intended timeline." },
      ],
      cta: CLOSING,
    },
  },
  automobile: {
    summary: "Launch films and campaigns with the speed and polish the category expects.",
    detail: {
      eyebrow: "Creative & marketing for automotive",
      headline: "Automotive, *In Detail*",
      lead: "An exploration of design, performance and ownership through films, visual content and communication.",
      hero: AUTOMOBILE_HERO,
      paragraphs: [],
      clients: {
        title: "Brands we've *worked with*",
        logos: [
          autoLogo("mercedes-benz", "Mercedes-Benz", 869, 220, 1.1),
          autoLogo("cartronics", "Cartronics", 900, 170),
          autoLogo("garnet-motors", "Garnet Motors", 591, 220),
          autoLogo("60k-cars", "60k Cars", 900, 137, 0.85),
          autoLogo("scratchgard", "Scratchgard", 236, 65),
        ],
      },
      servicesTitle: "What we make for *automotive brands*",
      offerings: [
        {
          title: "Events",
          subtitle: "Launches and experiences, documented",
          text: "",
          image: { src: media("/videos/automobile/the-wait-is-over-the-all-new-skoda-kodiaq-has-officially-lan.jpg"), alt: "A projected launch-event logo on a dark wall, from a vertical reel" },
          ratio: [360, 640],
          video: media("/videos/automobile/the-wait-is-over-the-all-new-skoda-kodiaq-has-officially-lan.mp4"),
        },
        {
          // Renamed 13 Nov 2026 (studio's updated changes)
          title: "Social Media & Ads",
          subtitle: "Your brand's digital presence",
          text: "",
          image: { src: media("/videos/automobile/this-festive-season-bring-home-new-beginnings-and-a-brand-ne.jpg"), alt: "A man in a yellow kurta beside a new car outside a showroom, from a festive reel" },
          ratio: [720, 1280],
          video: media("/videos/automobile/this-festive-season-bring-home-new-beginnings-and-a-brand-ne.mp4"),
        },
        // Added 12 Nov 2026: the studio's Drive has an AI Videos folder for automotive
        {
          title: "AI Videos",
          subtitle: "Your vision, without a production shoot",
          text: "",
          image: { src: media("/videos/automobile/scratchgard-reel-3-before-it-becomes-ppf-it-becomes-data.jpg"), alt: "A black saloon under strip lights in a dark garage, from an AI-generated reel" },
          ratio: [1080, 1920],
          video: media("/videos/automobile/scratchgard-reel-3-before-it-becomes-ppf-it-becomes-data.mp4"),
        },
        // The separate Ads card (an empty placeholder) is folded into Social Media & Ads
        {
          // 13 Nov 2026: the studio's statics and carousels swiping one to the next
          title: "Statics & Carousels",
          subtitle: "Design and detail in composition",
          text: "",
          image: { src: media("/videos/automobile/statics-carousels.jpg"), alt: "A carousel cover for a new saloon, the car in pale blue under the line 'explained'" },
          ratio: [4, 5],
          video: media("/videos/automobile/statics-carousels.mp4"),
        },
      ],
      work: {
        title: "Work for *automotive brands*",
        lead: "Launch films, festive reels, AI videos, statics and carousels made for automotive brands, each one in full.",
        items: [
          { title: "The new Kodiaq arrives", category: "Events", drive: "1bwnDGnzAkycwWOJdQB7G3wmVrqEM91gc", kind: "film", ratio: [360, 640] },
          { title: "A showroom relaunch", category: "Events", drive: "1TwIf9X5ztN44CopWl4nxKVpK52tXPDlF", kind: "film", ratio: [360, 640] },
          { title: "Festive season", category: "Social Media & Ads", drive: "1oS_RcDIHKmeKNZc-wH7rFVNPvRH4YqVP", kind: "film", ratio: [720, 1280] },
          { title: "Raksha Bandhan", category: "Social Media & Ads", drive: "1J1qAgcieK8Z1Ftwve7nIHloRm4ASzq99", kind: "film", ratio: [720, 1280] },
          { title: "Before it becomes PPF", category: "AI Videos", drive: "1vC40P7WuoPap8OiYskLZOgy95J7sVQzN", kind: "film", ratio: [1080, 1920] },
          { title: "A closer look at the topcoat", category: "AI Videos", drive: "14ncPnjU2LUcTkOF4Cgp2vdUCbQItVlnS", kind: "film", ratio: [720, 1280] },
          { title: "Low mileage is not enough", category: "AI Videos", drive: "1tYduhOJSt3NtFKL839xJO75cKuGk9WQT", kind: "film", ratio: [1080, 1920] },
          { title: "Your shortlist starts with your day", category: "AI Videos", drive: "16jsdb0EgsKl8_mMn8TmhmK6ZMcZE8iRZ", kind: "film", ratio: [1080, 1920] },
          // Statics and carousels from the studio's Drive (13 Nov 2026)
          { title: "Your search ends here", category: "Statics & Carousels", drive: "1CpRJJFChpY02ZjbuFykIJS3wOiviL1vr", kind: "still", ratio: [2160, 2700] },
          { title: "Two clutches, no clutch pedal", category: "Statics & Carousels", drive: "14uAFC1dS_BMEjVjsudAbNc5-fscSoNQp", kind: "still", ratio: [2160, 2700] },
          { title: "Same car, two different finishes", category: "Statics & Carousels", drive: "1HaT0QreUFf1tGvkwVAQDakE2tEEE0CZC", kind: "still", ratio: [2160, 2700] },
          { title: "Daily driven, daily protected", category: "Statics & Carousels", drive: "14tuSssidl-ryG7WRJZEVkO80LJNKOhY2", kind: "still", ratio: [1080, 1350] },
          { title: "You parked carefully", category: "Statics & Carousels", drive: "1mak1KCO1PlrHNBP8mIicb6_y3qdCXTUt", kind: "still", ratio: [1080, 1350] },
          { title: "The new saloon, explained", category: "Statics & Carousels", drive: "1TW_CLFtM8s3pdMqDgBOXEE_pKR7oQ0Mi", kind: "still", ratio: [2160, 2700] },
          { title: "The new saloon, explained, slide 2", category: "Statics & Carousels", drive: "176Vy4QxDOYqegArGxYEIMS4elI9Sh3Zw", kind: "still", ratio: [2160, 2700] },
          { title: "The new saloon, explained, slide 3", category: "Statics & Carousels", drive: "1h8kRrC8xjUb7p0IxGNVfKK7OQGeVc986", kind: "still", ratio: [2160, 2700] },
          { title: "The new saloon, explained, slide 4", category: "Statics & Carousels", drive: "1FV_F20Pw1oFLdTORLkVZB_qsEbLRC77J", kind: "still", ratio: [2160, 2700] },
          { title: "The new saloon, explained, slide 5", category: "Statics & Carousels", drive: "1nAeMsSGuPO0pVuYon-eMZbMTPH7VrgRD", kind: "still", ratio: [2160, 2700] },
          { title: "The new saloon, explained, slide 6", category: "Statics & Carousels", drive: "1ffIWiCqZNMZAnAWFANiaWxq-Mg9SHqa-", kind: "still", ratio: [2160, 2700] },
          { title: "What about what you don't see", category: "Statics & Carousels", drive: "195D1dIYxa3PbUcsTqaMZz9m1EBvVRKW8", kind: "still", ratio: [2160, 2700] },
          { title: "What about what you don't see, slide 2", category: "Statics & Carousels", drive: "1O-o_lJt64cmiJbgpUmf1HE9-IETQg_Ma", kind: "still", ratio: [2160, 2700] },
          { title: "What about what you don't see, slide 3", category: "Statics & Carousels", drive: "1H9Jm4wcX3X6KjzXg8y7NZvZyhNii9tME", kind: "still", ratio: [2160, 2700] },
          { title: "What about what you don't see, slide 4", category: "Statics & Carousels", drive: "1fJriyabwWvUnNwjo3vXkvCDjERdlVKOc", kind: "still", ratio: [2160, 2700] },
          { title: "What about what you don't see, slide 5", category: "Statics & Carousels", drive: "1GGwv6ockGrI0uTDxKNwNZEf9KjKRu-0z", kind: "still", ratio: [2160, 2700] },
          { title: "What about what you don't see, slide 6", category: "Statics & Carousels", drive: "18_wnR6eEAWZxRo9F9AIp82qG3YQR0KEc", kind: "still", ratio: [2160, 2700] },
          { title: "Premium, or just big", category: "Statics & Carousels", drive: "1uh0iQg7aW8E4we1NQFctMEvRGWokbuZd", kind: "still", ratio: [2160, 2700] },
          { title: "Premium, or just big, slide 2", category: "Statics & Carousels", drive: "1vh_joIbQh0lkRwzCaCumKGXy4LPW2_rC", kind: "still", ratio: [2160, 2700] },
          { title: "Premium, or just big, slide 3", category: "Statics & Carousels", drive: "14XKWmPaG7sfpDmvw4ipom4Zy_pn-sW3b", kind: "still", ratio: [2160, 2700] },
          { title: "Premium, or just big, slide 4", category: "Statics & Carousels", drive: "1ADBuhGT-Lpjs42jg43Mq088bs-eKxQuJ", kind: "still", ratio: [2160, 2700] },
          { title: "Premium, or just big, slide 5", category: "Statics & Carousels", drive: "1zdr2aLTvEqhqGTA0i9pp7o5ZZYWwe6c5", kind: "still", ratio: [2160, 2700] },
          { title: "Getting PPF? Ask these first", category: "Statics & Carousels", drive: "1lMmZFdN_JT4jnX-P7AN3a0oTkWKj2zom", kind: "still", ratio: [2160, 2700] },
          { title: "Getting PPF? Ask these first, slide 2", category: "Statics & Carousels", drive: "1MxYjBTDMwKzvu8GNvoTceKR43bS33gKI", kind: "still", ratio: [2160, 2700] },
          { title: "Getting PPF? Ask these first, slide 3", category: "Statics & Carousels", drive: "1TtjIvV1PABZ_nGZkse6mTdJYQrXwbnIz", kind: "still", ratio: [2160, 2700] },
          { title: "Getting PPF? Ask these first, slide 4", category: "Statics & Carousels", drive: "1aHBFvEOrCnXTN5-1BB8_yUltts69OpDf", kind: "still", ratio: [2160, 2700] },
          { title: "Getting PPF? Ask these first, slide 5", category: "Statics & Carousels", drive: "1hT-IXK5XBjx2J-2-S1-bx2l5P_6bszz1", kind: "still", ratio: [2160, 2700] },
          { title: "Not every panel faces the same risk", category: "Statics & Carousels", drive: "1fBCI30o5KOY4-LCPprKK2-hq1stEAE3N", kind: "still", ratio: [2160, 2700] },
          { title: "Not every panel faces the same risk, slide 2", category: "Statics & Carousels", drive: "1UPh6K8O8uv-kUYjotxA_NYFJ9rnhFzdw", kind: "still", ratio: [2160, 2700] },
          { title: "Not every panel faces the same risk, slide 3", category: "Statics & Carousels", drive: "1fykneCWFhyNtvma_IBzIG6z-Q2VjHmB4", kind: "still", ratio: [2160, 2700] },
          { title: "Not every panel faces the same risk, slide 4", category: "Statics & Carousels", drive: "17_0viL__98k0Fs_DB9lUlRISzdoFt366", kind: "still", ratio: [2160, 2700] },
          { title: "Not every panel faces the same risk, slide 5", category: "Statics & Carousels", drive: "1hd-fTOHiHsV_-0iLkVWrS2tJST7uZLr2", kind: "still", ratio: [2160, 2700] },
          { title: "Not every panel faces the same risk, slide 6", category: "Statics & Carousels", drive: "1YeED7s2_J7Q5AKSZ_P49EV_11p8ACKkK", kind: "still", ratio: [2160, 2700] },
        ],
      },
      value: designedToDo("Establish a distinct presence for your brand and its vehicles.", "Turn vehicle interest into test-drive enquiries and sales opportunities."),
      challenges: [],
      process: STANDARD_PROCESS,
      faqs: [
        { q: "Can you shoot moving cars?", a: "Yes, including tracking and drone shots, with the right permissions." },
        { q: "Do you work with dealerships?", a: "Yes, as well as brands directly." },
        { q: "Can you turn content around for a launch day?", a: "Yes, we plan same-day edits for launches and events." },
      ],
      cta: CLOSING,
    },
  },
};

export function withDetails(list: Industry[]): Industry[] {
  return list.map((i) => ({ ...i, ...details[i.slug] }));
}
