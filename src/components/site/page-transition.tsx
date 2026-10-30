"use client";

/*
  Page transition: a night panel wipes up over the page, a line illustration for the destination
  draws in with the page name and the brown full stop, the route changes underneath, then the
  panel wipes away upward.

  Internal link clicks are intercepted on window (capture phase) so they run before Next's Link
  handler, which skips navigation when the event is already default-prevented. Back/forward,
  modified clicks, new-tab and external links, same-page links and reduced-motion users get a
  normal navigation with no overlay.
*/
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Scene = "home" | "work" | "services" | "about" | "contact";
type Phase = "idle" | "cover" | "hold" | "reveal";

const EASE = [0.76, 0, 0.24, 1] as const;
const COVER_S = 0.55;
const MIN_HOLD_MS = 650;
const FAILSAFE_MS = 4000;

function sceneFor(pathname: string, lang: string): Scene {
  const rest = pathname.replace(new RegExp(`^/${lang}`), "").split("/")[1] ?? "";
  return (["work", "services", "about", "contact"].includes(rest) ? rest : "home") as Scene;
}

export function PageTransition({ lang, labels }: { lang: string; labels: Record<Scene, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [scene, setScene] = useState<Scene>("home");
  const target = useRef<string | null>(null);
  const startedAt = useRef(0);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    if (failsafe.current) clearTimeout(failsafe.current);
    const wait = Math.max(0, MIN_HOLD_MS - (performance.now() - startedAt.current));
    setTimeout(() => setPhase("reveal"), wait);
  }, []);

  // Intercept internal link clicks.
  useEffect(() => {
    if (reduce) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith("/api")) return;
      if (url.pathname === window.location.pathname) return; // same page, let hashes scroll normally
      if (sceneFor(url.pathname, lang) === "home") return; // the home hero's intro is the transition
      if (phase !== "idle") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      target.current = url.pathname;
      setScene(sceneFor(url.pathname, lang));
      startedAt.current = performance.now();
      setPhase("cover");
      failsafe.current = setTimeout(() => setPhase("reveal"), FAILSAFE_MS);
      const href = url.pathname + url.search + url.hash;
      setTimeout(() => router.push(href), COVER_S * 1000);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [reduce, phase, lang, router]);

  // The new route has rendered underneath: hold briefly so the drawing finishes, then reveal.
  useEffect(() => {
    if (phase === "idle" || !target.current) return;
    if (pathname === target.current) {
      target.current = null;
      setPhase("hold");
      reveal();
    }
  }, [pathname, phase, reveal]);

  useEffect(() => () => {
    if (failsafe.current) clearTimeout(failsafe.current);
  }, []);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key="page-transition"
          aria-hidden="true"
          className="fixed inset-0 z-[60] grid place-items-center bg-night text-[var(--on-night)]"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={phase === "reveal" ? { clipPath: "inset(0% 0% 100% 0%)" } : { clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: COVER_S, ease: EASE }}
          onAnimationComplete={() => phase === "reveal" && setPhase("idle")}
        >
          <motion.div
            className="grid justify-items-center gap-6"
            initial={{ y: 24, opacity: 0 }}
            animate={phase === "reveal" ? { y: -24, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: EASE, delay: phase === "reveal" ? 0 : 0.18 }}
          >
            <Illustration scene={scene} />
            <span className="text-[clamp(1.6rem,1.1rem+2vw,2.75rem)] font-light tracking-[-0.03em]">
              {labels[scene]}
              <span className="text-[var(--brand-soft)]">.</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.7, ease: EASE, delay: 0.25 + delay }, opacity: { duration: 0.01, delay: 0.25 + delay } },
});
const pop = (delay = 0) => ({
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const, delay: 0.25 + delay },
});

/** Line illustrations in the same language as the service drawings. */
function Illustration({ scene }: { scene: Scene }) {
  const common = {
    viewBox: "0 0 240 160",
    className: "h-auto w-[min(260px,60vw)]",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "square" as const,
  };
  const dot = "var(--brand-soft)";

  if (scene === "home") {
    // Two circles blend into one: Vision + Blend.
    return (
      <svg {...common}>
        <motion.circle cx="120" cy="78" r="44" initial={{ x: -30, pathLength: 0 }} animate={{ x: 0, pathLength: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }} />
        <motion.circle cx="120" cy="78" r="44" initial={{ x: 30, pathLength: 0 }} animate={{ x: 0, pathLength: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }} />
        <motion.circle cx="178" cy="120" r="4" fill={dot} stroke="none" style={{ transformOrigin: "178px 120px" }} {...pop(0.7)} />
      </svg>
    );
  }
  if (scene === "work") {
    // Viewfinder brackets close in on the frame, rec dot lights.
    return (
      <svg {...common}>
        <motion.g initial={{ scale: 1.25, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }} style={{ transformOrigin: "120px 80px" }}>
          <path d="M40 50 V34 H58 M182 34 H200 V50 M200 110 V126 H182 M58 126 H40 V110" />
        </motion.g>
        <motion.path d="M70 80 H170" strokeOpacity={0.3} {...draw(0.1)} />
        <motion.path d="M114 80 H126 M120 74 V86" {...draw(0.3)} />
        <motion.circle cx="52" cy="22" r="4" fill={dot} stroke="none" style={{ transformOrigin: "52px 22px" }} {...pop(0.5)} />
      </svg>
    );
  }
  if (scene === "services") {
    // Three practices, three overlapping circles.
    return (
      <svg {...common}>
        <motion.circle cx="92" cy="90" r="34" {...draw(0)} />
        <motion.circle cx="148" cy="90" r="34" {...draw(0.12)} />
        <motion.circle cx="120" cy="58" r="34" {...draw(0.24)} />
        <motion.circle cx="120" cy="79" r="4" fill={dot} stroke="none" style={{ transformOrigin: "120px 79px" }} {...pop(0.7)} />
      </svg>
    );
  }
  if (scene === "about") {
    // Six people: a 3 x 2 grid of tiles arriving one by one.
    const tiles = [0, 1, 2, 3, 4, 5];
    return (
      <svg {...common}>
        {tiles.map((t) => {
          const x = 72 + (t % 3) * 33;
          const y = 46 + Math.floor(t / 3) * 33;
          return (
            <motion.rect
              key={t}
              x={x}
              y={y}
              width="30"
              height="30"
              strokeOpacity={0.5}
              fill={t === 4 ? dot : "currentColor"}
              fillOpacity={t === 4 ? 1 : 0.08}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 + t * 0.07 }}
            />
          );
        })}
      </svg>
    );
  }
  // Contact: a sentence-length line that ends in a full stop.
  return (
    <svg {...common}>
      <motion.path d="M36 96 H184" {...draw(0)} />
      <motion.path d="M36 74 H140" strokeOpacity={0.35} {...draw(0.1)} />
      <motion.circle cx="198" cy="94" r="5" fill={dot} stroke="none" style={{ transformOrigin: "198px 94px" }} {...pop(0.75)} />
    </svg>
  );
}
