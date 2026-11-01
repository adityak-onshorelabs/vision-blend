"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky list of the industries beside the Services page (large screens). The industry in the
 * middle band of the viewport is marked current: brown number, ink name and the dot.
 */
export function IndustryRail({ items, label }: { items: { slug: string; name: string }[]; label: string }) {
  const [current, setCurrent] = useState(items[0]?.slug);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.slug)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="sticky top-28 grid gap-5">
      <span className="t-label marker">{label}</span>
      <ol className="grid border-t border-border">
        {items.map((item, i) => {
          const active = item.slug === current;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                aria-current={active ? "true" : undefined}
                className="group grid min-h-11 grid-cols-[32px_minmax(0,1fr)] items-center border-b border-border py-2.5"
              >
                <span className={cn("text-[0.78rem] font-medium tabular-nums transition-colors", active ? "text-brand" : "text-[var(--faint)] group-hover:text-ink")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-2.5 transition-[color,transform] duration-500 ease-[var(--ease)]",
                    active ? "translate-x-1.5 text-ink" : "text-muted-foreground group-hover:text-ink",
                  )}
                >
                  {item.name}
                  <span className={cn("size-1.5 rounded-full bg-brand transition-opacity duration-300", active ? "opacity-100" : "opacity-0")} />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
