/*
  Industry pages. Each one is shared on its own with prospects from that industry.

  Real Estate: Vision Blend's "Real Estate Landing Page: Approved Changes" doc (4 Nov 2026), which
  replaces the earlier tracker copy where they conflict. Hero, ten content categories, two purpose
  points, the four-step process and the closing are the doc's exact wording. FAQs are left as they
  were (their keep/remove/rewrite decision is still open with the studio). Titles drop a final full
  stop because the page adds the brand one; *stars* mark the highlighted key word. The hero photo
  (public/images/real-estate-hero-glass.jpg, 1536x1024, a cleaner version of the glass-corner shot
  the team picked) was chosen by the team and carries no placeholder tag; the
  Branding still (Unsplash, public/placeholder/) is a stand-in, tagged as a placeholder.

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

const reImg = (name: string, alt: string) => ({ src: `/placeholder/real-estate/${name}.jpg`, alt, placeholder: true });
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
  Automobile, car bodywork (Quentin Martinez, unsplash.com/photos/V8H-K2032Kc).
*/
const D2C_HERO = { src: "/images/d2c-hero-bottle.jpg", alt: "Black-and-white still life of a stoneware bottle on a table against a dark wall" };
const HOSPITALITY_HERO = {
  src: "/images/hospitality-services-hero-table.jpg",
  alt: "Black-and-white restaurant table in sunlight, with glassware casting long shadows across the cloth",
};
const AUTOMOBILE_HERO = { src: "/images/automobile-hero-bodywork.jpg", alt: "Black-and-white close-up of the curve of glossy car bodywork" };

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
      // frame (from the file), so reels stay vertical. Branding has no assets yet, so it keeps a
      // stock still marked as a placeholder.
      offerings: [
        {
          title: "Testimonials",
          subtitle: "Stories from your customers",
          text: "",
          image: reClip("testimonials", "Two residents on a garden bench, talking about their new home"),
          ratio: [1682, 720],
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
          // Awaiting assets from the studio
          title: "Branding",
          subtitle: "The visual identity of place",
          text: "",
          image: reImg("branding", "Looking up at the balconies of a dark-clad apartment block against a blue sky"),
          ratio: [3, 4],
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
          image: reClip("construction-updates", "A site engineer reading plans beside rising concrete columns"),
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
        15 files across the category folders, AV/Ai included; Branding is empty). Each file is one
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
          { title: "Presidence One, BKC NEX walkthrough", category: "AV Films", drive: "1qxhFkqv3Ubzqy_Bbfmbep2RjBNDqnxZv", kind: "film", ratio: [1280, 560] },
          { title: "Where Vision Meets Vista", category: "Ads", client: "Godrej", drive: "1EkolrQ1iLk_ctjj1Lca7VE33HN8rkiWQ", kind: "film", ratio: [9, 16] },
          { title: "Where Better Work Begins", category: "Statics & Carousels", client: "Meghna Realty", drive: "1M_l_jlRKSJE4hXv4tJDpNFeC3RpWfNGT", kind: "still", ratio: [4, 5] },
          {
            title: "FIFA at Sai World Empire",
            category: "Campaign Film",
            client: "Paradise Group",
            drive: "1H7Ff4uay6LEawRH_Ay_vlhc0B_WFKsEG",
            kind: "film",
            ratio: [16, 9],
            poster: media("/videos/real-estate/campaign-film.jpg"),
          },
          { title: "What Home Means to Me", category: "Testimonials", client: "Paradise Group", drive: "11xZkFbKV8wTJH8gR2TcIRJWgBgRInOgK", kind: "film", ratio: [1682, 720] },
          { title: "Upper Kharghar Growth Area", category: "Social Media", drive: "1AkTnxyxJ0dJX6CHPz2hrJftqJWG1a2pz", kind: "film", ratio: [9, 16] },
          { title: "Prime Business Address", category: "Statics & Carousels", client: "Meghna Realty", drive: "1OPcuhfV8kOCfRkNVke8jQ2_FGcztnciM", kind: "still", ratio: [4, 5] },
          { title: "Presidence One launch", category: "Event Launches", drive: "1dqmYNyH-Pwce1PFTWms9VCyDTq4kYtHN", kind: "film", ratio: [16, 9] },
          {
            title: "Meghna One brand film",
            category: "AI Films",
            client: "Meghna Realty",
            drive: "1Ys0ngz8WtmjmcvsRndVa9-olFvUeFy9Z",
            kind: "film",
            ratio: [16, 9],
            poster: media("/videos/real-estate/ai-films.jpg"),
          },
          { title: "IGBC-Certified Sustainable Landmark", category: "Statics & Carousels", client: "Meghna Realty", drive: "1ZHBWoN_SG5YY7crDp5C_OlCzPAREmiXd", kind: "still", ratio: [4, 5] },
          { title: "Site Supervisor", category: "Construction Updates", client: "Platinum Corp", drive: "1iGBXHQDvv7D3STZZ2JqWWAS4lxtzeGkF", kind: "film", ratio: [16, 9] },
          { title: "Your Office, Your Way", category: "Statics & Carousels", client: "Meghna Realty", drive: "1QZ8Njg2TvIIIpygOeKdvDAJ-nMY6gTqY", kind: "still", ratio: [4, 5] },
          { title: "A Smoother Start to Every Workday", category: "Statics & Carousels", client: "Meghna Realty", drive: "1OlhEiTcdKJGAt5_NEKBxzWcXcAMMg2TX", kind: "still", ratio: [4, 5] },
          { title: "Wellness Beyond the Workplace", category: "Statics & Carousels", client: "Meghna Realty", drive: "18ffMNJCo-xpfWW5VIXYEHD_vWQHbyi4a", kind: "still", ratio: [4, 5] },
          { title: "Your Own Personal Rainforest", category: "Statics & Carousels", client: "Meghna Realty", drive: "1NPcP56ChH6UOrCUdJoFsKsud0-zoiPu5", kind: "still", ratio: [4, 5] },
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

    D2C media: the first link in each category row leads the card, the rest go to the work page
    (studio's instruction). Instagram links play in Instagram's own embed. Product & AI's first
    link (Drive) does not open publicly, so its Instagram reel leads instead. Model-led leads with
    a 12-second loop (public/videos/d2c/, 6-18 s of the centre Drive file, 1uWBG_iXqgcrGezrzCefu5I6DF70HGB-p,
    a private file shared with the team); the left file is the one the doc flags as the wrong
    film, so it is not used. Offer Creatives has no link yet. Hospitality & Services and Automobile have no links
    yet: every card is a marked placeholder. Heroes: see the note above the hero constants.
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
        { title: "Product & AI Content", subtitle: "Products in imagined and observed settings", text: "", instagram: `${ig}reel/DSfe26BgY_b/` },
        { title: "Cinematic / Event Content", subtitle: "Brand narratives and occasions, on film", text: "", instagram: `${ig}reel/DSFC_tUiHrP/` },
        { title: "Vox Pop Content", subtitle: "Public perspectives, in conversation", text: "", instagram: `${ig}reel/DVOX3RvAvtT/` },
        { title: "Founder-led Content", subtitle: "The perspective behind the brand", text: "", instagram: `${ig}reel/DS2ejWijJp-/` },
        {
          title: "Model-led / UGC Content",
          subtitle: "Products through personal experience",
          text: "",
          image: { src: media("/videos/d2c/model-led-ugc.jpg"), alt: "A man in a brown shirt talking to camera about a fragrance, from a vertical reel" },
          ratio: [9, 16],
          video: media("/videos/d2c/model-led-ugc.mp4"),
        },
        { title: "Festive Campaigns", subtitle: "Brand stories within cultural occasions", text: "", instagram: `${ig}reel/DQCF4txiXQh/` },
        { title: "Informative Carousels", subtitle: "Product knowledge, in sequence", text: "", instagram: `${ig}p/DQwf1RMki7a/` },
        { title: "Product Creatives", subtitle: "Form, benefit and detail in composition", text: "", instagram: `${ig}p/DTLUTregizO/` },
        { title: "Offer Creatives", subtitle: "Promotions, clearly composed", text: "", ratio: [4, 5] },
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
        lead: "Films, reels and creatives made for D2C brands, each one in full.",
        items: [
          { title: "Brand film", category: "Cinematic / Event Content", drive: "1P3c96N5JPt-a5UotCflab97zeSSJo0-t", kind: "film", ratio: [9, 16] },
          { title: "Vox pop", category: "Vox Pop Content", instagram: `${ig}reel/DTk-n3AiFxC/`, kind: "film", ratio: [9, 16] },
          { title: "Founder story", category: "Founder-led Content", instagram: `${ig}reel/DO0l4YdEvI-/`, kind: "film", ratio: [9, 16] },
          { title: "Product knowledge carousel", category: "Informative Carousels", instagram: `${ig}p/DTiSPVUjNlG/`, kind: "still", ratio: [4, 5] },
          { title: "UGC reel", category: "Model-led / UGC Content", drive: "1ZR6uzJ-kFU8o6KHfWqLvzkZD5c9eP-gv", kind: "film", ratio: [9, 16] },
          { title: "Festive reel", category: "Festive Campaigns", instagram: `${ig}reel/DO_U0NCiW9V/`, kind: "film", ratio: [9, 16] },
          { title: "Does this smell expensive?", category: "Vox Pop Content", drive: "1FQM_LHpXd1DxJsUMSF8VoR-gZ2nmnaOM", kind: "film", ratio: [9, 16] },
          { title: "Brand film, part two", category: "Cinematic / Event Content", drive: "1h-SYunBHTuHehtjUyR2TMj_Y2liltn1R", kind: "film", ratio: [9, 16] },
          { title: "Founder story, part two", category: "Founder-led Content", instagram: `${ig}reel/DUIxrt7kmkR/`, kind: "film", ratio: [9, 16] },
          { title: "Product carousel", category: "Informative Carousels", instagram: `${ig}p/DPjAosrCAsc/`, kind: "still", ratio: [4, 5] },
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
        { title: "Social Media", subtitle: "Your brand's digital presence", text: "", ratio: [9, 16] },
        { title: "Ads", subtitle: "To bring you enquiries, bookings and sales", text: "", ratio: [16, 9] },
        { title: "Brand Films", subtitle: "The people, places and thinking behind your brand", text: "", ratio: [16, 9] },
        { title: "Events & Launches", subtitle: "Key moments in your brand's story", text: "", ratio: [16, 9] },
        { title: "Branding", subtitle: "A visual identity for your brand", text: "", ratio: [3, 4] },
        { title: "AI Videos", subtitle: "Your vision, without a production shoot", text: "", ratio: [16, 9] },
        { title: "Statics & Carousels", subtitle: "Narratives in composition", text: "", ratio: [4, 5] },
      ],
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
        { title: "Events", subtitle: "Launches and experiences, documented", text: "", ratio: [16, 9] },
        { title: "Social Media", subtitle: "Your brand's digital presence", text: "", ratio: [9, 16] },
        { title: "Ads", subtitle: "To bring you enquiries and sales", text: "", ratio: [16, 9] },
        { title: "Statics & Carousels", subtitle: "Design and detail in composition", text: "", ratio: [4, 5] },
      ],
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
