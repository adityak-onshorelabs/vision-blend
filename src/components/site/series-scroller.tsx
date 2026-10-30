"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal row for the series once it outgrows a single grid row: native scroll with snap,
 * hidden scrollbar, and previous/next buttons that move one card and dim at either end.
 */
export function SeriesScroller({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className="grid gap-5">
      <ul
        ref={ref}
        aria-label={label}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      <div className="flex justify-end gap-2">
        {([-1, 1] as const).map((dir) => {
          const disabled = dir === -1 ? edge.start : edge.end;
          return (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir)}
              disabled={disabled}
              aria-label={dir === -1 ? "Previous episodes" : "Next episodes"}
              className={cn("cta cta-line cta-sm min-w-11 justify-center !gap-0 before:hidden", disabled && "opacity-30")}
            >
              {dir === -1 ? "←" : "→"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
