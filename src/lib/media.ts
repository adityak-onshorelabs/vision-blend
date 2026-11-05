/**
 * Where heavy media (the industry showcase clips and their posters) is served from.
 *
 * By default the files come from public/. To serve them from ImageKit instead, upload the same
 * folder tree (e.g. videos/real-estate/ads.mp4) to the ImageKit media library and set
 * NEXT_PUBLIC_MEDIA_URL to the URL endpoint, e.g. https://ik.imagekit.io/visionblend.
 * ImageKit then handles format, compression and caching; nothing else in the code changes.
 */
const base = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");

export const media = (path: string) => `${base}${path}`;
