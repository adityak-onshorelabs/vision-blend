import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
  Line drawings for the industries on the Services page, in the same language as the service and
  project drawings: 1.25px lines, faint guides, one brown dot. Hovering the nearest `.group`
  moves a named part (rules under "Industry drawings" in globals.css): towers rise, the lid lifts,
  the bubbles part, the cloche lifts off the dot, the car drives on.
*/

const art: Record<string, ReactNode> = {
  // Real Estate: towers on the horizon, with the sun as the dot.
  "real-estate": (
    <>
      <line className="s f" x1="24" y1="132" x2="216" y2="132" />
      <line className="s f" x1="24" y1="36" x2="216" y2="36" />
      <g className="re-a">
        <rect className="s" x="70" y="44" width="44" height="88" />
        <path className="s f" d="M70 62 H114 M70 80 H114 M70 98 H114 M70 116 H114 M92 44 V132" />
      </g>
      <g className="re-b">
        <rect className="s" x="124" y="72" width="36" height="60" />
        <path className="s f" d="M124 88 H160 M124 104 H160 M124 120 H160" />
      </g>
      <rect className="s f" x="168" y="98" width="24" height="34" />
      <circle className="dot" cx="186" cy="56" r="4" />
    </>
  ),
  // D2C: a product box with its tag; the lid lifts.
  d2c: (
    <>
      <line className="s f" x1="24" y1="132" x2="216" y2="132" />
      <rect className="s" x="84" y="78" width="72" height="54" />
      <path className="s f" d="M120 78 V132 M84 96 H156" />
      <g className="d2c-lid">
        <rect className="s" x="78" y="64" width="84" height="14" />
      </g>
      <path className="s" d="M156 100 H172 L182 108 L172 116 H156" />
      <circle className="dot" cx="171" cy="108" r="3.5" />
    </>
  ),
  // Services (service businesses): a conversation, two bubbles that part.
  services: (
    <>
      <line className="s f" x1="24" y1="148" x2="216" y2="148" />
      <g className="sv-a">
        <path className="s" d="M64 36 H136 Q144 36 144 44 V72 Q144 80 136 80 H84 L70 92 V80 H64 Q56 80 56 72 V44 Q56 36 64 36 Z" />
        <path className="s f" d="M70 52 H128 M70 64 H110" />
      </g>
      <g className="sv-b">
        <path className="s" d="M104 92 H176 Q184 92 184 100 V116 Q184 124 176 124 H170 V136 L156 124 H104 Q96 124 96 116 V100 Q96 92 104 92 Z" />
        <circle className="s f" cx="124" cy="108" r="3.5" />
        <circle className="s f" cx="140" cy="108" r="3.5" />
        <circle className="dot" cx="156" cy="108" r="3.5" />
      </g>
    </>
  ),
  // Hospitality: a cloche over the plate; it lifts to show the dot.
  hospitality: (
    <>
      <line className="s f" x1="36" y1="124" x2="204" y2="124" />
      <path className="s" d="M60 116 Q120 128 180 116" />
      <circle className="dot" cx="120" cy="108" r="4" />
      <g className="ho-lid">
        <path className="s" d="M72 114 A48 48 0 0 1 168 114 Z" />
        <circle className="s" cx="120" cy="61" r="5" />
      </g>
    </>
  ),
  // Automobile: a car on the road, headlight as the dot; it drives on.
  automobile: (
    <>
      <line className="s f" x1="24" y1="132" x2="216" y2="132" />
      <path className="s f" d="M40 144 H64 M96 144 H120 M152 144 H176" />
      <g className="au-car">
        <path className="s" d="M58 118 H44 V106 Q44 100 52 100 H74 L96 80 H146 L172 100 H192 Q200 100 200 108 V118 H186 M158 118 H86" />
        <path className="s f" d="M74 100 H172 M120 80 V100" />
        <circle className="s" cx="72" cy="120" r="12" />
        <circle className="s" cx="172" cy="120" r="12" />
        <circle className="dot" cx="196" cy="107" r="3" />
      </g>
    </>
  ),
};

// An industry added later in the admin, before it has its own drawing
const fallback = (
  <>
    <line className="s f" x1="24" y1="132" x2="216" y2="132" />
    <circle className="s" cx="120" cy="80" r="44" />
    <circle className="s f" cx="120" cy="80" r="26" />
    <circle className="dot" cx="120" cy="80" r="4" />
  </>
);

export function IndustryArt({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg className={cn("ill", className)} viewBox="0 0 240 160" aria-hidden="true">
      {art[slug === "hospitality-services" ? "hospitality" : slug] ?? fallback}
    </svg>
  );
}
