"use client";

/*
  The process on an industry page, told like a reel. Each step has a story-style progress bar on
  top and an animated line scene of that stage of a production:
    1. Strategy & Script: a dart lands on the target while the script writes itself line by line.
    2. Visual Direction: the deck fans out, the sun rises on the key frame, swatches get picked.
    3. Shoot & Production: the viewfinder pans across a skyline, REC blinks, focus hunts, the shot
       list ticks off.
    4. Editing & Delivery: the playhead sweeps the timeline, the export bar fills, the check lands.

  - While the section is on screen the steps play in turn (about four seconds each) and loop. The
    bar of the playing step fills; bars of earlier steps stay full.
  - Hovering (mouse) or focusing a step holds the sequence on it; leaving resumes from there.
    A tap jumps to that step and keeps playing.
  - Off screen everything pauses. Reduced motion: no autoplay and no loops; every scene is shown
    complete and hover/focus still picks the step.
  Scene loops and progress keyframes live in globals.css under "Process reel".
*/
import { useInView, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Step } from "@/content/types";
import { cn } from "@/lib/utils";

const P = { pathLength: 1 } as const;
const DUR = 4.2;

/** One period (120 units wide) of skyline, starting at x. */
const skyline = (x: number) =>
  [
    [0, 84, 18],
    [24, 64, 16],
    [46, 92, 14],
    [66, 74, 20],
    [92, 98, 12],
    [108, 70, 10],
  ]
    .map(([dx, top, w]) => `M${x + dx} 120 V${top} H${x + dx + w} V120`)
    .join(" ");

/** Audio waveform across the timeline's third track. */
const waveform = Array.from({ length: 36 }, (_, k) => {
  const x = 32 + k * 5;
  const h = 2 + Math.abs(Math.sin(k * 1.7) * 5) + (k % 5 === 0 ? 2 : 0);
  return `M${x} ${87 - h} V${87 + h}`;
}).join(" ");

