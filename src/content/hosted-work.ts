/*
  Portfolio pieces that are hosted on ImageKit (NEXT_PUBLIC_MEDIA_URL), keyed by their Drive file id.

  Work items (in code and in the admin) name a piece by its Drive file id. When the id is listed
  here, the work page plays the full film (or shows the full image) from ImageKit instead of Drive,
  so the studio's Drive folder can stay private. Pieces not listed here still load from Drive, which
  needs the file shared "anyone with the link".

  Files live under work/<industry>/ in the media library (Onshorelabs/vision-blend/ on ImageKit) and
  play as uploaded (src/lib/stream.ts), so each file is the quality the visitor gets. Each is the
  best version in the studio's Drive. Files over ImageKit's 100 MB upload cap were re-encoded with
  H.264 (slow preset) at the highest bitrate that fits: the Presidence One walkthrough (1600x700,
  2-pass 3.35 Mbps), the Meghna One brand film (4K master to 1920x1080, 2-pass 4.15 Mbps), the
  Godrej ad (ADS/1080 re-export, CRF 16) and Upper Kharghar (re-shared 48 Mbps master, CRF 16).
  The rest are the Drive files untouched. Below 1080p at source: FIFA and Presidence One launch
  (1276x718), Site Supervisor (848x480).
*/
import { media } from "@/lib/media";

const re = (name: string) => media(`/work/real-estate/${name}`);
/*
  Card frames for the films: 1 s into each file, in public/images/work/real-estate/. Kept on the
  site rather than ImageKit's ik-thumbnail, which is a video transformation and stops when the
  month's video processing units run out. FIFA and Meghna have their own posters (industry-details.ts).
*/
const frame = (name: string) => `/images/work/real-estate/${name}.jpg`;

/** The hosted file, and for films the card frame */
export type Hosted = { src: string; poster?: string };

const film = (name: string, poster = true): Hosted => ({ src: re(`${name}.mp4`), ...(poster ? { poster: frame(name) } : {}) });
const still = (name: string): Hosted => ({ src: re(`${name}.png`) });

export const HOSTED_WORK: Record<string, Hosted> = {
  // Real Estate films
  "1qxhFkqv3Ubzqy_Bbfmbep2RjBNDqnxZv": film("presidence-one-walkthrough-hq"),
  "1EkolrQ1iLk_ctjj1Lca7VE33HN8rkiWQ": film("where-vision-meets-vista-1080"),
  "1H7Ff4uay6LEawRH_Ay_vlhc0B_WFKsEG": film("fifa-sai-world-empire", false),
  "11xZkFbKV8wTJH8gR2TcIRJWgBgRInOgK": film("what-home-means-to-me"),
  "1AkTnxyxJ0dJX6CHPz2hrJftqJWG1a2pz": film("upper-kharghar-growth-area-1080"),
  "1dqmYNyH-Pwce1PFTWms9VCyDTq4kYtHN": film("presidence-one-launch"),
  "1Ys0ngz8WtmjmcvsRndVa9-olFvUeFy9Z": film("meghna-one-brand-film-hq", false),
  "1iGBXHQDvv7D3STZZ2JqWWAS4lxtzeGkF": film("site-supervisor"),
  // Real Estate stills (Meghna Realty carousel slides)
  "1M_l_jlRKSJE4hXv4tJDpNFeC3RpWfNGT": still("where-better-work-begins"),
  "1OPcuhfV8kOCfRkNVke8jQ2_FGcztnciM": still("prime-business-address"),
  "1ZHBWoN_SG5YY7crDp5C_OlCzPAREmiXd": still("igbc-sustainable-landmark"),
  "1QZ8Njg2TvIIIpygOeKdvDAJ-nMY6gTqY": still("your-office-your-way"),
  "1OlhEiTcdKJGAt5_NEKBxzWcXcAMMg2TX": still("smoother-start-every-workday"),
  "18ffMNJCo-xpfWW5VIXYEHD_vWQHbyi4a": still("wellness-beyond-workplace"),
  "1NPcP56ChH6UOrCUdJoFsKsud0-zoiPu5": still("your-own-personal-rainforest"),
};

/** The hosted file for a Drive id, when there is one and ImageKit is configured */
export const hostedOf = (drive?: string): Hosted | undefined => (drive && process.env.NEXT_PUBLIC_MEDIA_URL ? HOSTED_WORK[drive] : undefined);
