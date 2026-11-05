import Link from "next/link";
import type { Industry } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * One column per industry with the services offered to it. Hover draws a brown rule across the top.
 * On large screens each card is a subgrid over three shared rows (name, list, link), so the lists
 * and the "More on this" links line up across cards whatever the text length.
 */
export function IndustryCards({ industries, lang, linkLabel }: { industries: Industry[]; lang: string; linkLabel?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-3.5", industries.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5")}>
      {industries.map((s, n) => (
        <article
          key={s.slug}
          className="group relative grid min-w-0 content-start gap-3.5 surface pb-8 pt-7 lg:row-span-3 lg:grid-rows-subgrid lg:content-stretch before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-[600ms] before:ease-[var(--ease)] hover:before:scale-x-100 focus-within:before:scale-x-100"
        >
          <div className="grid content-start gap-1.5">
            <span className="text-[0.78rem] font-medium text-[var(--faint)] transition-colors group-hover:text-brand">{String(n + 1).padStart(2, "0")}</span>
            <h3 className="t-h3">{s.name}</h3>
            {s.note && <p className="text-[0.9rem] text-muted-foreground">{s.note}</p>}
          </div>
          <ul className="mt-2 grid content-start gap-1.5 text-[0.98rem]">
            {s.services.map((d, i) => (
              <li
                key={d}
                className="flex gap-3 transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-1 before:text-[var(--faint)] before:content-['\2013']"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {d}
              </li>
            ))}
          </ul>
          {linkLabel && (
            <Link href={`/${lang}/industries/${s.slug}`} className="u mt-4 self-end justify-self-start text-[0.92rem]">
              {linkLabel} <span className="sr-only">{s.name}</span>
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
