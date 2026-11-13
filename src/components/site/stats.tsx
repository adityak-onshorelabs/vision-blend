"use client";

/*
  The studio's headline figures ("*10,000+* content pieces created"): the starred part is the
  figure, the rest its label. Shared by the Industries overview headline and the strip under the
  client logos on Home. The figures live in industriesPage.stats (src/content/en.ts).

  Updated changes (13 Nov 2026): the old three-up row of brown numbers read as bland, above all on
  phones where it stacked into three tall, near-empty blocks, and the client asked for it to blend
  into the page with no boxed or square look. So there is no container at all:
  - the figures are set very large and filled with the copper key visual itself (.stat-figure in
    globals.css), straight on the page, over a soft copper glow that fades out on every side;
  - dividers are hairlines that fade out at both ends, so nothing meets a hard edge;
  - phones: one compact row per figure, figure and label side by side; md+: three columns;
  - each figure counts up once as it comes into view (Motion), then rests on the exact figure from
    the copy. Server render and reduced motion show the final figure, never a zero;
  - labels use the site's section-label style with the brand's full stop.
*/
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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
        className="pointer-events-none absolute inset-x-0 -inset-y-[35%] -z-10 bg-[radial-gradient(55%_60%_at_22%_50%,oklch(0.78_0.07_58/0.28),transparent_72%),radial-gradient(40%_55%_at_78%_55%,oklch(0.72_0.08_48/0.16),transparent_72%)] blur-2xl"
      />

      <Cells id={headingId} aria-label={headingId ? undefined : "Vision Blend in numbers"} className="grid grid-cols-[auto_minmax(0,1fr)] md:grid-cols-3">
        {items.map((s, i) => (
          <Cell
            key={s.figure}
            className={cn(
              // Phones: one row per figure, figure and label side by side. md+: three columns.
              "relative col-span-2 grid grid-cols-subgrid items-baseline gap-x-5 md:col-span-1 py-[clamp(18px,4vw,26px)] md:grid-cols-1 md:content-start md:gap-y-4 md:px-[clamp(20px,3vw,44px)] md:py-2 md:first:ps-0",
              // Dividers that fade out at both ends instead of meeting a box edge
              i > 0 &&
                "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,var(--rule)_15%,var(--rule)_85%,transparent)] md:before:inset-x-auto md:before:inset-y-0 md:before:start-0 md:before:h-auto md:before:w-px md:before:bg-[linear-gradient(180deg,transparent,var(--rule)_20%,var(--rule)_80%,transparent)]",
            )}
          >
            <span
              className="stat-figure font-[400] leading-[0.9] tracking-[-0.05em] text-[clamp(3rem,14vw,4.4rem)] md:text-[clamp(3.6rem,7.6vw,7.75rem)]"
              style={{ "--stat-x": ["18%", "52%", "86%"][i % 3] } as CSSProperties}
            >
              <Figure figure={s.figure} start={armed && inView} delay={i * 0.15} />
            </span>
            {s.label && <span className="t-label marker text-[0.74rem] leading-snug sm:text-[0.78rem]">{s.label}</span>}
            {headingId && i < items.length - 1 && <span className="sr-only">,</span>}
          </Cell>
        ))}
      </Cells>
    </div>
  );
}
