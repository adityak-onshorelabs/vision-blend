"use client";

/*
  A testimonial film in its square frame. The poster (a frame saved on the site) shows first; Drive's
  player (/file/d/<id>/preview) loads only once the visitor presses play, so the page doesn't pull
  in two heavy players on arrival. The films play on the page, never in a new tab.
  The studio's Drive folder must stay shared "anyone with the link", or the films stop playing.
*/
import Image from "next/image";
import { useState } from "react";

export function TestimonialFilm({ drive, poster, title, duration, priority = false }: { drive: string; poster: string; title: string; duration: string; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[var(--night)] text-white">
      {playing ? (
        <>
          <span className="absolute inset-0 grid place-items-center text-[0.8rem] text-white/60" aria-hidden="true">
            Loading&hellip;
          </span>
          <iframe
            src={`https://drive.google.com/file/d/${drive}/preview`}
            title={title}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </>
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block size-full cursor-pointer text-start">
          <Image
            src={poster}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-1000 ease-[var(--ease)] group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.13_0.006_40/0.55),transparent_45%)]" />
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full border border-white/70 bg-[oklch(0.13_0.006_40/0.5)] backdrop-blur-sm transition-transform duration-500 ease-[var(--ease)] group-hover:scale-110 motion-reduce:transition-none sm:size-20">
              <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" className="translate-x-px">
                <path d="M5 3.2 L13 8 L5 12.8 Z" />
              </svg>
            </span>
          </span>
          <span aria-hidden="true" className="absolute bottom-4 start-4 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/80 tabular-nums sm:bottom-6 sm:start-6">
            Play &middot; {duration}
          </span>
          <span className="sr-only">Play film: {title}, {duration}</span>
        </button>
      )}
    </div>
  );
}
