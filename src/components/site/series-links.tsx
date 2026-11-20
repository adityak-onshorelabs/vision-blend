"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Episode } from "@/content/types";
import { cn } from "@/lib/utils";
import { SeriesScroller } from "./series-scroller";
import { IconButton } from "./work-gallery";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/*
  Reel cards whose cover is Instagram's own preview frame. Each card holds the reel's official
  embed (https://www.instagram.com/reel/<id>/embed/) cropped to the video area:
  the embed has a 54px header, a 4:5 media box as wide as the frame, and the 9:16 video centred
  at 70% of that width; the clean frame runs one embed-width down before Instagram's
  "View more" bar. So a 7:10 window, offset 15% in and 54px down, shows only the video poster.
  A 16:9 video post ("landscape") has a media box 0.5625 of the embed's width; the 7:10 window
  takes 0.545 of the width in height (a hair under 16:9, so slightly wider videos leave no white
  edge) and the centre 0.545 * 0.7 of its width.
  A "pillarbox" post is a vertical video in that same 16:9 box, filling its centre 70%.
  A wide row (16:9 windows) shows a landscape video whole: the iframe is 0.5625 / 0.545 of the
  window's width, so the video runs a hair past every edge and no white shows. A pillarbox video
  fills the window's width (iframe 1 / 0.7 wide) and is cropped top and bottom to its middle.
  The iframe is not interactive; the stretched title button opens the reel in a modal <dialog> on
  the site (Instagram's own player, cropped to the media, interactive), so visitors never leave
  the page. Esc, Close or the backdrop closes it; focus goes back to the card. A small "Open on
  Instagram" link stays in the modal for when the embed is blocked.
  The copper crop sits behind it while the embed loads or if Instagram is blocked.
*/
const HEADER = 54;

/** Iframe width and left offset, as a share of the 7:10 window */
const geometry = {
  reel: { width: 1 / 0.7, left: -0.15 / 0.7 },
  landscape: { width: 1 / (0.545 * 0.7), left: -(1 / (0.545 * 0.7) - 1) / 2 },
  pillarbox: { width: 1 / (0.545 * 0.7), left: -(1 / (0.545 * 0.7) - 1) / 2 },
};

/** In a 16:9 window: iframe width and left as a share of the window's width, top as a share of its height */
const WIDE = 0.5625 / 0.545;
const PILLAR = 1 / 0.7;
const wideGeometry = {
  reel: { width: PILLAR, left: -0.15 / 0.7, top: -((0.8 * PILLAR) / 0.5625 - 1) / 2 },
  landscape: { width: WIDE, left: -(WIDE - 1) / 2, top: -((WIDE - 1) / 2) },
  pillarbox: { width: PILLAR, left: -0.15 / 0.7, top: -((0.548 * PILLAR) / 0.5625 - 1) / 2 },
};

/** The iframe's place inside a card's window: a 16:9 window when `wide`, else 7:10 */
const frameStyle = (e: Episode, wide: boolean): CSSProperties => {
  const g = geometry[e.embed ?? "reel"];
  const w = wideGeometry[e.embed ?? "reel"];
  return wide
    ? { width: `${w.width * 100}%`, left: `${w.left * 100}%`, top: `calc(${-HEADER}px + ${w.top * 100}%)`, height: `calc(400% + ${HEADER}px)` }
    : { width: `${g.width * 100}%`, left: `${g.left * 100}%`, top: -HEADER, height: `calc(200% + ${HEADER}px)` };
};

/** Up to four episodes sit in a grid row; from five on they become a horizontal scroll. Newest first. */
const GRID_MAX = 4;

