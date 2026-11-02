/*
  PLACEHOLDER industry pages.

  Everything in this file is dummy copy written so the industry pages have a shape. Replace it with
  the real copy from the Vision Blend team when it arrives. The keys are the industry slugs in en.ts.
*/
import type { Industry, IndustryDetail } from "./types";

type Extra = { summary: string; detail: IndustryDetail };

const details: Record<string, Extra> = {
  "real-estate": {
    summary: "Launch films, walkthroughs and campaigns that sell a project before it is built.",
    detail: {
      lead: "A project has to be sold long before anyone can walk through it. We make the films, feeds and launch events that let buyers see it first.",
      paragraphs: [
        "From the first teaser to possession day, we plan content around each stage of a project: pre-launch buzz, launch, construction updates and handover.",
        "One team handles the AV film, the social calendar, the ads and the on-site event, so the project looks and sounds the same everywhere a buyer meets it.",
      ],
      offerings: [
        { title: "AV films", text: "Cinematic project films built from renders, drone footage and on-ground shoots." },
        { title: "Social media", text: "A content calendar from teaser to possession, with construction updates in between." },
        { title: "Ads", text: "Lead campaigns on Meta and Google, with creative refreshed as the project moves." },
        { title: "Branding", text: "Project names, logos and sales collateral that sit well with the developer brand." },
        { title: "Event launches", text: "Launch-day production: site décor, stage, live content and same-day edits." },
      ],
      challenges: [
        { title: "Selling the unbuilt", text: "Buyers need to picture a home that is still a site. Films and renders carry that weight." },
        { title: "Long sales cycles", text: "Interest has to be kept warm for months, not days." },
        { title: "Crowded markets", text: "Every project nearby says the same things. The creative has to say something else." },
      ],
      faqs: [
        { q: "Can you work from renders only?", a: "Yes. Most pre-launch films start from 3D renders, with live footage added as the site grows." },
        { q: "Do you handle the launch event too?", a: "Yes, from planning and décor to live coverage and the recap film." },
        { q: "How early should we bring you in?", a: "Ideally before the project name is final, so the brand and the launch plan are built together." },
      ],
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
