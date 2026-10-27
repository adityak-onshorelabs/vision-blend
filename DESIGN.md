# Design System: Vision Blend

## 1. Visual Theme & Atmosphere

"The full stop." The wordmark ends in a period: "Vision Blend." The site takes that one detail and uses it as its only ornament, a small brown dot that ends every headline and marks section labels, active states, buttons and published projects. Everything else is quiet: a neutral off-white page, near-black type in one geometric family close to the wordmark, hairline rules, sharp corners, and generous space. Sections alternate light, tint and dark bands, each opened by a numbered index row ("02 / 06") so the page reads as clearly separated chapters. The copper key visual from the brand assets appears once, large, in the hero.

Scene: a founder or brand manager on a laptop in a bright studio, judging taste in the first ten seconds, then reopening the link on a phone. Light theme, with one dark band for the film series and the footer.

## 2. Color Palette & Roles

Strategy: **Restrained.** Neutrals carry the page; the logo brown appears only as the dot, the active rule and hover fills (well under 10 percent). OKLCH is the source of truth (`src/app/globals.css`).

| Token | OKLCH | Role |
|---|---|---|
| `--paper` | `oklch(0.975 0.003 85)` | Page background |
| `--tint` | `oklch(0.945 0.005 85)` | Alternate band, illustration wells |
| `--well` | `oklch(0.915 0.006 80)` | Image wells |
| `--ink` | `oklch(0.19 0.008 40)` | Text, primary buttons |
| `--muted` | `oklch(0.47 0.01 50)` | Secondary text |
| `--faint` | `oklch(0.53 0.012 55)` | Meta text (dates, counts) |
| `--rule` | ink at 12 percent | Hairlines |
| `--brand` | `oklch(0.36 0.1 42)` | Logo brown (#692C11 sampled from the wordmark): the dot, active rules |
| `--brand-soft` | `oklch(0.68 0.09 55)` | The dot on dark fills and dark bands |
| `--night` | `oklch(0.17 0.006 40)` | Dark band, footer |
| `--on-night` / `--on-night-muted` | `oklch(0.95 ...)` / `oklch(0.68 ...)` | Text on night |

Rules: no gradients except the client's own key visual. Contrast verified with `contrast.py`; lowest text pair is faint on tint at 4.51.

## 3. Typography

Family: **Jost** (variable weight), a geometric sans in the same family of shapes as the wordmark. One family, contrast from weight and size. Serif display faces were tried in the first concept and rejected.

| Role | Setting |
|---|---|
| Display (`.t-display`) | 300, clamp(3rem, 1.3rem + 5.2vw, 6.75rem), tracking -0.045em, lh 0.95 |
| H1 (`.t-h1`) | 300, clamp(2.6rem ... 5rem), tracking -0.04em |
| H2 (`.t-h2`) | 300, clamp(2rem ... 3.5rem), tracking -0.03em |
| Quote (`.t-quote`) | 300, clamp(1.6rem ... 2.75rem) |
| H3 (`.t-h3`) | 400, clamp(1.35rem ... 1.75rem) |
| Lead (`.t-lead`) | 340, clamp(1.15rem ... 1.4rem) |
| Body | 380, 1.0625rem, lh 1.6, tabular numerals |
| Label (`.t-label`) | 500, 0.78rem, uppercase, tracking 0.12em |

## 4. Components

- **Index row + section head** (`SectionHead`): marker label left, "NN / NN" right over a hairline; title (ends with the brown full stop) spans 7 columns, side note sits in columns 9 to 12.
- **Buttons** (`.cta`, `.cta-line`, `.cta-sm`): square, 46px tall (40px small), dot before the label grows on hover, arrow slides in.
- **Link underline** (`.u`): hairline draws in from the left on hover, focus and current page.
- **Work index** (`WorkIndex`): numbered rows; hover or focus shifts the name, draws the row rule and updates the sticky preview. Published projects carry the dot, slots carry a "Slot" tag.
- **Service cards** (`ServiceCards`, `ServiceIllustration`): line drawings with the brown dot. Hover draws a brown top rule, list items step in, the drawing animates (circles blend, viewfinder zooms, feed tiles lift).
- **Beliefs** (`Beliefs`): the studio's own lines set large; hover darkens the line and shows the dot.
- **Process rail** (`ProcessRail`): adapted from Watermelon `step-indicator`; a brown bar slides between segments on hover/focus.
- **Series embeds** (`SeriesEmbeds`): Instagram's own embed markup in a horizontal snap row; embed.js loads when the row nears the viewport; link cards until then.
- **Enquiry form** (`EnquiryForm`): adapted from Watermelon `progressive-input-stack`; three steps, finished steps collapse into editable summary strips, underline fields, square chips.
- **Page transition** (`PageTransition`): on internal link clicks a night panel wipes up, the destination's line illustration draws in with the page name and the brown full stop (Home: two circles blend; Work: viewfinder; Services: three circles; About: six tiles; Contact: a line ending in a full stop), the route changes underneath, then the panel wipes away upward. Back/forward, new-tab, external, same-page links and reduced motion skip it.
- **Project illustrations** (`ProjectArt`): one line drawing per project (film strip and football, palm and horizon, six portrait frames, seven-day strip, VB construction grid, phone feed) on the tint well, drawn in on mount. Placeholders until the studio shares stills.
- Radii: 0 everywhere except the dot. Shadows: none; depth comes from bands and rules.

## 5. Layout

- 12 columns, max width 1360px, gutters 20px mobile and 40px from 760px.
- Asymmetric, left-aligned. Hero copy spans 7 columns with the key visual in 5.
- Sections use `--section` (80 to 152px) bottom padding and a short top pad above the index row.
- Mobile first; no horizontal page scroll; the reel row scrolls inside its own track.

## 6. Motion

Library: Motion (`motion/react`) plus CSS transitions. Native browser scroll only.

- Hero: no entrance animation, it paints immediately.
- Sections: `Reveal` (fade + 16px rise, once) on below-the-fold groups.
- Hover states: 300 to 900ms with `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Process bar and form steps: springs without visible overshoot.
- `prefers-reduced-motion: reduce`: transitions and animations are cut to static.

## 7. Imagery

The copper key visual (`public/images/key-visual.jpg`) is the client's own asset. Project images are line illustrations (`ProjectArt`), labelled "Illustration", until the studio shares stills. Reel covers are Instagram's own previews, cropped from the official embed.
