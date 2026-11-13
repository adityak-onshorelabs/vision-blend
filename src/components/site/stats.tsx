"use client";

/*
  The studio's headline figures ("*10,000+* content pieces created"): the starred part is the
  figure, the rest its label. Shared by the Industries overview headline and the strip under the
  client logos on Home. The figures live in industriesPage.stats (src/content/en.ts).

  Updated changes (13 Nov 2026): the old three-up row of brown numbers read as bland, above all on
  phones where it stacked into three tall, near-empty blocks. Now one panel on the copper key
  visual under a dark veil, sharp-cornered like the rest of the site:
  - the first figure leads, large, across the panel on phones; the other two pair up beside it;
    from md all three sit in one row, ruled between;
  - each figure counts up once as the panel comes into view (Motion), then rests on the exact
    figure from the copy. Server render and reduced motion show the final figure, never a zero;
  - the brand's full stop marks each label, as it marks section labels elsewhere.
*/
import Image from "next/image";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** "*₹50 Cr+* revenue generated" -> figure "₹50 Cr+", label "revenue generated" */
function split(text: string) {
  const m = text.match(/^\*([^*]+)\*\s*(.*)$/);
  return m ? { figure: m[1], label: m[2] } : { figure: text, label: "" };
}

/** "₹50 Cr+" -> prefix "₹", 50, suffix " Cr+"; "10,000+" -> "", 10000, "+" */
function parts(figure: string) {
  const m = figure.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], value: Number(m[2].replace(/,/g, "")), suffix: m[3], grouped: m[2].includes(",") };
}

const fmt = (n: number, grouped: boolean) => (grouped ? Math.round(n).toLocaleString("en-IN") : String(Math.round(n)));

/** One figure, counting up the first time it is seen */
function Figure({ figure, start, delay }: { figure: string; start: boolean; delay: number }) {
  const p = parts(figure);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!p || reduce || !start) return;
    const controls = animate(0, p.value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(fmt(v, p.grouped)),
      onComplete: () => setShown(null),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduce]);

  if (!p) return <>{figure}</>;
  return (
    <>
      <span aria-hidden="true">
        {p.prefix}
        <span className="tabular-nums">{shown ?? fmt(p.value, p.grouped)}</span>
        {p.suffix}
      </span>
      <span className="sr-only">{figure}</span>
    </>
  );
}

type Props = {
  stats: string[];
  className?: string;
  /** Set on Industries, where the figures are the page's h1 */
  headingId?: string;
};

export function StatsPanel({ stats, className, headingId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  // Count only when the panel scrolls in from below; if it is already on screen at load, rest on the figures
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.85) setArmed(true);
  }, []);
  const items = stats.map(split);
  const Cells = headingId ? "h1" : "ul";
  const Cell = headingId ? "span" : "li";

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden bg-[var(--night)] text-[var(--on-night)]", className)}>
      <Image src="/images/hero-copper.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-90" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,oklch(0.17_0.006_40/0.82)_0%,oklch(0.17_0.006_40/0.5)_55%,oklch(0.17_0.006_40/0.22)_100%)]" />

      <Cells
        id={headingId}
        aria-label={headingId ? undefined : "Vision Blend in numbers"}
        className="grid grid-cols-2 md:grid-cols-3"
      >
        {items.map((s, i) => (
          <Cell
            key={s.figure}
            className={cn(
              "grid content-between gap-6 border-[oklch(0.95_0.004_60/0.16)] p-[clamp(20px,4vw,40px)]",
              i === 0 ? "col-span-2 border-b md:col-span-1 md:border-b-0" : "",
              i === 2 ? "border-s" : "",
              i > 0 ? "md:border-s" : "",
            )}
          >
            <span aria-hidden="true" className="text-[0.78rem] font-medium tracking-[0.14em] text-[oklch(0.95_0.004_60/0.55)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="grid gap-2">
              <span
                className={cn(
                  "font-[300] leading-[0.95] tracking-[-0.04em] text-[var(--on-night)]",
                  i === 0 ? "text-[clamp(3.2rem,13vw,5.5rem)] md:text-[clamp(2.8rem,5.4vw,5.5rem)]" : "text-[clamp(2.1rem,9vw,3.4rem)] md:text-[clamp(2.8rem,5.4vw,5.5rem)]",
                )}
              >
                <Figure figure={s.figure} start={armed && inView} delay={i * 0.15} />
              </span>
              {s.label && (
                <span className="flex items-center gap-2 text-[clamp(0.92rem,1.2vw,1.1rem)] text-[oklch(0.95_0.004_60/0.78)]">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[var(--brand-soft)]" />
                  {s.label}
                </span>
              )}
            </span>
            {headingId && i < items.length - 1 && <span className="sr-only">,</span>}
          </Cell>
        ))}
      </Cells>
    </div>
  );
}
