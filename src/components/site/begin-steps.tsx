"use client";

/*
  Partner with us, "How it begins" (final changes, 12 Nov 2026): the three stages connect in turn.
  When the section scrolls into view a brown line runs along the rule (across on wide screens, down
  on phones), each stage's node lights as the line reaches it, its line drawing draws in and its
  title rises. Once connected, a small dot travels the line every few seconds; nothing else loops.
  Restrained on purpose: the text is never moving while it can be read.
  - Before hydration (or without JS) everything is shown; only after hydration is it held back
    until the section is on screen (data-armed), so nothing is ever stuck hidden.
  - Reduced motion: shown complete, no travelling dot (the global reduced-motion rule).
  Styles in globals.css under "Partner steps".
*/
import { useInView } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const P = { pathLength: 1 } as const;
const noSubscribe = () => () => {};
const pad = (n: number) => String(n).padStart(2, "0");

const drawings: ReactNode[] = [
  // Introduce yourself: a card with a face and a few lines, and a hello going out
  <>
    <rect className="s" x="38" y="38" width="112" height="72" {...P} />
    <circle className="s" cx="66" cy="66" r="11" {...P} />
    <path className="s f" d="M52 96 C54 86 78 86 80 96" {...P} />
    <path className="s f" d="M92 60 H136 M92 72 H128 M92 84 H116" {...P} />
    <path className="s f" d="M166 54 C174 62 174 86 166 94" {...P} />
    <path className="s" d="M180 44 C194 58 194 90 180 104" {...P} />
    <circle className="dot" cx="66" cy="66" r="3.5" />
  </>,
  // Discuss the opportunity: two speech bubbles, one answering the other
  <>
    <path className="s" d="M36 34 H134 V88 H74 L56 104 V88 H36 Z" {...P} />
    <path className="s f" d="M106 64 H204 V116 H186 V132 L168 116 H106 Z" {...P} />
    <path className="s f" d="M52 52 H116 M52 68 H100" {...P} />
    <circle className="dot" cx="134" cy="91" r="3" />
    <circle className="dot" cx="155" cy="91" r="3" />
    <circle className="dot" cx="176" cy="91" r="3" />
  </>,
  // Agree the scope and terms: the page of terms, signed and ticked
  <>
    <path className="s" d="M74 22 H152 L172 42 V138 H74 Z" {...P} />
    <path className="s f" d="M152 22 V42 H172" {...P} />
    <path className="s f" d="M88 50 H138 M88 62 H156 M88 74 H150 M88 86 H130" {...P} />
    <path className="s" d="M88 116 C96 104 102 124 110 112 C116 104 120 118 128 110" {...P} />
    <path className="s f" d="M86 124 H134" {...P} />
    <circle className="s" cx="176" cy="118" r="14" {...P} />
    <path className="s" d="M169 118 L174 123 L184 112" {...P} />
  </>,
];

export function BeginSteps({ items }: { items: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  // True only in the browser after hydration
  const armed = useSyncExternalStore(noSubscribe, () => true, () => false);

  return (
    <ol ref={ref} className="begin relative grid gap-12 md:grid-cols-3 md:gap-6" data-armed={armed && !seen} data-live={seen}>
      <span aria-hidden="true" className="begin-track">
        <span className="begin-fill" />
        <span className="begin-runner" />
      </span>
      {items.map((s, i) => (
        <li key={s} className="begin-step relative grid content-start gap-4 max-md:ps-10 md:pt-12" style={{ "--i": i } as CSSProperties}>
          <span aria-hidden="true" className="begin-node" />
          <svg
            viewBox="0 0 240 160"
            aria-hidden="true"
            className={cn("ill begin-ill well aspect-[3/2] h-auto w-full max-w-[340px] text-ink", seen && "ill-draw")}
            style={{ "--d": `${0.35 + i * 0.9}s` } as CSSProperties}
          >
            {drawings[i % drawings.length]}
          </svg>
          <div className="begin-text grid gap-1.5">
            <span className="text-[0.78rem] font-medium tabular-nums text-brand">{pad(i + 1)}</span>
            <h3 className="t-h3">{s}</h3>
          </div>
        </li>
      ))}
    </ol>
  );
}
