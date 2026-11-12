"use client";

/*
  The media slot on an industry content-category card: one showcase video, muted on loop.
  - The video only loads and plays while the card is on screen, so ten cards on one page do not
    all download at once. It pauses when scrolled away.
  - Reduced motion: no autoplay. The poster stays, and a play button starts the film.
  - No video yet (or the file fails): the poster still shows, tagged as a placeholder when it is
    a stock stand-in, with a play mark so the slot still reads as "film".
  - The slot takes the film's own frame (`ratio`): a reel stays 9:16, a carousel 4:5, a
    scope film 2.35:1. Nothing is cropped, letterboxed or padded with a blurred fill.
  - Instagram (`instagram`): Instagram's own player fills the slot instead, cropped to the media.
  - Nothing at all yet: a marked staging placeholder, so a missing asset is never mistaken for work.
  - Served from ImageKit (NEXT_PUBLIC_MEDIA_URL): the clip plays as the uploaded file, not
    ImageKit's re-compression (src/lib/stream.ts).
  - A film prepared from Drive (`clip`, from the film pipeline on R2) wins over `video`. It comes in
    up to three sizes; the first time it plays, the slot's width on screen picks the smallest file
    that still fills it sharply, so a phone never downloads the 4K file.
*/
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Clip, Photo } from "@/content/types";
import { sourceOf } from "@/lib/stream";
import { cn } from "@/lib/utils";
import { embedKindOf, InstagramMedia } from "./instagram-media";

type Props = { video?: string; clip?: Clip; instagram?: string; title?: string; poster?: Photo; ratio?: [number, number]; sizes: string; className?: string };

/** Pixel density above 2 adds file size without visible gain on a muted loop */
const MAX_DPR = 2;

/** The smallest rendition whose short side covers the slot on this screen (within 10%), else the largest */
function clipSource(clip: Clip, slot: HTMLElement) {
  const px = slot.clientWidth * Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const short = clip.width >= clip.height ? (px * clip.height) / clip.width : px;
  const size = clip.sizes.find((s) => s >= short * 0.9) ?? clip.sizes[clip.sizes.length - 1];
  return `${clip.base}/${size}.mp4`;
}

export function ShowcaseMedia(props: Props) {
  const { instagram, title, className } = props;
  if (instagram && !props.video && !props.clip) {
    return <InstagramMedia url={instagram} kind={embedKindOf(instagram)} title={title ?? "Instagram post"} className={className} />;
  }
  return <LoopMedia {...props} />;
}

function LoopMedia({ video, clip, poster, ratio = [16, 9], sizes, className }: Props) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const hasVideo = (!!clip || !!video) && !failed;

  /** A prepared clip gets its source on first play, sized to the slot as it is then */
  const play = (v: HTMLVideoElement) => {
    if (clip && !v.getAttribute("src") && box.current) v.src = clipSource(clip, box.current);
    v.play().catch(() => {});
  };

  useEffect(() => {
    const el = box.current;
    const v = ref.current;
    if (!el || !v || !hasVideo || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) play(v);
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
    // play reads only clip and the box ref; clip and video also re-key the <video> element
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo, reduce, clip, video]);

  return (
    <div
      ref={box}
      className={cn("relative w-full overflow-hidden bg-[var(--night)]", className)}
      style={{ aspectRatio: `${ratio[0]} / ${ratio[1]}` }}
    >
      {/* No asset yet: the copper texture holds the slot */}
      {!poster && !hasVideo && <span aria-hidden="true" className="crop crop-bw absolute inset-0 opacity-50" style={{ backgroundSize: "260%" }} />}
      {poster && (
        <Image
          src={poster.src}
          alt={hasVideo ? "" : poster.alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-[transform,opacity] duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            playing && "opacity-0",
          )}
        />
      )}
      {hasVideo && (
        <video
          key={clip?.base ?? video}
          ref={ref}
          src={clip ? undefined : sourceOf(video!)}
          muted
          loop
          playsInline
          preload="none"
          aria-label={poster?.alt}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* Play mark: a real button when the film can be started by hand, decoration otherwise */}
      {hasVideo && reduce && !playing ? (
        <button
          type="button"
          onClick={() => ref.current && play(ref.current)}
          className="absolute inset-0 grid place-items-center"
          aria-label="Play the film"
        >
          <PlayMark />
        </button>
      ) : (
        !playing &&
        (poster || hasVideo) && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
            <PlayMark />
          </span>
        )
      )}

      {(poster?.placeholder || !poster) && !hasVideo && (
        <span className="absolute end-3 top-3 bg-[oklch(0.17_0.006_40/0.6)] px-2 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--on-night)] backdrop-blur-sm">
          {poster ? "Placeholder · video to come" : "Placeholder · media to come"}
        </span>
      )}
    </div>
  );
}

function PlayMark() {
  return (
    <span className="grid size-14 place-items-center rounded-full border border-white/70 bg-[oklch(0.17_0.006_40/0.35)] text-white backdrop-blur-sm transition-transform duration-500 ease-[var(--ease)] group-hover:scale-110 motion-reduce:transition-none">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M5 3.2 L13 8 L5 12.8 Z" />
      </svg>
    </span>
  );
}
