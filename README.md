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
| `FILMS_PUBLIC_URL` | The R2 bucket's public address when it is on its own domain (e.g. `https://media.visionblend.in`), so film posters can be optimised. `*.r2.dev` is allowed without it |
| `CMS_SECRET` | 32+ random characters, the same value as the admin's, authorising `/api/cms` (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Unset, the endpoint refuses every call |

Without the Resend variables, development logs each brief to the console and production answers 503 so no brief is silently lost.

## Adding portfolio videos and images

Portfolio media is hosted on ImageKit and plays as uploaded (`src/lib/stream.ts`): ImageKit's own
video processing is not used, so the monthly video processing units do not limit it. To add files
from the studio's Drive:

```bash
npm run media:import -- --industry real-estate <drive file link> [<drive file link> ...]
npm run media:import -- --industry d2c --loop-at 14 <drive file link>   # also cut a 12 s card loop
npm run media:import -- --industry d2c --drive <drive link> ./downloaded-private-file.mp4
npm run media:import -- --help
```

It downloads each file (shared "anyone with the link"), warns when it is below 1080p, keeps the
studio's encode where it fits ImageKit's 100 MB upload cap (re-encoding only what does not), saves the
film's card frame to `public/images/work/<industry>/`, uploads to ImageKit and prints the lines for
`src/content/hosted-work.ts` and `src/content/industry-details.ts`. Needs ffmpeg and ffprobe, and
`NEXT_PUBLIC_MEDIA_URL` and `IMAGEKIT_PRIVATE_KEY` in `.env.local` (the private key stays local: never
commit it or add it to Vercel). Upload under a new name rather than `--overwrite`: the CDN can keep
serving the old file under an old name.

## Showcase films from Drive (the film pipeline)

The client pastes a Drive link on a showcase card in the admin and saves. The admin starts
`.github/workflows/prepare-film.yml` here, which runs on GitHub Actions (free):

1. `scripts/films/drive-download.mjs` downloads the film as the pipeline's Google service account
   (the client shares the file or folder with its email once).
2. `scripts/films/encode.sh` cuts a 12-second muted loop from the chosen start time with ffmpeg, in
   up to three sizes (short side 720, 1080, 2160 px, never upscaled) and a poster.
3. The files go to Cloudflare R2 in a new folder per run (cached for a year, never overwritten).
4. `scripts/films/callback.mjs` reports to the admin's `/api/films`, which stores the result in the
   `films` row of `content` and refreshes this site.

The card then plays the loop (`src/components/site/showcase-media.tsx`): on first play it measures
the slot and loads the smallest size that fills it sharply, so a phone never downloads 4K. A newer cut
replaces the old one only once it is live. The workflow's secrets are listed at the top of the file;
`workflow_dispatch` only runs workflows on the default branch, so it works once merged to `main`.
To try the encoder locally: `bash scripts/films/encode.sh film.mp4 0 out/`.

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
