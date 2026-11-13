# Real Estate showcase clips

One muted 12-second loop per content category, cut from the studio's Drive folders (linked per
category in `src/content/industry-details.ts` as `assets`). `<name>.jpg` is each clip's first frame,
used as the poster. Branding is the studio's brand boards swiping one to the next (13 Nov 2026).

Encoding: H.264, CRF 26-27, no audio, `+faststart`, 720p (landscape) or 540 wide (vertical).
Statics & Carousels is the seven carousel PNGs swiping one to the next (the Drive folder has images only).

To serve these from ImageKit, upload this folder to the same path in the media library and set
`NEXT_PUBLIC_MEDIA_URL` (see `src/lib/media.ts`).

## Higher-quality versions on ImageKit (11 Nov 2026)

With `NEXT_PUBLIC_MEDIA_URL` set (production), the site plays the copies in ImageKit's
`Onshorelabs/vision-blend/videos/real-estate/`, not these files. Those are recut from the best
originals in the studio's Drive at source resolution: H.264 CRF 18 (capped at 6 Mbps), no audio,
`+faststart`, 12 s from the same start point as these (found by matching each poster frame):
testimonials 10 s (letterbox cropped to 1920x822), social-media 14 s (Upper Kharghar 48 Mbps master),
event-launches 26 s, av-films 40 s, ai-films 12 s (Meghna 4K master to 1920x1080),
construction-updates 20 s, ads 18 s (Godrej ADS/1080). campaign-film and statics-carousels are
unchanged: FIFA's colour cut is not in the Drive folder, and the carousel is built from stills.
The files here stay as the light local fallback; the posters (.jpg) are shared.

## 13 Nov 2026

ImageKit is no longer used, so these files are what the site plays. Recut at source resolution
from the studio's 1080 Drive masters: testimonials (from 10.6 s, letterbox cropped to 1920x816,
opening on the resident's name card) and construction-updates (Platinum Corp, from 20 s, 1920x1080),
H.264 CRF 21-22 capped at 4.5 Mbps.
