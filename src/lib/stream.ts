/*
  Adaptive streaming for videos served from ImageKit (NEXT_PUBLIC_MEDIA_URL, see src/lib/media.ts).
  ImageKit turns an uploaded MP4 into an HLS ladder at <file>/ik-master.m3u8. Safari plays the
  manifest natively; elsewhere hls.js (loaded on demand) caps the rendition at the player's size.
  If the manifest fails (ImageKit answers 202 while it is still generating renditions), the plain
  MP4 plays instead. Files not on ImageKit play as plain MP4s.
*/
import type HlsType from "hls.js";

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");
const LADDER = "sr-480_720_1080_1440_2160";

/** Whether this file is on ImageKit, so it can stream */
export const streams = (video: string) => !!MEDIA_BASE && video.startsWith(`${MEDIA_BASE}/`);

const isSafari = () => /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);

/** Per-element stream state: which source is attached, the hls.js instance, whether it should be playing */
export type Stream = { mode?: "hls" | "mp4"; hls?: HlsType; want: boolean };

export function toMp4(v: HTMLVideoElement, video: string, s: Stream) {
  s.hls?.destroy();
  s.hls = undefined;
  s.mode = "mp4";
  v.src = video;
  if (s.want) v.play().catch(() => {});
}

/** Attaches the source the first time the video should play; later calls are no-ops */
export async function attach(v: HTMLVideoElement, video: string, s: Stream) {
  if (s.mode) return;
  if (!streams(video)) {
    s.mode = "mp4";
    if (!v.getAttribute("src")) v.src = video;
    return;
  }
  s.mode = "hls";
  const url = `${video}/ik-master.m3u8?tr=${LADDER}`;
  if (isSafari() && v.canPlayType("application/vnd.apple.mpegurl")) {
    v.src = url; // a failed manifest surfaces as the element's error event: call toMp4 from onError
    return;
  }
  const { default: Hls } = await import("hls.js");
  if (s.mode !== "hls") return; // fell back or unmounted while loading
  if (!Hls.isSupported()) return toMp4(v, video, s);
  const hls = new Hls({ capLevelToPlayerSize: true });
  s.hls = hls;
  hls.on(Hls.Events.ERROR, (_e, data) => {
    if (data.fatal) toMp4(v, video, s);
  });
  hls.loadSource(url);
  hls.attachMedia(v);
}

export async function start(v: HTMLVideoElement, video: string, s: Stream) {
  s.want = true;
  await attach(v, video, s);
  if (s.want) v.play().catch(() => {});
}

/** Stops the stream and resets the state, e.g. on unmount */
export function stop(s: Stream) {
  s.hls?.destroy();
  s.hls = undefined;
  s.mode = undefined; // also stops an attach still waiting on the hls.js import
  s.want = false;
}
