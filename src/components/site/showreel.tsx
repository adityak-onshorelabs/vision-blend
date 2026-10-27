"use client";

/*
  Showreel below the hero (after Fortem Media's hero film, moved out of the hero).
  - The film plays muted on loop. As the section scrolls through, a sticky frame opens from a
    framed window to full bleed (clip-path driven by native scroll, nothing is hijacked).
  - Over the film a round label follows the pointer ("Sound on" / "Sound off"); clicking
    toggles sound. A real button in the corner does the same for keyboard and touch.
  - If the video file is missing or fails, the poster stays and the click opens the film on
    Instagram instead. Reduced motion: no opening animation and no autoplay.
*/
import { motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ShowreelCard, type CardCopy } from "./showreel-card";

export type ShowreelCopy = {
  label: string;
  title: string;
  sub: string;
  date: string;
  src: string;
  poster: string;
  instagram: string;
  soundOn: string;
  soundOff: string;
  watch: string;
  pressPlay: string;
  card: CardCopy;
};

export function Showreel({ copy }: { copy: ShowreelCopy }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [missing, setMissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pointerInside, setPointerInside] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  // Scroll-linked opening: inset shrinks from a framed window to full bleed.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const inset = useTransform(scrollYProgress, [0, 0.55], reduce ? [0, 0] : [16, 0]);
  const insetX = useTransform(inset, (v) => v * 1.35);
  const clipPath = useMotionTemplate`inset(${inset}% ${insetX}% ${inset}% ${insetX}%)`;
  // The film stays hidden behind the title card until the frame is fully open, then plays.
  const [open, setOpen] = useState(!!reduce);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    setOpen((o) => (o ? v > 0.49 : v >= 0.55));
  });
  // Top labels never go under the sticky header (about 72px tall).
  const labelTop = useMotionTemplate`max(calc(${inset}% + 20px), 92px)`;
  const labelBottom = useMotionTemplate`calc(${inset}% + 20px)`;
  const labelSide = useMotionTemplate`calc(${insetX}% + 20px)`;
  const barBottom = useMotionTemplate`calc(${inset}% + 8px)`;

  // Pointer-following label.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 400, damping: 35, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 400, damping: 35, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // The file can fail before hydration attaches onError, so also check the element's state.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const fail = () => setMissing(true);
    if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fail();
    v.addEventListener("error", fail);
    return () => v.removeEventListener("error", fail);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reduce) {
      v.pause();
      return;
    }
    // Play from the moment the frame is fully open; pause when it closes or leaves the screen.
    if (!open || missing) {
      v.pause();
      return;
    }
    v.play().catch(() => undefined);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, missing, open]);

  const toggle = () => {
    if (missing) {
      window.open(copy.instagram, "_blank", "noopener,noreferrer");
      return;
    }
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => undefined);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };

  const cursorLabel = missing ? copy.watch : muted ? copy.soundOn : copy.soundOff;

  return (
    <section ref={wrap} aria-labelledby="reel-title" className="relative h-[200vh] bg-paper max-md:h-[150vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className={finePointer ? "absolute inset-0 cursor-none bg-night" : "absolute inset-0 bg-night"}
          style={{ clipPath }}
          onPointerMove={onMove}
          onPointerEnter={() => setPointerInside(true)}
          onPointerLeave={() => setPointerInside(false)}
          onClick={toggle}
        >
          <video
            ref={video}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${open && !missing ? "opacity-100" : "opacity-0"}`}
            src={copy.src}
            poster={copy.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${copy.title}, ${copy.sub}`}
            onError={() => setMissing(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />

          {/* Corner labels ride the opening inset so they stay inside the frame. */}
          <motion.div className="absolute flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/85" style={{ top: labelTop, left: labelSide }}>
            <span className="size-1.5 rounded-full bg-[var(--brand-soft)]" />
            {copy.label}
          </motion.div>
          <motion.div className="absolute text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/85" style={{ top: labelTop, right: labelSide }}>
            {copy.date}
          </motion.div>

          <h2 id="reel-title" className="sr-only">
            {copy.title}, {copy.sub}
          </h2>
          <ShowreelCard copy={copy.card} progress={scrollYProgress} visible={!open || missing} reduce={reduce} />

          <motion.div className="absolute flex flex-wrap items-center gap-3" style={{ bottom: labelBottom, left: labelSide }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              className="cta cta-sm border-white bg-white text-[var(--night)] hover:border-white hover:bg-white/90"
            >
              {cursorLabel}
            </button>
            <a
              href={copy.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="cta cta-sm cta-line border-white/70 text-white hover:border-white hover:bg-white hover:text-[var(--night)]"
            >
              {copy.watch} <span className="arr" aria-hidden="true">↗</span>
            </a>
          </motion.div>

          {!missing && (
            <motion.div aria-hidden="true" className="absolute h-px bg-white/25" style={{ bottom: barBottom, left: labelSide, right: labelSide }}>
              <span className="absolute inset-y-0 left-0 bg-white" style={{ width: `${progress * 100}%` }} />
            </motion.div>
          )}

          {finePointer && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -ml-[52px] -mt-[52px] left-0 top-0 z-10 grid size-[104px] place-items-center rounded-full bg-white text-center text-[0.72rem] font-medium uppercase leading-tight tracking-[0.14em] text-[var(--night)] mix-blend-normal"
              style={{ x: sx, y: sy }}
              animate={{ scale: pointerInside ? 1 : 0, opacity: pointerInside ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <span className="max-w-[72px]">{cursorLabel}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
