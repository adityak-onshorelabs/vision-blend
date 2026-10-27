"use client";

/*
  Showreel using Instagram's own player, for when the MP4 is not in public/videos yet.
  Same opening as <Showreel>: as the section scrolls through, a sticky night panel opens from a
  framed window to full bleed (clip-path on native scroll). Until it is fully open the frame
  shows the title card (FIFA | Sai World Empire); the player stays hidden and unclickable.
  Once open, the card fades out and the player fades in. Instagram's player cannot be started
  from this page (it is a cross-origin frame), so a "Press play" hint points at it; the
  self-hosted <Showreel> autoplays instead. Reduced motion: opened, no movement.
*/
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { InstagramMedia } from "./instagram-media";
import type { ShowreelCopy } from "./showreel";
import { ShowreelCard } from "./showreel-card";

const OPEN_AT = 0.5;

export function ShowreelEmbed({ copy }: { copy: ShowreelCopy }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const [open, setOpen] = useState(!!reduce);

  // Open once the frame reaches full bleed; close again a little earlier when scrolling back.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    setOpen((o) => (o ? v > OPEN_AT - 0.06 : v >= OPEN_AT));
  });

  const inset = useTransform(scrollYProgress, [0, OPEN_AT], reduce ? [0, 0] : [14, 0]);
  const insetX = useTransform(inset, (v) => v * 1.4);
  const clipPath = useMotionTemplate`inset(${inset}% ${insetX}% ${inset}% ${insetX}%)`;
  const labelTop = useMotionTemplate`max(calc(${inset}% + 20px), 92px)`;
  const labelBottom = useMotionTemplate`calc(${inset}% + 20px)`;
  const labelSide = useMotionTemplate`calc(${insetX}% + 20px)`;

  return (
    <section ref={wrap} aria-labelledby="reel-title" className="relative h-[200vh] bg-paper max-md:h-[150vh]">
      <h2 id="reel-title" className="sr-only">
        {copy.title}, {copy.sub}
      </h2>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0 bg-night" style={{ clipPath }}>
          {/* The film: loaded early, revealed only when the frame is fully open. */}
          <motion.div
            className="absolute inset-x-0 top-[72px] bottom-[84px] grid place-items-center px-4 md:px-10"
            initial={false}
            animate={{ opacity: open ? 1 : 0, scale: open || reduce ? 1 : 0.96 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: open ? "auto" : "none" }}
            aria-hidden={!open}
          >
            <div className="w-[min(100%,calc((100svh-176px)*16/9))]">
              <InstagramMedia url={copy.instagram} kind="landscape" title={`${copy.title}, ${copy.sub}`} />
            </div>
          </motion.div>

          <ShowreelCard copy={copy.card} progress={scrollYProgress} visible={!open} reduce={reduce} />

          <AnimatePresence>
            {open && !reduce && (
              <motion.span
                key="hint"
                className="pointer-events-none absolute left-1/2 top-[96px] -translate-x-1/2 bg-white px-3 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--night)]"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: [0, 1, 1, 0], y: 0 }}
                transition={{ duration: 4, times: [0, 0.1, 0.8, 1] }}
              >
                {copy.pressPlay}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.div className="absolute flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/85" style={{ top: labelTop, left: labelSide }}>
            <span className="size-1.5 rounded-full bg-[var(--brand-soft)]" />
            {copy.label}
          </motion.div>
          <motion.div className="absolute text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/85" style={{ top: labelTop, right: labelSide }}>
            {copy.date}
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
            <span className="text-[0.86rem] text-white/70">
              {copy.title}. {copy.sub}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
