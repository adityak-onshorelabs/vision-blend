"use client";

/*
  A full film in the portfolio lightbox, with the browser's own controls and sound.
  Streams from ImageKit as adaptive HLS (src/lib/stream.ts), so playback starts at a size that suits
  the screen and connection and climbs to 1080p and above. Starts as soon as it mounts: the lightbox
  only opens on a click, which lets the browser play with sound. If autoplay is still refused, the
  poster and the play control stay.
*/
import { useEffect, useRef, useState } from "react";
import { start, stop, toMp4, type Stream } from "@/lib/stream";

export function FilmPlayer({ video, poster, title }: { video: string; poster?: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const stream = useRef<Stream>({ want: false });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    const s: Stream = { want: false };
    stream.current = s;
    if (v) start(v, video, s);
    return () => {
      stop(s);
      v?.pause();
    };
  }, [video]);

  const onError = () => {
    const v = ref.current;
    if (v && stream.current.mode === "hls") toMp4(v, video, stream.current);
    else setFailed(true);
  };

  if (failed) {
    return (
      <span className="absolute inset-0 grid place-items-center px-6 text-center text-[0.9rem] text-white/70">
        This film could not be played. Please try again later.
      </span>
    );
  }

  return (
    <video
      ref={ref}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      aria-label={title}
      onError={onError}
      className="absolute inset-0 size-full bg-black object-contain"
    />
  );
}