const scenes: ((id: string) => ReactNode)[] = [
  // Strategy & Script
  () => (
    <>
      <path className="s" d="M52 20 H140 L160 40 V160 H52 Z" {...P} />
      <path className="s f" d="M140 20 V40 H160" {...P} />
      <path className="s" d="M66 38 H112" {...P} />
      {[
        "M66 58 H144",
        "M66 70 H132",
        "M86 86 H136",
        "M86 98 H122",
        "M66 114 H144",
        "M66 126 H138",
        "M66 138 H104",
      ].map((d, k) => (
        <path key={d} className="w" d={d} style={{ "--i": k } as CSSProperties} {...P} />
      ))}
      <g className="ring">
        <circle className="s f" cx="196" cy="56" r="22" {...P} />
        <circle className="s" cx="196" cy="56" r="12" {...P} />
      </g>
      <circle className="dot" cx="196" cy="56" r="3.5" />
      <g className="dart">
        <path className="s" d="M170 82 L193 59" {...P} />
        <path className="s" d="M184 60 L193 59 L192 68" {...P} />
        <path className="s f" d="M170 82 L163 82 M170 82 L170 89" {...P} />
      </g>
    </>
  ),
  // Visual Direction
  () => (
    <>
      <rect className="s f deck-l" x="66" y="30" width="108" height="72" {...P} />
      <rect className="s f deck-r" x="66" y="30" width="108" height="72" {...P} />
      <rect className="s paper" x="66" y="30" width="108" height="72" {...P} />
      <g className="sun">
        <circle className="s b" cx="146" cy="56" r="9" {...P} />
      </g>
      <path className="s f" d="M78 88 V66 H92 V88 M96 88 V54 H108 V88 M112 88 V72 H122 V88" {...P} />
      <path className="s" d="M74 88 H166" {...P} />
      {[0.85, 0.5, 0.2].map((o, k) => (
        <circle key={o} className="sw" cx={90 + k * 20} cy="134" r="7" style={{ "--i": k, fillOpacity: o } as CSSProperties} />
      ))}
      <circle className="sw sw-b" cx="150" cy="134" r="7" style={{ "--i": 3 } as CSSProperties} />
      <path className="s f" d="M66 152 H174" {...P} />
    </>
  ),
  // Shoot & Production
  (id) => (
    <>
      <defs>
        <clipPath id={`${id}-vf`}>
          <rect x="28" y="28" width="184" height="112" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-vf)`}>
        <g className="pan">
          <path className="s f" d={`${skyline(28)} ${skyline(148)} ${skyline(268)}`} {...P} />
        </g>
      </g>
      <path className="s" d="M28 120 H212" {...P} />
      <rect className="s" x="28" y="28" width="184" height="112" {...P} />
      <path className="s f" d="M36 44 V36 H44 M196 36 H204 V44 M204 124 V132 H196 M44 132 H36 V124" {...P} />
      <g className="focus">
        <path className="s" d="M110 76 H104 V82 M130 76 H136 V82 M110 98 H104 V92 M130 98 H136 V92" {...P} />
      </g>
      <circle className="dot rec" cx="46" cy="47" r="3.5" />
      <text className="lbl" x="54" y="50.5">
        REC
      </text>
      {[0, 1, 2].map((k) => (
        <rect key={k} className="tile shot" x={28 + k * 64} y="152" width="56" height="10" style={{ "--i": k } as CSSProperties} />
      ))}
    </>
  ),
  // Editing & Delivery
  () => (
    <>
      <rect className="s f" x="24" y="28" width="192" height="76" {...P} />
      <rect className="tile" x="30" y="36" width="52" height="14" />
      <rect className="tile" x="86" y="36" width="70" height="14" />
      <rect className="tile" x="160" y="36" width="50" height="14" />
      <rect className="tile" x="30" y="56" width="90" height="14" />
      <rect className="tile" x="124" y="56" width="86" height="14" />
      <path className="s f" d={waveform} {...P} />
      <g className="head">
        <path className="s b" d="M40 30 V102" {...P} />
        <path className="dot" d="M35 28 H45 L40 34 Z" />
      </g>
      <rect className="s" x="30" y="124" width="150" height="10" {...P} />
      <rect className="bar" x="30" y="124" width="150" height="10" />
      <circle className="s" cx="202" cy="129" r="11" {...P} />
      <path className="tick" d="M196 129 L200 133 L208 124" {...P} />
    </>
  ),
];

export function ProcessReel({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const live = useInView(ref, { margin: "0px 0px -15% 0px" });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const playing = seen && live && !held && !reduce;

  const hold = (i: number) => {
    setActive(i);
    setHeld(true);
  };

  return (
    <ol
      ref={ref}
      className="reel grid gap-12 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4"
      data-live={seen && live}
      data-playing={playing}
      style={{ "--dur": `${DUR}s` } as CSSProperties}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
    >
      {steps.map((step, i) => {
        const state = i < active ? "done" : i === active ? "active" : "todo";
        return (
          <li
            key={step.name}
            tabIndex={0}
            data-active={i === active}
            onPointerEnter={(e) => e.pointerType === "mouse" && hold(i)}
            // Keyboard focus holds the step; a tap also focuses, but should only jump (onClick)
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && hold(i)}
            onClick={() => setActive(i)}
            className="reel-step group grid min-w-0 content-start gap-3 outline-offset-8"
          >
            <span aria-hidden="true" className="relative block h-[3px] overflow-hidden bg-[var(--rule)]">
              <span
                className="reel-fill absolute inset-0 bg-brand"
                data-state={state}
                data-held={held || !!reduce}
                onAnimationEnd={(e) => {
                  if (e.target === e.currentTarget && e.animationName === "reel-fill") setActive((a) => (a + 1) % steps.length);
                }}
              />
            </span>
            <svg
              viewBox="0 0 240 180"
              aria-hidden="true"
              className={cn("ill reel-scene well mt-3 mb-2 aspect-[4/3] h-auto w-full text-ink", seen && "ill-draw")}
              style={{ "--d": `${i * 0.25}s` } as CSSProperties}
            >
              {scenes[i % scenes.length](`${id}-${i}`)}
            </svg>
            <span className="t-label tabular-nums transition-colors duration-300 group-data-[active=true]:text-brand">
              {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
            <h3 className="t-h3">{step.name}</h3>
            <p className="text-[0.96rem] text-muted-foreground">{step.text}</p>
            {step.out && <span className="text-[0.92rem]">{step.out}</span>}
          </li>
        );
      })}
    </ol>
  );
}
