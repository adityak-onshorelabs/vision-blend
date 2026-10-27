/*
  Placeholder line illustrations for each project, used until the studio shares stills.
  Same language as the service drawings: 1.25px lines, faint guides, one brown dot.
  Lines carry pathLength="1" so `.ill-draw` (globals.css) can draw them in; at rest and with
  reduced motion they are fully drawn. Inside any `.group`, hovering moves named parts
  (rules under "Project drawings: hover" in globals.css).
*/
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const P = { pathLength: 1 } as const;

const art: Record<string, ReactNode> = {
  // Film for FIFA x Paradise: a football framed in a film strip.
  "fifa-x-paradise": (
    <>
      <rect className="s f" x="40" y="70" width="220" height="160" {...P} />
      <g className="pa-strip">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <g key={i}>
            <rect className="s f" x={48 + i * 24} y="76" width="12" height="8" {...P} />
            <rect className="s f" x={48 + i * 24} y="216" width="12" height="8" {...P} />
          </g>
        ))}
      </g>
      <g className="pa-ball">
        <circle className="s" cx="150" cy="150" r="48" {...P} />
        <path className="s" d="M150 128 L171 143 L163 168 L137 168 L129 143 Z" {...P} />
        <path className="s" d="M150 128 V102 M171 143 L195 135 M163 168 L178 190 M137 168 L122 190 M129 143 L105 135" {...P} />
      </g>
      <circle className="dot" cx="248" cy="58" r="5" />
    </>
  ),
  // Hands Behind The Brand, Delta Palm Beach: a palm against the horizon.
  "hands-behind-the-brand": (
    <>
      <path className="s f" d="M30 214 H270" {...P} />
      <path className="s f" d="M60 232 H240 M100 248 H200" {...P} />
      <path className="s" d="M150 214 C152 180 158 140 168 104" {...P} />
      <g className="pa-fronds">
        <path className="s" d="M168 104 C150 86 120 84 98 96" {...P} />
        <path className="s" d="M168 104 C160 80 138 66 116 64" {...P} />
        <path className="s" d="M168 104 C176 78 196 66 220 66" {...P} />
        <path className="s" d="M168 104 C190 92 220 96 238 112" {...P} />
        <path className="s" d="M168 104 C172 124 168 144 158 158" {...P} />
      </g>
      <g className="pa-sun">
        <circle className="s f" cx="90" cy="150" r="26" {...P} />
      </g>
      <circle className="dot" cx="90" cy="150" r="5" />
    </>
  ),
  // People Files: six portrait frames for six people.
  "people-files": (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 54 + (i % 3) * 66;
        const y = 70 + Math.floor(i / 3) * 84;
        return (
          <g key={i} className="pa-lift" style={{ transitionDelay: `${i * 50}ms` }}>
            <rect className="s f" x={x} y={y} width="58" height="76" {...P} />
            <circle className="s" cx={x + 29} cy={y + 30} r="11" {...P} />
            <path className="s" d={`M${x + 11} ${y + 68} C${x + 13} ${y + 50} ${x + 45} ${y + 50} ${x + 47} ${y + 68}`} {...P} />
          </g>
        );
      })}
      <circle className="dot" cx="249" cy="62" r="5" />
    </>
  ),
  // A Week at Vision Blend: seven days, one episode.
  "a-week-at-vision-blend": (
    <>
      <path className="s f" d="M36 96 H264 M36 204 H264" {...P} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} className="s f pa-day" x={40 + i * 32} y="112" width="28" height="76" style={{ transitionDelay: `${i * 60}ms` }} {...P} />
      ))}
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <text key={i} x={54 + i * 32} y="88" textAnchor="middle" fontSize="10" letterSpacing="1" fill="currentColor" opacity=".5">
          {d}
        </text>
      ))}
      <g className="pa-play">
        <path className="s" d="M144 136 L164 150 L144 164 Z" {...P} />
      </g>
      <circle className="dot" cx="246" cy="126" r="5" />
    </>
  ),
  // Identity system: a VB monogram on its construction grid.
  "identity-system": (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} className="s f" d={`M${60 + i * 45} 60 V240 M60 ${60 + i * 45} H240`} {...P} />
      ))}
      <g className="pa-ring">
        <circle className="s f" cx="150" cy="150" r="90" {...P} />
      </g>
      <g className="pa-mono">
        <path className="s" d="M78 96 L114 204 L150 96" {...P} />
        <path className="s" d="M168 96 V204 M168 96 H190 A27 27 0 0 1 190 150 H168 M168 150 H196 A27 27 0 0 1 196 204 H168" {...P} />
      </g>
      <circle className="dot" cx="236" cy="200" r="5" />
    </>
  ),
  // Content retainer: a phone, a feed, a month of posts.
  "content-retainer": (
    <>
      <rect className="s" x="104" y="40" width="92" height="190" {...P} />
      <path className="s f" d="M138 50 H162" {...P} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect key={i} className="s f pa-tile" x={112 + (i % 3) * 26} y={70 + Math.floor(i / 3) * 26} width="24" height="24" style={{ transitionDelay: `${i * 35}ms` }} {...P} />
      ))}
      <path className="s f" d="M112 160 H188 M112 172 H170 M112 184 H178" {...P} />
      <path className="s f" d="M40 252 H260" {...P} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} className="s f" d={`M${52 + i * 28} 246 V258`} {...P} />
      ))}
      <circle className="dot" cx="166" cy="96" r="5" />
    </>
  ),
};

export function ProjectArt({ slug, className, label }: { slug: string; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      preserveAspectRatio="xMidYMid meet"
      className={cn("ill ill-draw", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {art[slug] ?? art["identity-system"]}
    </svg>
  );
}
