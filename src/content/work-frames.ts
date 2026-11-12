/*
  Card frames for portfolio films, keyed by Drive file id.

  Every portfolio piece plays from Google Drive (final decision, 12 Nov 2026: ImageKit is no longer
  used). The studio's portfolio folder is shared "anyone with the link", so the work page opens each
  film in Drive's own player (/file/d/<id>/preview) and each still at Drive's full size.

  A Drive thumbnail is often a dark title card, so films with a frame saved on the site
  (public/images/work/<industry>/<name>.jpg, one second in) show that on their card instead. Pieces
  not listed here use Drive's thumbnail. A work item's own `poster` wins over both.

  Real Estate films point at the studio's 1080 copies in its Drive (the 1080 subfolders), so Drive's
  player has the best source to work from.
*/

const frame = (industry: string, name: string) => `/images/work/${industry}/${name}.jpg`;

const WORK_FRAMES: Record<string, string> = {
  // Real Estate (the studio's 1080 Drive copies)
  "1nCQyqf2hQBEkQpAToOk7hSUWX14-UuWA": frame("real-estate", "presidence-one-walkthrough-hq"),
  "10nVCYk1p6P187ujbIGP_1X7H-LEvnaaT": frame("real-estate", "where-vision-meets-vista-1080"),
  "1DsE2gCe-hPG4Y7NM5BRfaLh-FEm89WY_": frame("real-estate", "what-home-means-to-me"),
  "1PtF_MHTFZXERtyzO2KjttZXBylp77I2T": frame("real-estate", "upper-kharghar-growth-area-1080"),
  "1eN3qZK8FqwKQZ_eS6-mHay9owxDsQlO_": frame("real-estate", "presidence-one-launch"),
  "10M-G_p2H5NBL6GNhvoyau2id5M5DCqkQ": frame("real-estate", "site-supervisor"),
  // Hospitality & Services
  "1-aG_ztgcatNJeVBXj-5DVcgS106NZFiN": frame("hospitality-services", "one-above-gym-borivali-cinematic"),
  "1Mb_0Zagi7SznhjTvm1Tf7fOnHg7t6ku6": frame("hospitality-services", "one-above-reel-2-ad-group-classes-one-above-kharghar"),
  "1OrFsm7E8U8yMj84100jI0JnAWMOy7KZR": frame("hospitality-services", "wedding-destination-ai-video-9-a-rose-tinted-wedding-dream"),
  "1uvJxTVWt5OVjTBZH-aC_Wj5jnQwTqNBR": frame("hospitality-services", "one-above-what-you-see-inside-01"),
  "1GY961oxLTh4HKbv-ueiEWzNJJgAKYXuj": frame("hospitality-services", "ceo-rules-the-art-of-bespoke-at-ceo-rules-001"),
  "1z9BGsWchV3Bz4UhfDQJbR8IXubUMfJXn": frame("hospitality-services", "basilico-video-1-two-sides-of-a-basilico-morning-morning"),
  "1FTqTDOvyDtnIODfrcEtSd06A-khkYaEZ": frame("hospitality-services", "wd-after-vs-before-horizontala-video-01"),
  "1BcSo5gbwlRMX0m4niHPcWauC2wWOoomY": frame("hospitality-services", "one-above-reel-4-ad-space-and-equipment-one-above-kharghar"),
  "1TaQw8_wjIhPo1YB74K72152XQR_oPGVH": frame("hospitality-services", "cfo-sme-top-5-cashflow-mistakes-that-kill-bus"),
  "1d7n1NAquAF20sbM10sZ2IVr5uwHuO4rB": frame("hospitality-services", "cfosme-budget-vs-forecasting-whata-s-the-difference-1"),
  "1BCoShUXKCZmd_xBivVuyEzmO1sROvSCn": frame("hospitality-services", "myrrah-7-a-home-that-grows-with-you-d2"),
  "1PPtk37URN6RMKR-yqglLnrG1494tbnTc": frame("hospitality-services", "myrrah-spaces-that-inspire"),
  "1jIuG0OREseTVdq_M0dF-YFE54llv-atC": frame("hospitality-services", "wedding-destination-ai-video-7-a-south-indian-dream-1"),
  // Automobile
  "1bwnDGnzAkycwWOJdQB7G3wmVrqEM91gc": frame("automobile", "the-wait-is-over-the-all-new-skoda-kodiaq-has-officially-lan"),
  "1oS_RcDIHKmeKNZc-wH7rFVNPvRH4YqVP": frame("automobile", "this-festive-season-bring-home-new-beginnings-and-a-brand-ne"),
  "1vC40P7WuoPap8OiYskLZOgy95J7sVQzN": frame("automobile", "scratchgard-reel-3-before-it-becomes-ppf-it-becomes-data"),
  "1TwIf9X5ztN44CopWl4nxKVpK52tXPDlF": frame("automobile", "a-new-beginning-the-same-trust-garnet-motors-proudly-relaunc"),
  "1J1qAgcieK8Z1Ftwve7nIHloRm4ASzq99": frame("automobile", "some-bonds-deserve-more-than-just-a-thread-a-i-this-raksha-b"),
  "1tYduhOJSt3NtFKL839xJO75cKuGk9WQT": frame("automobile", "60k-cars-video-03-a-low-mileage-is-not-enough-d2"),
  "16jsdb0EgsKl8_mMn8TmhmK6ZMcZE8iRZ": frame("automobile", "60k-cars-video-8-your-shortlist-starts-with-your-day"),
  "14ncPnjU2LUcTkOF4Cgp2vdUCbQItVlnS": frame("automobile", "choosing-ppf-take-a-closer-look-at-its-topcoat-depending-on"),
  // D2C
  "1tkkC99yee4JwNLt7L1Mp_Xvq7-rnyKp4": frame("d2c", "onyc-sketch-to-step"),
  "1zz5nV1UASZnUPfi6e76Lo4I_SOUt_Z0p": frame("d2c", "esbeda-event-lake-shore-mall-post-event-reel"),
  "1Nr-ng6oQKXlF6eXjZSzIs07Jg5BClkyy": frame("d2c", "parisbelle-v4"),
  "1GFZa8X_0PKptVmIsn0X8Zs3QOzgp1H3_": frame("d2c", "up-and-run-ritu-intro-video-02"),
  "1M-SM9tPXv6S1FkLjEHEX3buhFTYrMp1p": frame("d2c", "tvc-1-ajmal-bucket-3-storytelling-tvc-full-scripts-2"),
  "1zrt6tx7IXCTfQd0Gg07kocphoHTwIm_P": frame("d2c", "esbeda-event-highlight-day-1-event-crawford-market-01"),
  "1O_JNapoX7rlYPZ5EvHydLuYwHowfy7NZ": frame("d2c", "parisbelle-shehnaaz-gill-video"),
  "1M44J2ylKzQ-aoClh1tORTWgmXnKhpG7K": frame("d2c", "parisbelle-2025"),
  "1rtiuagPHjoEBR8H1T6jt7IiUE37WVJ5Q": frame("d2c", "parisbelle-ayesha-khan"),
  "1vRxG6ZmRBvuWnH-VUI58V3RcctXfmJeJ": frame("d2c", "tvc-2-ajmal-video-7-additional-tvc-style-video-concept-2"),
  "1tNiwtTotD1eO8bitqPrgUpQdtxoQ-H62": frame("d2c", "majestic-offline-ad-a-couple-shopping-surprise-crisp-english"),
  "1tiFzfVweSZwKRIOAhlquQ8Ogr9qD-kRI": frame("d2c", "up-and-run-youa-re-not-drinking-water-the-right-way"),
  "19dMrxMh-TzjYQQrQv66yni0j6c9l6nJY": frame("d2c", "wype-promo-video"),
  "1EOJP0IAXeNNDasFDMQe92Vf4GNwuL2eu": frame("d2c", "wype-exaggerateda-reviewsa-video-v1"),
  "1g72FZ7yq2emIwXt2CC_CmEUvBqA9Sarb": frame("d2c", "fang-script-1-why-we-created-fang"),
  "150RK7zbZ8ox1_AGswt510ImmMUUQlX6E": frame("d2c", "the-myths-that-are-slowly-destroying-your-t"),
};

/** The site's saved card frame for a Drive file, when there is one */
export const cardFrameOf = (drive?: string): string | undefined => (drive ? WORK_FRAMES[drive] : undefined);
