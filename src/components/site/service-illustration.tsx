import type { Service } from "@/content/types";

/**
 * Line illustrations for the three practices. They animate on hover of the nearest `.group`
 * (rules in globals.css): branding circles blend together, the viewfinder zooms, feed tiles lift.
 */
export function ServiceIllustration({ slug, className }: { slug: Service["slug"]; className?: string }) {
  if (slug === "branding") {
    return (
      <svg className={`ill ill-brand ${className ?? ""}`} viewBox="0 0 240 160" aria-hidden="true">
        <line className="s f" x1="24" y1="124" x2="216" y2="124" />
        <line className="s f" x1="24" y1="36" x2="216" y2="36" />
        <line className="s f" x1="120" y1="20" x2="120" y2="140" />
        <circle className="s c1" cx="92" cy="80" r="44" />
        <circle className="s c2" cx="148" cy="80" r="44" />
        <path className="s lens" d="M120 46 A44 44 0 0 1 120 114 A44 44 0 0 1 120 46 Z" />
        <circle className="dot" cx="206" cy="121" r="4" />
      </svg>
    );
  }
  if (slug === "production") {
    return (
      <svg className={`ill ill-prod ${className ?? ""}`} viewBox="0 0 240 160" aria-hidden="true">
        <line className="s f" x1="86" y1="28" x2="86" y2="132" />
        <line className="s f" x1="154" y1="28" x2="154" y2="132" />
        <line className="s f" x1="32" y1="62" x2="208" y2="62" />
        <line className="s f" x1="32" y1="98" x2="208" y2="98" />
        <g className="brackets">
          <path className="s" d="M40 50 V34 H58 M182 34 H200 V50 M200 110 V126 H182 M58 126 H40 V110" />
        </g>
        <path className="s" d="M114 80 H126 M120 74 V86" />
        <circle className="dot" cx="52" cy="22" r="4" />
        <text x="62" y="26" fontSize="9" letterSpacing="1.6" fill="currentColor" opacity=".55" style={{ fontFamily: "inherit" }}>
          REC
        </text>
      </svg>
    );
  }
  return (
    <svg className={`ill ill-feed ${className ?? ""}`} viewBox="0 0 240 160" aria-hidden="true">
      <g>
        <rect className="tile" x="72" y="30" width="30" height="30" />
        <rect className="tile" x="105" y="30" width="30" height="30" />
        <rect className="tile" x="138" y="30" width="30" height="30" />
        <rect className="tile" x="72" y="63" width="30" height="30" />
        <rect className="tile" x="105" y="63" width="30" height="30" />
        <rect className="tile" x="138" y="63" width="30" height="30" />
      </g>
      <rect className="tile" x="72" y="96" width="30" height="30" opacity=".5" />
      <rect className="tile" x="105" y="96" width="30" height="30" opacity=".5" />
      <rect className="tile" x="138" y="96" width="30" height="30" opacity=".5" />
      <line className="s f" x1="40" y1="136" x2="200" y2="136" />
      <circle className="dot" cx="182" cy="40" r="4" />
    </svg>
  );
}
