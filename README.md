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
| `src/app/admin/`, `src/lib/cms/` | The admin (`/admin`): login, screens, Server Actions, schemas and limits, storage, cached reads |
| `src/content/types.ts` | Content types |
| `src/app/globals.css` | Tokens (OKLCH), shadcn mapping, type roles, buttons, bands, illustration hover rules |
| `src/app/[lang]/` | Layout and pages: home, `work`, `services`, `about`, `contact` |
| `src/app/api/enquiry/route.ts` | Brief form endpoint (zod validation, honeypot, Resend delivery) |
| `src/components/site/` | Site components (header, footer, work index, service cards, beliefs, process rail, series embeds, enquiry form) |
| `reference/watermelon/` | Untouched Watermelon sources the adapted components came from |
| `public/images/` | Wordmarks, copper key visual, OG image |
| `src/proxy.ts` | Redirects `/` and unprefixed paths to `/en`; sends signed-out `/admin` visits to the login |

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, OG link previews (`public/images/og-copper.jpg`). Set it once visionblend.in is connected; unset, Vercel's production URL is used so WhatsApp previews work |
| `RESEND_API_KEY` | Resend API key for enquiry emails |
| `ENQUIRY_TO` | Recipient(s), comma-separated |
| `ENQUIRY_FROM` | Verified sender address |
| `DATABASE_URL` | Neon Postgres for the admin (Vercel → Storage → Neon). Unset locally, the admin uses `.cms-dev.json` (gitignored) |
| `SESSION_SECRET` | 32+ random characters signing admin sessions (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob for project cover uploads (Vercel → Storage → Blob). Unset locally, uploads go to `public/uploads/` (gitignored) |

Without the Resend variables, development logs each brief to the console and production answers 503 so no brief is silently lost.

## Admin (`/admin`)

The Vision Blend team edits the hero (label, tagline, intro, with length limits), Work projects (add, edit, reorder, feature, cover image), series episodes (from 5 the row scrolls sideways), and studio details (team size, email, CC, phone). Long-form copy stays in `src/content/en.ts`; saved values are merged over it, and every save refreshes the public pages through `updateTag("cms")`, so no redeploy is needed.

1. Add `DATABASE_URL`, `SESSION_SECRET` and `BLOB_READ_WRITE_TOKEN` in Vercel (tables are created on first use).
2. Create the first owner: `node --env-file=.env.local scripts/cms-setup.mjs --email you@onshorelabs.co.in --name "Your Name"` (password from `CMS_PASSWORD` or a prompt).
3. Sign in at `/admin`; owners add the client's editors under **Editors & account**.

Services and industries editing comes once the client sends those lists.

## Before launch (needs the client)

- [ ] Confirm the enquiry addresses in `src/content/en.ts` (to visionblend@gmail.com, cc gursimar@visionblend.in; both were typed with typos). Contact and Start a project go to `/contact`, which offers a pre-filled draft (mail app or Gmail) and a copy button; the home page's contact section has the same card.
- [ ] Studio city/address (the row stays hidden until `company.location` is set in `src/content/en.ts`).
- [ ] Confirm service lists and process steps (drafted from Instagram captions and hashtags).
- [ ] Confirm "Six people" for the team line.
- [ ] Stills for each project (project images are copper placeholder crops; reel previews come from Instagram) and permission to show FIFA x Paradise and Delta Palm Beach work.
- [ ] Case study slots: real projects for "Identity system" and "Content retainer", or remove them.
- [ ] Domain and hosting for visionblend.in, Resend account with a verified sending domain.
- [ ] Privacy note for the form and Instagram embeds if required.
