# Vision Blend website

Marketing site for Vision Blend, a marketing studio (branding, film and production, content). Built from the approved homepage concept in `../concept/`.

## Stack

Next.js 16 (App Router, Turbopack, Cache Components), React 19, Tailwind CSS 4, shadcn (base-nova), Motion (`motion/react`), zod. Two components adapted from Watermelon UI. No GSAP, no smooth-scroll library.

Design docs: `PRODUCT.md` (who it is for, principles) and `DESIGN.md` (tokens, type, components, motion).

## Run

```bash
npm install
cp .env.example .env.local   # fill in to deliver enquiries
npm run dev                  # http://localhost:3000 -> redirects to /en
npm run build && npm start   # production
npx tsc --noEmit && npm run lint
```

## Where things live

| Path | What |
|---|---|
| `src/content/en.ts` | All copy and facts, with sources and TBC notes at the top |
| `src/content/types.ts` | Content types |
| `src/app/globals.css` | Tokens (OKLCH), shadcn mapping, type roles, buttons, bands, illustration hover rules |
| `src/app/[lang]/` | Layout and pages: home, `work`, `services`, `about`, `contact` |
| `src/app/api/enquiry/route.ts` | Brief form endpoint (zod validation, honeypot, Resend delivery) |
| `src/components/site/` | Site components (header, footer, work index, service cards, beliefs, process rail, series embeds, enquiry form) |
| `reference/watermelon/` | Untouched Watermelon sources the adapted components came from |
| `public/images/` | Wordmarks, copper key visual, OG image |
| `src/proxy.ts` | Redirects `/` and unprefixed paths to `/en` |

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, OG (defaults to https://www.visionblend.in) |
| `RESEND_API_KEY` | Resend API key for enquiry emails |
| `ENQUIRY_TO` | Recipient(s), comma-separated |
| `ENQUIRY_FROM` | Verified sender address |

Without the Resend variables, development logs each brief to the console and production answers 503 so no brief is silently lost.

## Before launch (needs the client)

- [ ] Studio email and city/address for the contact block (currently TBC).
- [ ] Confirm service lists and process steps (drafted from Instagram captions and hashtags).
- [ ] Confirm "Six people" for the team line.
- [ ] Stills for each project (project images are copper placeholder crops; reel previews come from Instagram) and permission to show FIFA x Paradise and Delta Palm Beach work.
- [ ] Case study slots: real projects for "Identity system" and "Content retainer", or remove them.
- [ ] Domain and hosting for visionblend.in, Resend account with a verified sending domain.
- [ ] Privacy note for the form and Instagram embeds if required.
