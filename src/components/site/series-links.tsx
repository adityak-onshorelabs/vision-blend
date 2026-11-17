import type { CSSProperties } from "react";
import type { Episode } from "@/content/types";
import { cn } from "@/lib/utils";
import { SeriesScroller } from "./series-scroller";

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
  The iframe is not interactive; the stretched title link opens the reel on Instagram.
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
  const scroll = sorted.length > GRID_MAX;
  const centred = center && !wide && !scroll && sorted.length < GRID_MAX;
  const cards = sorted.map((e) => {
    const g = geometry[e.embed ?? "reel"];
    const w = wideGeometry[e.embed ?? "reel"];
    const frame: CSSProperties = wide
      ? { width: `${w.width * 100}%`, left: `${w.left * 100}%`, top: `calc(${-HEADER}px + ${w.top * 100}%)`, height: `calc(400% + ${HEADER}px)` }
      : { width: `${g.width * 100}%`, left: `${g.left * 100}%`, top: -HEADER, height: `calc(200% + ${HEADER}px)` };
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
        <a
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          className="justify-self-start no-underline before:absolute before:inset-0 before:z-10 before:content-['']"
        >
          <span className="u">{e.title}</span>
          <span className="sr-only">, {openLabel}</span>
        </a>
        <span className="text-[0.86rem] text-muted-foreground">{[e.date, e.by && `with ${e.by}`].filter(Boolean).join(", ")}</span>
      </div>
    </li>
    );
  });

  if (wide) return <ul className={cn("grid gap-4 md:grid-cols-3", className)}>{cards}</ul>;
  if (scroll) return <SeriesScroller label="A Week at Vision Blend episodes">{cards}</SeriesScroller>;
  if (centred) return <ul className={cn("flex flex-wrap justify-center gap-4", className)}>{cards}</ul>;
  return <ul className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>{cards}</ul>;
}
