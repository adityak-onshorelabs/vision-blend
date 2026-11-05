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

  D2C, Services, Hospitality, Automobile: still PLACEHOLDER copy. Their approved copy is in the
  same tracker and goes in the same way.

  No client names, testimonials, metrics or results here: none have been approved for these pages.
*/
import { media } from "@/lib/media";
import type { Industry, IndustryDetail } from "./types";

type Extra = { summary: string; detail: IndustryDetail };

const reImg = (name: string, alt: string) => ({ src: `/placeholder/real-estate/${name}.jpg`, alt, placeholder: true });
// Showcase clips: 12-second muted loops cut from the studio's Drive files, with their first frame as the poster
const clip = (name: string) => media(`/videos/real-estate/${name}.mp4`);
const reClip = (name: string, alt: string) => ({ src: media(`/videos/real-estate/${name}.jpg`), alt });

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
  d2c: {
    summary: "Product shoots, feeds and ads that turn scrolling into buying.",
    detail: {
      lead: "D2C brands live and die on the feed. We make the product shoots, content and ads that make people stop, look and buy.",
      paragraphs: [
        "We shoot products the way your customer will see them: on a phone screen, between a friend's post and an ad from a competitor.",
        "Content and ads are made by the same team, so what performs in ads feeds back into the content, and the other way round.",
      ],
      offerings: [
        { title: "Social media", text: "Monthly content for Instagram and beyond, planned around launches and sales." },
        { title: "Ads", text: "Performance creative in many cuts and formats, tested and refreshed." },
        { title: "Product shoots", text: "Studio and lifestyle shoots for the store, marketplaces and social." },
        { title: "Brand films", text: "Short films that tell the story behind the product." },
        { title: "Event launches", text: "Pop-ups, product drops and launch events, covered live." },
      ],
      challenges: [
        { title: "Creative fatigue", text: "Ads wear out fast. The brand needs a steady supply of fresh, on-brand creative." },
        { title: "Standing out", text: "Category feeds look the same. A recognisable look is worth more than one viral post." },
        { title: "Proof", text: "Every rupee of spend has to show up in sales." },
      ],
      faqs: [
        { q: "Do you run the ads as well as make them?", a: "Yes, we can plan, make and run campaigns, or hand creative to your team." },
        { q: "How many creatives a month?", a: "It depends on the plan. We agree the number up front and stick to it." },
        { q: "Can you shoot at our warehouse?", a: "Yes, we shoot on location or in a studio." },
      ],
    },
  },
  services: {
    summary: "Clear, human content for businesses that sell expertise, not products.",
    detail: {
      lead: "Service businesses sell trust. We make the films and content that show the people and the work behind the name.",
      paragraphs: [
        "Clinics, consultancies, agencies and studios all have the same problem: the product is invisible. We make it visible through people, process and results.",
        "A steady stream of social content, backed by a brand film and events, builds the recognition that turns into enquiries.",
      ],
      offerings: [
        { title: "Social media and ads", text: "Content that explains what you do and why to choose you, with ads to reach the right people." },
        { title: "Brand films", text: "A film about the team, the work and the results." },
        { title: "Events and launches", text: "Openings, seminars and milestones, planned and covered." },
      ],
      challenges: [
        { title: "Invisible product", text: "There is nothing to photograph. The story has to come from people and outcomes." },
        { title: "Trust first", text: "Clients buy from people they believe. Content has to feel honest." },
        { title: "Explaining simply", text: "Complex services need clear, short explanations." },
      ],
      faqs: [
        { q: "We are a small team. Is this for us?", a: "Yes. Many of our service clients are founder-led teams." },
        { q: "Do our people need to be on camera?", a: "It helps, and we make it easy. We coach and direct every shoot." },
        { q: "How soon will we see enquiries?", a: "It varies by business. We set goals together at the start." },
      ],
    },
  },
  hospitality: {
    summary: "Films and feeds that make people want to book a table or a stay.",
    detail: {
      lead: "Hospitality is felt before it is visited. We make content that lets people taste the food and feel the room from their phone.",
      paragraphs: [
        "Restaurants, cafés, hotels and resorts each have a mood. We capture it in films and posts that make people want to be there.",
        "From opening night to the weekly feed, one team keeps the place looking the way it feels.",
      ],
      offerings: [
        { title: "Social media and ads", text: "Food, rooms and moments, posted regularly, with ads around launches and seasons." },
        { title: "Brand films", text: "Short films that show the place, the people and the experience." },
        { title: "Events and launches", text: "Openings, menu launches and seasonal events, planned and covered." },
      ],
      challenges: [
        { title: "Mood on a screen", text: "Atmosphere is hard to film. It needs light, sound and patience." },
        { title: "Always new", text: "Menus, seasons and events change. The feed has to keep up." },
        { title: "Local reach", text: "The right audience is often within a few kilometres." },
      ],
      faqs: [
        { q: "Can you shoot during service?", a: "Yes, we plan shoots around service to keep the floor running." },
        { q: "Do you do menu photography?", a: "Yes, for print, delivery apps and social." },
        { q: "Can you help with an opening?", a: "Yes, from pre-opening teasers to opening-night coverage." },
      ],
    },
  },
  automobile: {
    summary: "Launch films and campaigns with the speed and polish the category expects.",
    detail: {
      lead: "Cars and bikes are bought with the heart and justified with the head. We make content that does both.",
      paragraphs: [
        "Dealerships, showrooms and automotive brands need content that matches the polish of the machines: launch films, walkarounds and campaigns.",
        "We plan around model launches, festive seasons and showroom events so every moment that matters is covered.",
      ],
      offerings: [
        { title: "Social media and ads", text: "Model content, offers and showroom life, with lead ads around launches." },
        { title: "Brand films", text: "Launch films and walkarounds shot with the polish the category expects." },
        { title: "Events and launches", text: "Unveilings, test-drive events and showroom launches, planned and covered." },
      ],
      challenges: [
        { title: "High expectations", text: "Buyers have seen the global ads. Local content has to hold up." },
        { title: "Launch windows", text: "Content has to be ready the moment a model goes on sale." },
        { title: "Footfall", text: "Online attention has to turn into showroom visits and test drives." },
      ],
      faqs: [
        { q: "Can you shoot moving cars?", a: "Yes, including tracking and drone shots, with the right permissions." },
        { q: "Do you work with dealerships?", a: "Yes, as well as brands directly." },
        { q: "Can you turn content around for a launch day?", a: "Yes, we plan same-day edits for launches and events." },
      ],
    },
  },
};

export function withDetails(list: Industry[]): Industry[] {
  return list.map((i) => ({ ...i, ...details[i.slug] }));
}
