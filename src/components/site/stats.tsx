"use client";

/*
  The studio's headline figures ("*10,000+* content pieces created"): the starred part is the
  figure, the rest its label. Shared by the Industries overview headline and the strip under the
  client logos on Home. The figures live in industriesPage.stats (src/content/en.ts).

  Updated changes (13 Nov 2026): the old three-up row of brown numbers read as bland, above all on
  phones where it stacked into three tall, near-empty blocks. Client feedback the same day: no
  boxed panel, it has to blend into the page. So the figures sit on the page's own background
  with a soft copper glow that fades out on every side, between hairline rules:
  - the first figure leads, large, across the panel on phones; the other two pair up beside it;
    from md all three sit in one row, ruled between;
  - each figure counts up once as the panel comes into view (Motion), then rests on the exact
    figure from the copy. Server render and reduced motion show the final figure, never a zero;
  - the brand's full stop marks each label, as it marks section labels elsewhere.
*/
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
    <div ref={ref} className={cn("relative isolate", className)}>
      {/* A soft copper glow behind the figures, fading into the page on every side: no edge to see */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-[30%] -z-10 bg-[radial-gradient(60%_55%_at_30%_50%,oklch(0.74_0.07_55/0.22),transparent_70%),radial-gradient(45%_50%_at_80%_60%,oklch(0.7_0.08_45/0.14),transparent_70%)] blur-2xl"
      />

      <Cells
        id={headingId}
        aria-label={headingId ? undefined : "Vision Blend in numbers"}
        className="grid grid-cols-2 border-y border-border md:grid-cols-3"
      >
        {items.map((s, i) => (
          <Cell
            key={s.figure}
            className={cn(
              "grid content-between gap-6 border-border py-[clamp(24px,4vw,44px)]",
              i === 0 ? "col-span-2 border-b md:col-span-1 md:border-b-0 md:pe-6" : "",
              i === 1 ? "pe-4 md:ps-6 md:pe-6" : "",
              i === 2 ? "border-s ps-4 md:ps-6" : "",
              i > 0 ? "md:border-s" : "",
            )}
          >
            <span aria-hidden="true" className="text-[0.78rem] font-medium tracking-[0.14em] text-[var(--faint)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="grid gap-2">
              <span
                className={cn(
                  "font-[300] leading-[0.95] tracking-[-0.04em] text-brand",
                  i === 0 ? "text-[clamp(3.2rem,13vw,5.5rem)] md:text-[clamp(2.8rem,5.4vw,5.5rem)]" : "text-[clamp(2.1rem,9vw,3.4rem)] md:text-[clamp(2.8rem,5.4vw,5.5rem)]",
                )}
              >
                <Figure figure={s.figure} start={armed && inView} delay={i * 0.15} />
              </span>
              {s.label && (
                <span className="flex items-center gap-2 text-[clamp(0.92rem,1.2vw,1.1rem)] text-ink">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
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
