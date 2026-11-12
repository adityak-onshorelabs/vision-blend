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
| `src/content/en.ts` | All copy and facts, with sources and TBC notes at the top; the defaults the admin edits over |
| `src/lib/cms/`, `src/app/api/cms/route.ts` | Reading what the admin saved: schemas and limits, Postgres reads, cached merge; the endpoint the admin calls |
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
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, OG link previews (`public/images/og-copper.jpg`). Set it once visionblend.in is connected; unset, Vercel's production URL is used so WhatsApp previews work |
| `RESEND_API_KEY` | Resend API key for enquiry emails |
| `ENQUIRY_TO` | Recipient(s), comma-separated |
| `ENQUIRY_FROM` | Verified sender address |
| `DATABASE_URL` | Railway Postgres the admin writes (Railway → Postgres → Variables → `DATABASE_PUBLIC_URL`), read-only here. Unset locally, the site reads `.cms-dev.json` (gitignored), written by a local admin |
| `CMS_SECRET` | 32+ random characters, the same value as the admin's, authorising `/api/cms` (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Unset, the endpoint refuses every call |

Without the Resend variables, development logs each brief to the console and production answers 503 so no brief is silently lost.

## Adding portfolio videos and images

Portfolio films and stills play straight from the studio's Google Drive (ImageKit was dropped on
12 Nov 2026). The studio's portfolio folder must stay shared "anyone with the link".

1. Add the piece to the industry's `work.items` in `src/content/industry-details.ts` with its Drive
   file id, category, `kind` and its frame size as `ratio` (read it with
   `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "<drive download url>"`).
2. Optional card frame (when Drive's thumbnail is a dark title card): save a JPG one second in to
   `public/images/work/<industry>/<name>.jpg` and list it in `src/content/work-frames.ts`.
3. A category card's looping clip lives in the site itself, `public/videos/<industry>/<name>.mp4`
   plus a poster `.jpg`. Cut 12 seconds at 720p:

```bash
ffmpeg -ss 3 -i film.mp4 -t 12 -an -vf "scale='if(gt(iw,ih),-2,min(720,iw))':'if(gt(iw,ih),min(720,ih),-2)'"   -c:v libx264 -preset slow -crf 23 -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p -movflags +faststart loop.mp4
ffmpeg -i loop.mp4 -frames:v 1 -q:v 3 loop.jpg
```

## Admin (separate deployment)

The admin is its own app and Vercel project (`../admin`, see its README). The Vision Blend team edits the hero (label, tagline, intro, with length limits), Work projects (add, edit, reorder, feature, cover image), series episodes (from 5 the row scrolls sideways), and studio details (team size, email, CC, phone). Long-form copy stays in `src/content/en.ts`; saved values are merged over it.

- Both apps share the Railway Postgres database; this site only reads the `content` table.
- `GET /api/cms` gives the admin the defaults from code; `POST /api/cms`, sent after every save, revalidates the `cms` cache tag, so no redeploy is needed. Both need `Authorization: Bearer CMS_SECRET`.
- Covers are on Vercel Blob (`*.public.blob.vercel-storage.com`, allowed in `next.config.ts`).
- `src/lib/cms/schema.ts` and `team.ts` are copied in the admin: change both together.

Services and industries editing comes once the client sends those lists.

## Before launch (needs the client)

- [x] Enquiry addresses (aquib@visionblend.com, cc gursimar@visionblend.com), phones (Aquib, Gursimar) and city (Mumbai), from the studio's sheet, 1 Nov 2026. Editable under Studio details in the admin.
- [x] Five industries in order (Real Estate, D2C, Services, Hospitality, Automobile) with the services under each, from the sheet.
- [x] Team of seven, names and roles. The team size is counted from the list (Team in the admin).
- [ ] Team photos: upload in the admin. They show on About only once everyone has one; until then the team is listed by name and role.
- [ ] Stills for each project (project images are copper placeholder crops; reel previews come from Instagram) and permission to show FIFA x Paradise and Delta Palm Beach work.
- [ ] Case study slots: real projects for "Identity system" and "Content retainer", or remove them.
- [ ] Domain and hosting for visionblend.in, Resend account with a verified sending domain.
- [ ] Privacy note for the form and Instagram embeds if required.
