"use client";

/*
  An industry's portfolio: every file from the studio's Drive folder, filterable by category, each
  opening in a lightbox.
  - Everything comes from Drive or Instagram. Drive cards show Drive's own thumbnail of the file
    (through the Next image optimiser, so visitors get a resized WebP from the site's cache, not
    Drive); Instagram cards show the post's own embed, inert until opened. No loops and no hosted
    media: this page is a contact sheet, not the showcase on the industry page.
  - Layout: a masonry of the pieces in their own shapes (a reel stays 9:16, a slide 4:5, a scope
    film 2.35:1), title and category over the image.
  - Lightbox: a native modal <dialog>, so focus is held inside, Esc closes and the page behind is
    inert. Films play in Drive's player (/file/d/<id>/preview), loaded only while open; stills show
    the full image. Prev/next (and the arrow keys) move through the pieces in the current filter.
  - "Open in Drive" (or "on Instagram") is offered for when the player is blocked.
  - Hosted pieces (src/content/hosted-work.ts, keyed by Drive id) come from ImageKit instead: the card
    shows a frame of the film (or the image), and the lightbox plays the full film in our
    own player, streamed at up to 1080p and above (film-player.tsx). Nothing of them loads from
    Drive, so the studio's folder can stay private, and there is no "Open in Drive" link.
*/
import Image from "next/image";
import type { MouseEvent, ReactNode, Ref } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hostedOf } from "@/content/hosted-work";
import type { WorkItem } from "@/content/types";
import { cn } from "@/lib/utils";
import { FilmPlayer } from "./film-player";
import { embedKindOf, embedRatioOf, InstagramMedia } from "./instagram-media";

const pad = (n: number) => String(n).padStart(2, "0");
/** Instagram pieces take the embed's window; Drive pieces their own frame */
const frameOf = (w: WorkItem): [number, number] => (w.instagram ? embedRatioOf(w.instagram) : w.ratio);
const ratioOf = (w: WorkItem) => frameOf(w)[0] / frameOf(w)[1];
const keyOf = (w: WorkItem) => w.drive ?? w.instagram ?? w.title;
/** Drive's thumbnail of any file (frame of a film, the image itself for a still), at a given width */
const thumb = (id: string, width: number) => `https://lh3.googleusercontent.com/d/${id}=w${width}`;
const preview = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
const view = (id: string) => `https://drive.google.com/file/d/${id}/view`;
/** The card image: a set poster, else the hosted film's frame (or the hosted image), else Drive's thumbnail */
const imageOf = (w: WorkItem, width: number) => {
  const h = hostedOf(w.drive);
  return w.poster ?? (h ? (h.poster ?? h.src) : thumb(w.drive ?? "", width));
};

const ALL = "All";

/**
 * `films`: the home page's brand films, a plain two-column grid of horizontal films with no filters
 * (the portfolio default is the filterable masonry).
 */
