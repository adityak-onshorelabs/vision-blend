"use client";

/*
  Showreel using Instagram's own player, for when the MP4 is not in public/videos yet.
  Same opening as <Showreel>: as the section scrolls through, a sticky night panel opens from a
  framed window to full bleed (clip-path on native scroll). Inside, the film (the official embed
  cropped to its 16:9 media) grows from 78% to full size. The title sits over it and fades and
  lifts away as the frame opens, so the player is clear to press play. The title never takes
  pointer events, so the embed is always clickable. Reduced motion: opened, no movement.
*/
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { InstagramMedia } from "./instagram-media";
import type { ShowreelCopy } from "./showreel";

export function ShowreelEmbed({ copy }: { copy: ShowreelCopy }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  const inset = useTransform(scrollYProgress, [0, 0.5], reduce ? [0, 0] : [14, 0]);
  const insetX = useTransform(inset, (v) => v * 1.4);
  const clipPath = useMotionTemplate`inset(${inset}% ${insetX}% ${inset}% ${insetX}%)`;
  const filmScale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [0.78, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.4], reduce ? [0, 0] : [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.4], reduce ? [0, 0] : [0, -60]);
  const labelTop = useMotionTemplate`max(calc(${inset}% + 20px), 92px)`;
  const labelBottom = useMotionTemplate`calc(${inset}% + 20px)`;
  const labelSide = useMotionTemplate`calc(${insetX}% + 20px)`;

  return (
    <section ref={wrap} aria-labelledby="reel-title" className="relative h-[200vh] bg-paper max-md:h-[150vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0 bg-night" style={{ clipPath }}>
          {/* The film, sized to fit between the header and the bottom controls. */}
          <div className="absolute inset-x-0 top-[72px] bottom-[84px] grid place-items-center px-4 md:px-10">
            <motion.div className="w-[min(100%,calc((100svh-176px)*16/9))]" style={{ scale: filmScale }}>
              <InstagramMedia url={copy.instagram} kind="landscape" title={`${copy.title}, ${copy.sub}`} />
            </motion.div>
          </div>

          <motion.div className="absolute flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/85" style={{ top: labelTop, left: labelSide }}>
            <span className="size-1.5 rounded-full bg-[var(--brand-soft)]" />
            {copy.label}
          </motion.div>
          <motion.div className="absolute text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/85" style={{ top: labelTop, right: labelSide }}>
            {copy.date}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 grid place-items-center bg-black/35 px-6 text-center text-white"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <div className="grid justify-items-center gap-3">
              <h2 id="reel-title" className="t-display text-white">
                {copy.title}
                <span className="text-[var(--brand-soft)]">.</span>
              </h2>
              <p className="t-lead text-white/80">{copy.sub}</p>
              <span className="t-label mt-2 !text-white/70">Scroll to open the film</span>
            </div>
          </motion.div>

          <motion.div className="absolute flex flex-wrap items-center gap-3" style={{ bottom: labelBottom, left: labelSide }}>
            <a
              href={copy.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cta cta-sm cta-line border-white/70 text-white hover:border-white hover:bg-white hover:text-[var(--night)]"
            >
              {copy.watch} <span className="arr" aria-hidden="true">↗</span>
            </a>
            <span className="text-[0.86rem] text-white/70">{copy.sub}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
