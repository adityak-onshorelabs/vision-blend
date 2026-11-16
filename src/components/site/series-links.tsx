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
  The iframe is not interactive; the stretched title link opens the reel on Instagram.
  The copper crop sits behind it while the embed loads or if Instagram is blocked.
*/
const HEADER = 54;

/** Iframe width and left offset, as a share of the 7:10 window */
const geometry = {
  reel: { width: 1 / 0.7, left: -0.15 / 0.7 },
  landscape: { width: 1 / (0.545 * 0.7), left: -(1 / (0.545 * 0.7) - 1) / 2 },
};

/** Up to four episodes sit in a grid row; from five on they become a horizontal scroll. Newest first. */
const GRID_MAX = 4;

export function SeriesLinks({
  episodes,
  openLabel,
  className,
  center = false,
}: {
  episodes: Episode[];
  openLabel: string;
  className?: string;
  /** A short row (fewer than four) sits in the middle, cards the same width as in a full row */
  center?: boolean;
}) {
  const sorted = [...episodes].sort((a, b) => b.ep - a.ep);
  const scroll = sorted.length > GRID_MAX;
  const centred = center && !scroll && sorted.length < GRID_MAX;
  const cards = sorted.map((e) => {
    const g = geometry[e.embed ?? "reel"];
    return (
    <li
      key={e.url}
      className={cn(
        "group relative grid content-start gap-3",
        scroll && "w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-48px)/4.3)]",
        centred && "w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)]",
      )}
    >
      <div className="relative aspect-[7/10] overflow-hidden bg-[var(--well)]">
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
          style={{ width: `${g.width * 100}%`, left: `${g.left * 100}%`, top: -HEADER, height: `calc(200% + ${HEADER}px)` }}
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

  if (scroll) return <SeriesScroller label="A Week at Vision Blend episodes">{cards}</SeriesScroller>;
  if (centred) return <ul className={cn("flex flex-wrap justify-center gap-4", className)}>{cards}</ul>;
  return <ul className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>{cards}</ul>;
}
