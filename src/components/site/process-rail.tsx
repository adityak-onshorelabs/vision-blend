"use client";

/*
  Adapted from Watermelon UI `step-indicator` (reference/watermelon/step-indicator.tsx).
  Kept: a segmented rail where hovering or focusing a step moves a highlight to that segment.
  Changed: square hairline segments instead of rounded pills, a brown bar that slides between
  segments (shared layoutId) instead of the floating clip-path label, step text always visible
  under each segment so nothing depends on hover, react-icons removed, vertical on small screens.
  Added: a line drawing per step that draws in left to right when the rail scrolls into view,
  and reacts on the active step (rules in globals.css under "Process drawings").
*/
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Step } from "@/content/types";
import { cn } from "@/lib/utils";

const P = { pathLength: 1 } as const;

const drawings: ReactNode[] = [
  // Listen: a speech bubble, the brief, and sound travelling out.
  <>
    <path className="s" d="M44 40 H150 V104 H82 L64 122 V104 H44 Z" {...P} />
    <path className="s f" d="M60 60 H134 M60 74 H124 M60 88 H104" {...P} />
    <g className="wave">
      <path className="s" d="M168 56 C178 66 178 86 168 96" {...P} />
      <path className="s f" d="M182 46 C198 62 198 90 182 106" {...P} />
      <path className="s f" d="M196 36 C218 58 218 94 196 116" {...P} />
    </g>
    <circle className="dot" cx="112" cy="88" r="4" />
  </>,
  // Shape: references pinned into a moodboard, a direction drawn through them.
  <>
    <rect className="s tile-a" x="40" y="34" width="62" height="46" {...P} />
    <rect className="s f tile-b" x="110" y="34" width="38" height="46" {...P} />
    <rect className="s f tile-c" x="40" y="88" width="38" height="38" {...P} />
    <rect className="s tile-d" x="86" y="88" width="62" height="38" {...P} />
    <path className="s pen" d="M164 128 L204 48" {...P} />
    <path className="s pen" d="M200 44 L210 50 L170 132 L160 126 Z" {...P} />
    <circle className="dot" cx="166" cy="130" r="4" />
  </>,
  // Make: artboards stacking up as the work gets made.
  <>
    <rect className="s f layer-3" x="92" y="30" width="96" height="68" {...P} />
    <rect className="s f layer-2" x="72" y="46" width="96" height="68" {...P} />
    <rect className="s layer-1" x="52" y="62" width="96" height="68" {...P} />
    <path className="s f" d="M52 52 V58 M46 62 H40 M148 140 V134 M154 130 H160" {...P} />
    <path className="s" d="M88 84 L112 96 L88 108 Z" {...P} />
    <circle className="dot layer-1" cx="138" cy="72" r="4" />
  </>,
  // Run: monthly ticks and a line that keeps climbing.
  <>
    <path className="s f" d="M36 128 H212 M36 128 V32" {...P} />
    {[0, 1, 2, 3, 4, 5].map((t) => (
      <path key={t} className="s f" d={`M${62 + t * 28} 124 V132`} {...P} />
    ))}
    <path className="s climb" d="M40 116 L72 104 L100 108 L128 84 L156 88 L190 52" {...P} />
    <circle className="dot climb" cx="190" cy="52" r="4" />
  </>,
];

export function ProcessRail({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(steps.length - 1);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <ol
      ref={ref}
      className="grid gap-9 max-md:border-s max-md:border-border max-md:ps-7 md:grid-cols-4 md:gap-6"
      onMouseLeave={() => setActive(steps.length - 1)}
    >
      {steps.map((step, i) => {
        const isActive = active === i;
        return (
          <li
            key={step.name}
            tabIndex={0}
            data-active={isActive}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="proc-step relative grid min-w-0 content-start gap-2.5 outline-offset-8 md:pt-8"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-[3px] hidden h-px bg-border md:block">
              {isActive && (
                <motion.span
                  layoutId="process-bar"
                  className="absolute inset-0 bg-brand"
                  transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.5 }}
                />
              )}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute size-[7px] rounded-full transition-[transform,background-color] duration-300 max-md:-start-[31px] max-md:top-2 md:start-0 md:top-0",
                isActive ? "scale-150 bg-brand" : "bg-ink",
              )}
            />
            <svg
              viewBox="0 0 240 160"
              aria-hidden="true"
              className={cn(
                "ill proc-ill well mb-3 aspect-[3/2] h-auto w-full text-ink transition-colors duration-500",
                inView && "ill-draw",
              )}
              style={{ "--d": `${i * 0.28}s` } as CSSProperties}
            >
              {drawings[i % drawings.length]}
            </svg>
            <span className="t-label">Step {i + 1}</span>
            <h3 className="t-h3">{step.name}</h3>
            <p className="text-[0.96rem] text-muted-foreground">{step.text}</p>
            <span className="text-[0.92rem]">{step.out}</span>
          </li>
        );
      })}
    </ol>
  );
}
