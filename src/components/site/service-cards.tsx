import Link from "next/link";
import type { Service } from "@/content/types";
import { ServiceIllustration } from "./service-illustration";

/**
 * Three practice columns. Hover draws a brown rule across the top and animates the drawing.
 * On large screens each card is a subgrid over five shared rows (drawing, title, line, list, link),
 * so titles, lists and the "More on this" links line up across cards whatever the text length.
 */
export function ServiceCards({ services, lang, linkLabel }: { services: Service[]; lang: string; linkLabel?: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-3.5">
      {services.map((s) => (
        <article
          key={s.slug}
          className="group relative grid min-w-0 content-start gap-3.5 bg-paper px-7 pb-8 pt-7 lg:row-span-5 lg:grid-rows-subgrid lg:content-stretch before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-[600ms] before:ease-[var(--ease)] hover:before:scale-x-100 focus-within:before:scale-x-100"
        >
          <ServiceIllustration slug={s.slug} className="mb-3 aspect-[3/2] h-auto w-full bg-tint text-ink" />
          <h3 className="t-h3">{s.name}</h3>
          <p className="max-w-[34ch] text-muted-foreground">{s.line}</p>
          <ul className="mt-2 grid gap-1.5 text-[0.98rem]">
            {s.deliverables.map((d, i) => (
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
            <Link href={`/${lang}/services#${s.slug}`} className="u mt-4 self-end justify-self-start text-[0.92rem]">
              {linkLabel} <span className="sr-only">{s.name}</span>
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