export function SeriesLinks({
  episodes,
  openLabel,
  className,
  center = false,
  wide = false,
}: {
  episodes: Episode[];
  openLabel: string;
  className?: string;
  /** A short row (fewer than four) sits in the middle, cards the same width as in a full row */
  center?: boolean;
  /** Landscape videos in 16:9 cards, three to a row */
  wide?: boolean;
}) {
  const sorted = [...episodes].sort((a, b) => b.ep - a.ep);

  const dialog = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const cardBtns = useRef(new Map<string, HTMLButtonElement>());
  const [open, setOpen] = useState<Episode | null>(null);
  const isOpen = open !== null;
  const openUrl = open?.url;

  // Open the modal, hold the page still, and hand focus back to the card on close
  useEffect(() => {
    const d = dialog.current;
    if (!d || !isOpen || !openUrl) return;
    if (!d.open) d.showModal();
    closeBtn.current?.focus();
    const root = document.documentElement;
    const was = root.style.overflow;
    root.style.overflow = "hidden";
    const btn = cardBtns.current.get(openUrl);
    return () => {
      root.style.overflow = was;
      if (d.open) d.close();
      btn?.focus({ preventScroll: true });
    };
  }, [isOpen, openUrl]);

  const close = useCallback(() => setOpen(null), []);
  const onBackdrop = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) close();
  };
  // Instagram's own embed.js turns the blockquote into its player and keeps it sized as it plays
  useEffect(() => {
    if (!isOpen || !openUrl) return;
    const process = () => window.instgrm?.Embeds.process();
    if (window.instgrm) {
      process();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>("script[data-instagram-embed]");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.dataset.instagramEmbed = "";
      document.body.appendChild(script);
    }
    script.addEventListener("load", process);
    return () => script?.removeEventListener("load", process);
  }, [isOpen, openUrl]);
  const scroll = sorted.length > GRID_MAX;
  const centred = center && !wide && !scroll && sorted.length < GRID_MAX;
  const cards = sorted.map((e) => {
    const frame = frameStyle(e, wide);
    return (
    <li
      key={e.url}
      className={cn(
        "group relative grid content-start gap-3",
        !wide && scroll && "w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-48px)/4.3)]",
        centred && "w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)]",
      )}
    >
      <div className={cn("relative overflow-hidden bg-[var(--well)]", wide ? "aspect-video" : "aspect-[7/10]")}>
        <span
          aria-hidden="true"
          className="crop crop-bw absolute inset-0"
          style={{ "--pos": e.crop.pos, "--sz": e.crop.sz } as CSSProperties}
        />
        <iframe
          src={`${e.url}embed/`}
          title={`Instagram preview: ${e.title}`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          scrolling="no"
          className="pointer-events-none absolute origin-center border-0 transition-transform duration-1000 ease-[var(--ease)] group-hover:scale-[1.03]"
          style={frame}
        />
        {e.ep > 0 && (
          <span className="absolute end-2.5 top-2.5 bg-black/70 px-2 py-1 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-white">
            Ep {e.ep}
          </span>
        )}
      </div>
      <div className="grid gap-0.5 text-[0.92rem]">
        {/* Stretched link: its ::before covers the whole card (the li is the positioned parent). */}
        <button
          ref={(el) => {
            if (el) cardBtns.current.set(e.url, el);
            else cardBtns.current.delete(e.url);
          }}
          type="button"
          onClick={() => setOpen(e)}
          aria-haspopup="dialog"
          className="cursor-pointer justify-self-start text-start no-underline before:absolute before:inset-0 before:z-10 before:content-['']"
        >
          <span className="u">{e.title}</span>
          <span className="sr-only">, {openLabel}</span>
        </button>
        <span className="text-[0.86rem] text-muted-foreground">{[e.date, e.by && `with ${e.by}`].filter(Boolean).join(", ")}</span>
      </div>
    </li>
    );
  });

  const list = wide ? (
    <ul className={cn("grid gap-4 md:grid-cols-3", className)}>{cards}</ul>
  ) : scroll ? (
    <SeriesScroller label="A Week at Vision Blend episodes">{cards}</SeriesScroller>
  ) : centred ? (
    <ul className={cn("flex flex-wrap justify-center gap-4", className)}>{cards}</ul>
  ) : (
    <ul className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>{cards}</ul>
  );

  return (
    <>
      {list}
      <dialog
        ref={dialog}
        onClose={close}
        aria-label={open?.title}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-[oklch(0.13_0.006_40/0.95)]"
      >
        {open && (
          <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-4 py-4 md:px-8 md:py-6" onClick={onBackdrop}>
            <div className="flex items-center justify-end gap-4" onClick={onBackdrop}>
              <IconButton label="Close" onClick={close} ref={closeBtn}>
                <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" />
              </IconButton>
            </div>

            <div className="grid min-h-0 place-items-center overflow-y-auto" onClick={onBackdrop}>
              {/*
                Instagram's whole embed, uncropped: its player re-lays itself out once playing, so a
                crop that suits the poster would cut the video.
              */}
              <div key={open.url} className="w-[min(100%,440px,max(326px,calc((100dvh-15rem)/1.25)))] [&_.instagram-media]:!m-0 [&_.instagram-media]:!min-w-0">
                <blockquote className="instagram-media" data-instgrm-permalink={open.url} data-instgrm-version="14" style={{ background: "#fff", border: 0, margin: 0, width: "100%" }}>
                  <a href={open.url} target="_blank" rel="noopener noreferrer" className="block p-6 text-center text-[0.9rem] text-black/60">
                    Loading&hellip;
                  </a>
                </blockquote>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3" onClick={onBackdrop}>
              <div className="grid gap-1">
                {(open.date || open.by) && (
                  <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/60">
                    {[open.date, open.by && `with ${open.by}`].filter(Boolean).join(" · ")}
                  </span>
                )}
                <span className="text-[clamp(1.15rem,1rem+0.6vw,1.6rem)] font-[340] tracking-[-0.02em]">{open.title}</span>
              </div>
              <a href={open.url} target="_blank" rel="noopener noreferrer" className="text-[0.82rem] text-white/60 underline-offset-4 hover:text-white hover:underline">
                Not playing? Open on Instagram <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
