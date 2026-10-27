/*
  Instagram's official embed, cropped to just the media so the post plays on the page.

  Embed geometry (measured): a 54px header, then the media box as wide as the frame, then a
  "View more on Instagram" bar. Media height is width * ratio:
    landscape  16:9 video post (first carousel slide)  ratio 0.5625
    portrait   4:5 photo/video post                    ratio 1.25
    reel       9:16 reel pillarboxed in a 4:5 box; the clean video area is the centre 70%
               of the width and one frame-width tall
  The window below shows exactly that area. The iframe stays interactive (play, carousel
  arrows) and is lazy-loaded; a copper wash sits behind it while Instagram loads.
*/
import { cn } from "@/lib/utils";

export type EmbedKind = "landscape" | "portrait" | "reel";

const HEADER = 54;

const geometry: Record<EmbedKind, { aspect: string; width: string; left: string; height: string }> = {
  landscape: { aspect: "aspect-video", width: "100%", left: "0%", height: `calc(100% + ${HEADER + 420}px)` },
  portrait: { aspect: "aspect-[4/5]", width: "100%", left: "0%", height: `calc(100% + ${HEADER + 420}px)` },
  reel: { aspect: "aspect-[7/10]", width: `${100 / 0.7}%`, left: `${-(0.15 / 0.7) * 100}%`, height: `calc(200% + ${HEADER}px)` },
};

export function InstagramMedia({
  url,
  kind,
  title,
  className,
  priority = false,
}: {
  url: string;
  kind: EmbedKind;
  title: string;
  className?: string;
  priority?: boolean;
}) {
  const g = geometry[kind];
  const src = `${url.replace(/\/?$/, "/")}embed/`;
  return (
    <div className={cn("relative w-full overflow-hidden bg-[var(--well)]", g.aspect, className)}>
      <span aria-hidden="true" className="crop crop-bw absolute inset-0 opacity-60" style={{ backgroundSize: "260%" }} />
      {/* Scaled 1.5% around the window's centre to hide the 1px white edge Instagram leaves. */}
      <div className="absolute inset-0 scale-[1.015]">
        <iframe
          src={src}
          title={`Instagram: ${title}`}
          loading={priority ? "eager" : "lazy"}
          scrolling="no"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          className="absolute border-0"
          style={{ width: g.width, left: g.left, top: -HEADER, height: g.height }}
        />
      </div>
    </div>
  );
}
