/*
  Portfolio pieces that are hosted on ImageKit (NEXT_PUBLIC_MEDIA_URL), keyed by their Drive file id.

  Work items (in code and in the admin) name a piece by its Drive file id. When the id is listed
  here, the work page plays the full film (or shows the full image) from ImageKit instead of Drive,
  so the studio's Drive folder can stay private. Pieces not listed here still load from Drive, which
  needs the file shared "anyone with the link".

  Files live under work/<industry>/ in the media library (Onshorelabs/vision-blend/ on ImageKit),
  uploaded from the studio's Drive at the resolution they were exported. Two were re-encoded to fit
  ImageKit's 100 MB upload cap: the Presidence One walkthrough (same 1600x700 frame, H.264 CRF 20)
  and the Meghna One brand film (a 4K master, brought down to 1920x1080, H.264 CRF 19).
*/
import { media } from "@/lib/media";

const re = (name: string) => media(`/work/real-estate/${name}`);

export const HOSTED_WORK: Record<string, string> = {
  // Real Estate films
  "1qxhFkqv3Ubzqy_Bbfmbep2RjBNDqnxZv": re("presidence-one-walkthrough.mp4"),
  "1EkolrQ1iLk_ctjj1Lca7VE33HN8rkiWQ": re("where-vision-meets-vista.mp4"),
  "1H7Ff4uay6LEawRH_Ay_vlhc0B_WFKsEG": re("fifa-sai-world-empire.mp4"),
  "11xZkFbKV8wTJH8gR2TcIRJWgBgRInOgK": re("what-home-means-to-me.mp4"),
  "1AkTnxyxJ0dJX6CHPz2hrJftqJWG1a2pz": re("upper-kharghar-growth-area.mp4"),
  "1dqmYNyH-Pwce1PFTWms9VCyDTq4kYtHN": re("presidence-one-launch.mp4"),
  "1Ys0ngz8WtmjmcvsRndVa9-olFvUeFy9Z": re("meghna-one-brand-film.mp4"),
  "1iGBXHQDvv7D3STZZ2JqWWAS4lxtzeGkF": re("site-supervisor.mp4"),
  // Real Estate stills (Meghna Realty carousel slides)
  "1M_l_jlRKSJE4hXv4tJDpNFeC3RpWfNGT": re("where-better-work-begins.png"),
  "1OPcuhfV8kOCfRkNVke8jQ2_FGcztnciM": re("prime-business-address.png"),
  "1ZHBWoN_SG5YY7crDp5C_OlCzPAREmiXd": re("igbc-sustainable-landmark.png"),
  "1QZ8Njg2TvIIIpygOeKdvDAJ-nMY6gTqY": re("your-office-your-way.png"),
  "1OlhEiTcdKJGAt5_NEKBxzWcXcAMMg2TX": re("smoother-start-every-workday.png"),
  "18ffMNJCo-xpfWW5VIXYEHD_vWQHbyi4a": re("wellness-beyond-workplace.png"),
  "1NPcP56ChH6UOrCUdJoFsKsud0-zoiPu5": re("your-own-personal-rainforest.png"),
};

/** The hosted file for a Drive id, when there is one and ImageKit is configured */
export const hostedOf = (drive?: string) => (drive && process.env.NEXT_PUBLIC_MEDIA_URL ? HOSTED_WORK[drive] : undefined);
