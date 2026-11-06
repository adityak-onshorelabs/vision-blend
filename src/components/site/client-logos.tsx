import type { CSSProperties } from "react";
import type { ClientLogo } from "@/content/types";

/*
  Client logo strip: one or two rows drifting in opposite directions, paused on hover. Each logo is
  a one-colour mask tinted to the text colour, so the set reads as one even though the files come
  in every colour. Logos are sized to the same visual area (width grows with the square root of the
  aspect ratio), so a long wordmark and a square mark carry the same weight.

  Each row holds its logos twice and slides by half its width, so the loop has no seam. The copy is
  hidden from screen readers. With reduced motion the rows stand still and wrap, copy removed.
*/

/** Width in units of --logo-size: the square root of the aspect ratio keeps every logo's area equal */
const widthOf = ({ ratio: [w, h], scale = 1 }: ClientLogo) => Math.sqrt(w / h) * scale;

function Logo({ logo, hidden }: { logo: ClientLogo; hidden?: boolean }) {
  const [w, h] = logo.ratio;
  return (
    <li className="logo-cell" aria-hidden={hidden || undefined}>
      <span
        role={hidden ? undefined : "img"}
        aria-label={hidden ? undefined : logo.name}
        title={logo.name}
        className="logo-mask"
        style={{ "--logo": `url("${logo.logo}")`, "--w": widthOf(logo).toFixed(3), aspectRatio: `${w} / ${h}` } as CSSProperties}
      />
    </li>
  );
}

export function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  // Two rows once there are enough logos to fill them
  const half = Math.ceil(logos.length / 2);
  const rows = logos.length > 8 ? [logos.slice(0, half), logos.slice(half)] : [logos];
  return (
    <div className="logo-strip">
      {rows.map((row, r) => (
        <div key={r} className="logo-row" data-reverse={r % 2 === 1 || undefined}>
          {/* ~3.5s per logo keeps the drift slow enough to read every name */}
          <ul className="logo-track" style={{ "--dur": `${row.length * 3.5}s` } as CSSProperties}>
            {row.map((l) => (
              <Logo key={l.logo} logo={l} />
            ))}
            {row.map((l) => (
              <Logo key={`${l.logo}-copy`} logo={l} hidden />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