export function WorkGallery({ items, variant = "portfolio" }: { items: WorkItem[]; variant?: "portfolio" | "films" }) {
  const films = variant === "films";
  // Categories in the order they first appear, with a count each
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of items) counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
    return [...counts];
  }, [items]);
  const [filter, setFilter] = useState(ALL);
  const shown = useMemo(() => (filter === ALL ? items : items.filter((w) => w.category === filter)), [items, filter]);

  const dialog = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const cards = useRef(new Map<string, HTMLButtonElement>());
  const last = useRef<string | null>(null);
  // Index into `shown` of the piece in the lightbox
  const [open, setOpen] = useState<number | null>(null);
  const isOpen = open !== null;
  const current = open !== null ? shown[open] : null;

  useEffect(() => {
    if (current) last.current = keyOf(current);
  }, [current]);

  /*
    Opens and closes the modal. While open the page behind does not scroll and focus starts on
    Close. On closing (Close, Esc or the backdrop), focus goes back to the card of the piece last
    shown, which prev/next may have moved on from: after the dialog's own focus restore, so it wins.
  */
  useEffect(() => {
    const d = dialog.current;
    if (!d || !isOpen) return;
    if (!d.open) d.showModal();
    closeBtn.current?.focus();
    const root = document.documentElement;
    const map = cards.current;
    const was = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = was;
      if (d.open) d.close();
      if (last.current) map.get(last.current)?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((by: number) => setOpen((o) => (o === null ? o : (o + by + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      go(e.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  // A click on the dimmed area around the piece closes it
  const onBackdrop = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const r = current ? ratioOf(current) : 16 / 9;

  return (
    <>
      {!films && (
        <>
          <div role="group" aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2 md:mb-10">
            {[[ALL, items.length] as const, ...categories].map(([name, count]) => (
              <button key={name} type="button" className="chip" aria-pressed={filter === name} onClick={() => setFilter(name)}>
                {name}
                <span className="tabular-nums opacity-60">{count}</span>
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            {shown.length} pieces shown
          </p>
        </>
      )}

      <ul className={films ? "grid gap-5 sm:grid-cols-2" : "columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4"}>
        {shown.map((w, j) => (
          <li key={keyOf(w)} className={films ? "grid" : "mb-5 break-inside-avoid"}>
            <button
              ref={(el) => {
                if (el) cards.current.set(keyOf(w), el);
                else cards.current.delete(keyOf(w));
              }}
              type="button"
              onClick={() => setOpen(j)}
              aria-haspopup="dialog"
              className="group relative block w-full overflow-hidden bg-[var(--night)] text-start text-white"
              // Brand films share one 16:9 frame, so the grid reads as one row of films
              style={{ aspectRatio: films ? "16 / 9" : `${frameOf(w)[0]} / ${frameOf(w)[1]}` }}
            >
              {w.instagram && !w.poster ? (
                <InstagramMedia url={w.instagram} kind={embedKindOf(w.instagram)} title={w.title} preview className="absolute inset-0 !aspect-auto h-full" />
              ) : (
                <Image
                  src={imageOf(w, 1600)}
                  alt=""
                  fill
                  // The first row is above the fold (it is the page's largest image)
                  loading={j < 4 ? "eager" : undefined}
                  sizes={films ? "(min-width: 1360px) 660px, (min-width: 640px) 48vw, 100vw" : "(min-width: 1360px) 310px, (min-width: 1280px) 23vw, (min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"}
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              )}
              {/* Stills carry their own headline in the artwork, so only films get the title over the image */}
              {w.kind === "film" && (
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.13_0.006_40/0.85),oklch(0.13_0.006_40/0)_55%)]" />
              )}

              <span className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                <span className="bg-[oklch(0.13_0.006_40/0.7)] px-2 py-1 text-[0.66rem] font-medium uppercase tracking-[0.14em]">
                  {w.category}
                </span>
                {w.kind === "film" ? (
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-white/70 bg-[oklch(0.13_0.006_40/0.5)] transition-transform duration-500 ease-[var(--ease)] group-hover:scale-110 motion-reduce:transition-none"
                  >
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                      <path d="M5 3.2 L13 8 L5 12.8 Z" />
                    </svg>
                  </span>
                ) : null}
              </span>

              <span className={w.kind === "film" ? "absolute inset-x-4 bottom-4 grid gap-1" : "sr-only"}>
                <span className="text-[clamp(1.05rem,0.95rem+0.4vw,1.3rem)] font-[360] leading-[1.15] tracking-[-0.015em]">{w.title}</span>
                {w.client && <span className="text-[0.82rem] text-white/70">{w.client}</span>}
              </span>
              <span className="sr-only">, {w.kind === "film" ? "play film" : "view image"}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={close}
        aria-label={current ? `${current.title}, ${current.category}` : undefined}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-[oklch(0.13_0.006_40/0.95)]"
      >
        {current && open !== null && (
          <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-4 py-4 md:px-8 md:py-6" onClick={onBackdrop}>
            <div className="flex items-center justify-between gap-4" onClick={onBackdrop}>
              <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/70">
                {pad(open + 1)} / {pad(shown.length)}
              </span>
              <div className="flex items-center gap-2">
                {shown.length > 1 && (
                  <>
                    <IconButton label="Previous piece" onClick={() => go(-1)}>
                      <path d="M10 3 L5 8 L10 13" />
                    </IconButton>
                    <IconButton label="Next piece" onClick={() => go(1)}>
                      <path d="M6 3 L11 8 L6 13" />
                    </IconButton>
                  </>
                )}
                <IconButton label="Close" onClick={close} ref={closeBtn}>
                  <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" />
                </IconButton>
              </div>
            </div>

            <div className="grid min-h-0 place-items-center" onClick={onBackdrop}>
              {/* Sized to the piece's own frame, as large as the space allows */}
              <div className="relative bg-black" style={{ aspectRatio: String(r), width: `min(100%, calc((100dvh - 10.5rem) * ${r}))` }}>
                {current.instagram ? (
                  <InstagramMedia key={current.instagram} url={current.instagram} kind={embedKindOf(current.instagram)} title={current.title} priority className="absolute inset-0 !aspect-auto h-full" />
                ) : current.kind === "film" && hostedOf(current.drive) ? (
                  <FilmPlayer key={current.drive} video={hostedOf(current.drive)!.src} poster={current.poster ?? hostedOf(current.drive)!.poster} title={current.title} />
                ) : current.kind === "film" && current.drive ? (
                  <>
                    <span className="absolute inset-0 grid place-items-center text-[0.8rem] text-white/60" aria-hidden="true">
                      Loading&hellip;
                    </span>
                    <iframe
                      key={current.drive}
                      src={preview(current.drive)}
                      title={current.title}
                      allow="autoplay; fullscreen; encrypted-media"
                      allowFullScreen
                      className="absolute inset-0 size-full border-0"
                    />
                  </>
                ) : (
                  <Image
                    key={current.drive}
                    src={hostedOf(current.drive)?.src ?? thumb(current.drive ?? "", 2000)}
                    alt={`${current.title}${current.client ? `, ${current.client}` : ""}`}
                    fill
                    sizes="(min-width: 768px) 70vh, 100vw"
                    className="object-contain"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3" onClick={onBackdrop}>
              <div className="grid gap-1">
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/60">
                  {current.category}
                  {current.client && <> &middot; {current.client}</>}
                </span>
                <span className="text-[clamp(1.15rem,1rem+0.6vw,1.6rem)] font-[340] tracking-[-0.02em]">{current.title}</span>
              </div>
              {(current.instagram || !hostedOf(current.drive)) && (
                <a
                  href={current.instagram ?? view(current.drive ?? "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta cta-sm cta-line border-white/60 text-white hover:border-white hover:bg-white hover:text-[var(--night)] focus-visible:outline-white"
                >
                  {current.instagram ? "Open on Instagram" : "Open in Drive"} <span className="arr" aria-hidden="true">&#8599;</span>
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function IconButton({ label, onClick, ref, children }: { label: string; onClick: () => void; ref?: Ref<HTMLButtonElement>; children: ReactNode }) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-10 place-items-center rounded-full border border-white/35 text-white transition-colors",
        "hover:border-white hover:bg-white hover:text-[var(--night)] focus-visible:outline-white",
      )}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
