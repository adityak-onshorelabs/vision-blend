/*
  Portfolio pieces that are hosted on ImageKit (NEXT_PUBLIC_MEDIA_URL), keyed by their Drive file id.

  Work items (in code and in the admin) name a piece by its Drive file id. When the id is listed
  here, the work page plays the full film (or shows the full image) from ImageKit instead of Drive,
  so the studio's Drive folder can stay private. Pieces not listed here still load from Drive, which
  needs the file shared "anyone with the link".

  New pieces are added with `npm run media:import` (scripts/media-import.mjs), which prints the lines
  to paste here. Files live under work/<industry>/ in the media library (Onshorelabs/vision-blend/ on ImageKit) and
  play as uploaded (src/lib/stream.ts), so each file is the quality the visitor gets. Each is the
  best version in the studio's Drive. Files over ImageKit's 100 MB upload cap were re-encoded with
  H.264 (slow preset) at the highest bitrate that fits: the Presidence One walkthrough (1600x700,
  2-pass 3.35 Mbps), the Meghna One brand film (4K master to 1920x1080, 2-pass 4.15 Mbps), the
  Godrej ad (ADS/1080 re-export, CRF 16) and Upper Kharghar (re-shared 48 Mbps master, CRF 16).
  The rest are the Drive files untouched. Below 1080p at source: FIFA and Presidence One launch
  (1276x718), Site Supervisor (848x480).
*/
import { media } from "@/lib/media";

/** The hosted file, and for films the card frame */
export type Hosted = { src: string; poster?: string };

/*
  A film at work/<industry>/<name>.mp4 on ImageKit. Its card frame (1 s in) is kept on the site, at
  public/images/work/<industry>/<name>.jpg, rather than ImageKit's ik-thumbnail: that is a video
  transformation and stops when the month's video processing units run out. `poster = false` for
  films with their own poster on the work item (FIFA and Meghna, in industry-details.ts).
*/
const film = (industry: string, name: string, poster = true): Hosted => ({
  src: media(`/work/${industry}/${name}.mp4`),
  ...(poster ? { poster: `/images/work/${industry}/${name}.jpg` } : {}),
});
/** An image at work/<industry>/<file> on ImageKit */
const still = (industry: string, file: string): Hosted => ({ src: media(`/work/${industry}/${file}`) });

