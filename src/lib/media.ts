/**
 * Where heavy media (the industry showcase clips and their posters) is served from: the site's own
 * files in public/ (public/videos/<industry>/). ImageKit is no longer used (12 Nov 2026), so
 * NEXT_PUBLIC_MEDIA_URL is ignored; full films play from Google Drive (src/content/work-frames.ts).
 * Kept as a function so every media path stays in one place if a host is added again.
 */
export const media = (path: string) => path;
