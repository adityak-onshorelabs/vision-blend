"use client";

import { useState } from "react";
import type { Project } from "@/content/types";
import { InstagramMedia } from "./instagram-media";
import { ProjectArt } from "./project-art";
import { cn } from "@/lib/utils";

type Props = {
  projects: Project[];
  labels: { viewOnInstagram: string; realProject: string; slot: string; placeholder: string };
};

/**
 * Numbered project list. Hover or focus a row to update the sticky preview beside it.
 * The preview shows the project's own Instagram media (film, post or reel); each embed mounts
 * the first time its row is shown and then stays, so switching back is instant. Case-study
 * slots without a post keep their line drawing.
 */
export function WorkIndex({ projects, labels }: Props) {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const active = projects[current];
  const show = (i: number) => {
    setCurrent(i);
    setMounted((m) => (m.has(i) ? m : new Set(m).add(i)));
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-12">
      <ol className="border-t border-border lg:col-span-7">
        {projects.map((p, i) => {
          const isActive = i === current;
          const inner = (
            <>
              <span className={cn("text-[0.78rem] font-medium transition-colors max-lg:row-span-2 max-lg:self-start max-lg:pt-1.5", isActive ? "text-brand" : "text-[var(--faint)]")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={cn("min-w-0 transition-transform duration-500 ease-[var(--ease)]", isActive && "lg:translate-x-2.5")}>
                <span className="t-h3 block font-[350] max-lg:text-[1.2rem]">
                  {p.name}
                  {p.real ? (
                    <span className="ms-2.5 inline-block size-1.5 -translate-y-1 rounded-full bg-brand" title={labels.realProject} />
                  ) : (
                    <span className="tbc">{labels.slot}</span>
                  )}
                </span>
                <span className="mt-1 block text-[0.92rem] text-muted-foreground">{p.sub}</span>
              </span>
              <span className="inline-flex items-center gap-2 whitespace-nowrap text-[0.9rem] text-muted-foreground max-lg:col-start-2">
                {p.category}
                {p.instagram && (
                  <span aria-hidden="true" className={cn("transition-all duration-300", isActive ? "opacity-100" : "translate-x-[-4px] translate-y-1 opacity-0")}>
                    ↗
                  </span>
                )}
              </span>
            </>
          );
          const rowClass = cn(
            "work-row relative grid w-full items-baseline gap-x-4 gap-y-1 border-b border-border py-[22px] text-start",
            "grid-cols-[32px_minmax(0,1fr)] max-lg:py-4 lg:grid-cols-[44px_minmax(0,1fr)_auto]",
            "after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-full after:origin-left after:bg-ink after:transition-transform after:duration-500",
            isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
          );
          const events = { onMouseEnter: () => show(i), onFocus: () => show(i) };
          return (
            <li key={p.slug}>
              {p.instagram ? (
                <a href={p.instagram.url} target="_blank" rel="noopener noreferrer" className={rowClass} aria-current={isActive || undefined} {...events}>
                  {inner}
                  <span className="sr-only">, {labels.viewOnInstagram}</span>
                </a>
              ) : (
                <div className={rowClass} tabIndex={0} {...events}>
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <aside aria-live="polite" className="sticky top-24 hidden gap-3.5 lg:col-span-4 lg:col-start-9 lg:grid">
        <div className="relative aspect-[4/5] overflow-hidden bg-night">
          {projects.map((p, i) => {
            const on = i === current;
            return (
              <div
                key={p.slug}
                aria-hidden={!on}
                className={cn(
                  "absolute inset-0 grid place-items-center transition-opacity duration-500 ease-[var(--ease)]",
                  on ? "opacity-100" : "pointer-events-none opacity-0",
                  !p.instagram && "bg-tint text-ink",
                )}
              >
                {p.instagram && p.embed ? (
                  mounted.has(i) && <InstagramMedia url={p.instagram.url} kind={p.embed} title={p.name} />
                ) : (
                  <ProjectArt key={on ? `${p.slug}-on` : p.slug} slug={p.slug} className="w-[82%]" label={`${labels.placeholder}: ${p.name}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between gap-3 text-[0.9rem]">
          <span>{active.name}</span>
          <span className="text-muted-foreground">{active.date}</span>
        </div>
        <p className="text-[0.95rem] text-muted-foreground">{active.summary}</p>
        {active.instagram && (
          <a className="u justify-self-start text-[0.92rem]" href={active.instagram.url} target="_blank" rel="noopener noreferrer">
            {labels.viewOnInstagram} ↗
          </a>
        )}
      </aside>
    </div>
  );
}
