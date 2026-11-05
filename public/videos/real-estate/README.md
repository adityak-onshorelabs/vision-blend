# Real Estate showcase clips

One muted 12-second loop per content category, cut from the studio's Drive folders (linked per
category in `src/content/industry-details.ts` as `assets`). `<name>.jpg` is each clip's first frame,
used as the poster. Branding has no assets yet.

Encoding: H.264, CRF 26-27, no audio, `+faststart`, 720p (landscape) or 540 wide (vertical).
Statics & Carousels is the seven carousel PNGs swiping one to the next (the Drive folder has images only).

To serve these from ImageKit, upload this folder to the same path in the media library and set
`NEXT_PUBLIC_MEDIA_URL` (see `src/lib/media.ts`).
