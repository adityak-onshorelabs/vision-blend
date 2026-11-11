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
  - Served from ImageKit (NEXT_PUBLIC_MEDIA_URL): the clip streams as adaptive HLS (src/lib/stream.ts),
    attached only on first play so lazy loading holds.
*/
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/types";
import { start, stop, streams, toMp4, type Stream } from "@/lib/stream";
import { cn } from "@/lib/utils";
import { embedKindOf, InstagramMedia } from "./instagram-media";

type Props = { video?: string; instagram?: string; title?: string; poster?: Photo; ratio?: [number, number]; sizes: string; className?: string };

export function ShowcaseMedia(props: Props) {
  const { instagram, title, className } = props;
  if (instagram && !props.video) {
    return <InstagramMedia url={instagram} kind={embedKindOf(instagram)} title={title ?? "Instagram post"} className={className} />;
  }
  return <LoopMedia {...props} />;
}

function LoopMedia({ video, poster, ratio = [16, 9], sizes, className }: Props) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stream = useRef<Stream>({ want: false });
  const hasVideo = !!video && !failed;

  // Tear down hls.js when the clip changes or the card unmounts
  useEffect(() => {
    const s = stream.current;
    return () => {
      stop(s);
      stream.current = { want: false };
    };
  }, [video]);

  useEffect(() => {
    const el = box.current;
    const v = ref.current;
    if (!el || !v || !video || !hasVideo || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start(v, video, stream.current);
        else {
          stream.current.want = false;
          v.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video, hasVideo, reduce]);

  const onError = () => {
    const v = ref.current;
    if (v && video && stream.current.mode === "hls") toMp4(v, video, stream.current);
    else setFailed(true);
  };

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
          ref={ref}
          src={streams(video!) ? undefined : video}
          muted
          loop
          playsInline
          preload="none"
          aria-label={poster?.alt}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={onError}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* Play mark: a real button when the film can be started by hand, decoration otherwise */}
      {hasVideo && reduce && !playing ? (
        <button
          type="button"
          onClick={() => ref.current && video && start(ref.current, video, stream.current)}
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
