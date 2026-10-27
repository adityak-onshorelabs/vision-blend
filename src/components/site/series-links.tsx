import type { CSSProperties } from "react";
import type { Episode } from "@/content/types";
import { cn } from "@/lib/utils";

/*
  Reel cards whose cover is Instagram's own preview frame. Each card holds the reel's official
  embed (https://www.instagram.com/reel/<id>/embed/) cropped to the video area:
  the embed has a 54px header, a 4:5 media box as wide as the frame, and the 9:16 video centred
  at 70% of that width; the clean frame runs one embed-width down before Instagram's
  "View more" bar. So a 7:10 window, offset 15% in and 54px down, shows only the video poster.
  The iframe is not interactive; the stretched title link opens the reel on Instagram.
  The copper crop sits behind it while the embed loads or if Instagram is blocked.
*/
const HEADER = 54;

export function SeriesLinks({ episodes, openLabel, className }: { episodes: Episode[]; openLabel: string; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {episodes.map((e) => (
        <li key={e.url} className="group relative grid content-start gap-3">
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
              style={{ width: `${100 / 0.7}%`, left: `${-(0.15 / 0.7) * 100}%`, top: -HEADER, height: `calc(200% + ${HEADER}px)` }}
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
      ))}
    </ul>
  );
}
