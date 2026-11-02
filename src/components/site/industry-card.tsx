import Link from "next/link";
import { IndustryArt } from "@/components/site/industry-art";
import type { Industry } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * A preview of one industry page: the drawing in a panel, the page's address under it, the name,
 * the one-line summary and a round "open" button. The whole card is the link. Hover draws the brown
 * top rule, tints the border, fills the button and plays the drawing's own motion.
 */
export function IndustryCard({
  industry: s,
  lang,
  index,
  total,
  size = "md",
  className,
}: {
  industry: Industry;
  lang: string;
  index: number;
  total: number;
  size?: "lg" | "md" | "sm";
  className?: string;
}) {
  const href = `/${lang}/industries/${s.slug}`;
  const count = s.detail?.offerings.length ?? s.services.length;

  return (
    <Link href={href} className={cn("ind-card group", className)} aria-label={`${s.name}: open the industry page`}>
      {/* Phones keep a ratio; from md the drawing area follows the screen height so a short laptop screen still shows the whole card */}
      <div
        className={cn(
          "ind-card-art",
          size === "lg"
            ? "aspect-[16/10] md:aspect-auto md:h-[clamp(200px,30svh,340px)]"
            : size === "md"
              ? "aspect-[4/3] md:aspect-auto md:h-[clamp(180px,26svh,300px)]"
              : "aspect-[16/10] md:aspect-auto md:h-[clamp(140px,20svh,200px)]",
        )}
      >
        <span className="absolute start-4 top-4 text-[0.74rem] font-medium tracking-[0.12em] tabular-nums text-[var(--faint)]">
          <b className="font-medium text-brand">{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
        </span>
        <IndustryArt slug={s.slug} className={cn("h-auto max-h-[72%] text-ink", size === "sm" ? "w-[62%]" : "w-[70%] max-w-[420px]")} />
        <span className="ind-card-path" aria-hidden="true">
          /industries/<b>{s.slug}</b>
        </span>
      </div>

      <div className={cn("grid content-between gap-5", size === "sm" ? "p-5" : "p-5 md:p-6")}>
        <div className="grid gap-2">
          <h3 className={size === "lg" ? "t-h2" : "t-h3"}>
            {s.name}
            <span className="stop">.</span>
          </h3>
          {size !== "sm" && (s.summary ?? s.note) && <p className="max-w-[44ch] text-muted-foreground">{s.summary ?? s.note}</p>}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <span className="text-[0.78rem] font-medium tracking-[0.12em] text-[var(--faint)] uppercase">
            {count} {count === 1 ? "service" : "services"}
          </span>
          <span className="flex items-center gap-3 text-[0.92rem]">
            <span className="hidden sm:inline">View page</span>
            <span className="ind-card-go" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12 L12 4 M6 4 H12 V10" />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
