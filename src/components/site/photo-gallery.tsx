"use client";

/*
  Careers "Beyond the brief" (13 Nov 2026): the studio's behind-the-scenes photos of the team away
  from work. A masonry of columns, every photo at its own shape (no cropping), opening full size in
  a lightbox with previous/next and Escape. Sharp corners, no shadows, like the rest of the site.
*/
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Photo = { src: string; alt: string; w: number; h: number };

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3" aria-label="The team, behind the scenes">
        {photos.map((p, i) => (
          <li key={p.src} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden bg-[var(--well)]"
              style={{ aspectRatio: `${p.w} / ${p.h}` }}
              aria-label={`Open photo: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && open !== null && (
        <div role="dialog" aria-modal="true" aria-label={current.alt} className="fixed inset-0 z-[80] grid place-items-center bg-[oklch(0.12_0.006_40/0.94)] p-4 sm:p-10" onClick={close}>
          <div className="relative max-h-full w-full max-w-[1400px]" style={{ aspectRatio: `${current.w} / ${current.h}`, maxHeight: "calc(100svh - 120px)" }} onClick={(e) => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-6 text-[0.92rem] text-[var(--on-night)]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="u px-2 py-2" onClick={() => step(-1)} aria-label="Previous photo">
              &larr; Prev
            </button>
            <span className="tabular-nums text-[oklch(0.95_0.004_60/0.6)]">
              {String(open + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <button type="button" className="u px-2 py-2" onClick={() => step(1)} aria-label="Next photo">
              Next &rarr;
            </button>
          </div>
          <button type="button" onClick={close} className="absolute right-4 top-4 px-3 py-2 text-[0.92rem] text-[var(--on-night)] u" aria-label="Close">
            Close
          </button>
        </div>
      )}
    </>
  );
}
