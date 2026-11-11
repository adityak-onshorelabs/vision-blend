/*
  Video sources for files served from ImageKit (NEXT_PUBLIC_MEDIA_URL, see src/lib/media.ts).

  ImageKit's default delivery recompresses video hard: a 63 MB 1080p upload came back as a 14 MB MP4,
  and its adaptive (HLS) ladder tops out around 3 Mbps for 1080p. That is visibly soft for the
  studio's films, so every ImageKit video plays as the file we uploaded (tr=orig-true), byte for
  byte, from ImageKit's CDN with range requests (seeking works). Quality is set where the files are
  encoded, not here. Files not on ImageKit (public/) play as they are.
*/
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");

/** Whether this file is on ImageKit */
const onImageKit = (video: string) => !!MEDIA_BASE && video.startsWith(`${MEDIA_BASE}/`);

/** The URL to play: the untouched upload for ImageKit files */
export const sourceOf = (video: string) => (onImageKit(video) ? `${video}?tr=orig-true` : video);
