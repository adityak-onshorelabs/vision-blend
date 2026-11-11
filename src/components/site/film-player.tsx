"use client";

/*
  A full film in the portfolio lightbox, with the browser's own controls and sound.
  Plays the uploaded file as is (src/lib/stream.ts), so the quality is the encode's, not a CDN
  re-compression. Starts as soon as it mounts: the lightbox only opens on a click, which lets the
  browser play with sound. If autoplay is still refused, the poster and the play control stay.
*/
import { useState } from "react";
import { sourceOf } from "@/lib/stream";

export function FilmPlayer({ video, poster, title }: { video: string; poster?: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="absolute inset-0 grid place-items-center px-6 text-center text-[0.9rem] text-white/70">
        This film could not be played. Please try again later.
      </span>
    );
  }

  return (
    <video
      src={sourceOf(video)}
      poster={poster}
      controls
      autoPlay
      playsInline
      preload="auto"
      aria-label={title}
      onError={() => setFailed(true)}
      className="absolute inset-0 size-full bg-black object-contain"
    />
  );
}