export const HOSTED_WORK: Record<string, Hosted> = {
  // Real Estate films
  "1qxhFkqv3Ubzqy_Bbfmbep2RjBNDqnxZv": film("real-estate", "presidence-one-walkthrough-hq"),
  "1EkolrQ1iLk_ctjj1Lca7VE33HN8rkiWQ": film("real-estate", "where-vision-meets-vista-1080"),
  "1H7Ff4uay6LEawRH_Ay_vlhc0B_WFKsEG": film("real-estate", "fifa-sai-world-empire", false),
  "11xZkFbKV8wTJH8gR2TcIRJWgBgRInOgK": film("real-estate", "what-home-means-to-me"),
  "1AkTnxyxJ0dJX6CHPz2hrJftqJWG1a2pz": film("real-estate", "upper-kharghar-growth-area-1080"),
  "1dqmYNyH-Pwce1PFTWms9VCyDTq4kYtHN": film("real-estate", "presidence-one-launch"),
  "1Ys0ngz8WtmjmcvsRndVa9-olFvUeFy9Z": film("real-estate", "meghna-one-brand-film-hq", false),
  "1iGBXHQDvv7D3STZZ2JqWWAS4lxtzeGkF": film("real-estate", "site-supervisor"),
  // Real Estate stills (Meghna Realty carousel slides)
  "1M_l_jlRKSJE4hXv4tJDpNFeC3RpWfNGT": still("real-estate", "where-better-work-begins.png"),
  "1OPcuhfV8kOCfRkNVke8jQ2_FGcztnciM": still("real-estate", "prime-business-address.png"),
  "1ZHBWoN_SG5YY7crDp5C_OlCzPAREmiXd": still("real-estate", "igbc-sustainable-landmark.png"),
  "1QZ8Njg2TvIIIpygOeKdvDAJ-nMY6gTqY": still("real-estate", "your-office-your-way.png"),
  "1OlhEiTcdKJGAt5_NEKBxzWcXcAMMg2TX": still("real-estate", "smoother-start-every-workday.png"),
  "18ffMNJCo-xpfWW5VIXYEHD_vWQHbyi4a": still("real-estate", "wellness-beyond-workplace.png"),
  "1NPcP56ChH6UOrCUdJoFsKsud0-zoiPu5": still("real-estate", "your-own-personal-rainforest.png"),
  // Hospitality & Services films (final content, 12 Nov 2026)
  "1-aG_ztgcatNJeVBXj-5DVcgS106NZFiN": film("hospitality-services", "one-above-gym-borivali-cinematic"),
  "1uvJxTVWt5OVjTBZH-aC_Wj5jnQwTqNBR": film("hospitality-services", "one-above-what-you-see-inside-01"),
  "1GY961oxLTh4HKbv-ueiEWzNJJgAKYXuj": film("hospitality-services", "ceo-rules-the-art-of-bespoke-at-ceo-rules-001"),
  "1z9BGsWchV3Bz4UhfDQJbR8IXubUMfJXn": film("hospitality-services", "basilico-video-1-two-sides-of-a-basilico-morning-morning"),
  "1FTqTDOvyDtnIODfrcEtSd06A-khkYaEZ": film("hospitality-services", "wd-after-vs-before-horizontala-video-01"),
  "1Mb_0Zagi7SznhjTvm1Tf7fOnHg7t6ku6": film("hospitality-services", "one-above-reel-2-ad-group-classes-one-above-kharghar"),
  "1BcSo5gbwlRMX0m4niHPcWauC2wWOoomY": film("hospitality-services", "one-above-reel-4-ad-space-and-equipment-one-above-kharghar"),
  "1TaQw8_wjIhPo1YB74K72152XQR_oPGVH": film("hospitality-services", "cfo-sme-top-5-cashflow-mistakes-that-kill-bus"),
  "1d7n1NAquAF20sbM10sZ2IVr5uwHuO4rB": film("hospitality-services", "cfosme-budget-vs-forecasting-whata-s-the-difference-1"),
  "1OrFsm7E8U8yMj84100jI0JnAWMOy7KZR": film("hospitality-services", "wedding-destination-ai-video-9-a-rose-tinted-wedding-dream"),
  "1jIuG0OREseTVdq_M0dF-YFE54llv-atC": film("hospitality-services", "wedding-destination-ai-video-7-a-south-indian-dream-1"),
  "1BCoShUXKCZmd_xBivVuyEzmO1sROvSCn": film("hospitality-services", "myrrah-7-a-home-that-grows-with-you-d2"),
  "1PPtk37URN6RMKR-yqglLnrG1494tbnTc": film("hospitality-services", "myrrah-spaces-that-inspire"),
  // Automobile films (final content, 12 Nov 2026)
  "1bwnDGnzAkycwWOJdQB7G3wmVrqEM91gc": film("automobile", "the-wait-is-over-the-all-new-skoda-kodiaq-has-officially-lan"),
  "1TwIf9X5ztN44CopWl4nxKVpK52tXPDlF": film("automobile", "a-new-beginning-the-same-trust-garnet-motors-proudly-relaunc"),
  "1oS_RcDIHKmeKNZc-wH7rFVNPvRH4YqVP": film("automobile", "this-festive-season-bring-home-new-beginnings-and-a-brand-ne"),
  "1J1qAgcieK8Z1Ftwve7nIHloRm4ASzq99": film("automobile", "some-bonds-deserve-more-than-just-a-thread-a-i-this-raksha-b"),
  "1vC40P7WuoPap8OiYskLZOgy95J7sVQzN": film("automobile", "scratchgard-reel-3-before-it-becomes-ppf-it-becomes-data"),
  "14ncPnjU2LUcTkOF4Cgp2vdUCbQItVlnS": film("automobile", "choosing-ppf-take-a-closer-look-at-its-topcoat-depending-on"),
  "1tYduhOJSt3NtFKL839xJO75cKuGk9WQT": film("automobile", "60k-cars-video-03-a-low-mileage-is-not-enough-d2"),
  "16jsdb0EgsKl8_mMn8TmhmK6ZMcZE8iRZ": film("automobile", "60k-cars-video-8-your-shortlist-starts-with-your-day"),
};

/** The hosted file for a Drive id, when there is one and ImageKit is configured */
export const hostedOf = (drive?: string): Hosted | undefined => (drive && process.env.NEXT_PUBLIC_MEDIA_URL ? HOSTED_WORK[drive] : undefined);
