"use client";

/*
  Title card shown in the showreel frame until it is fully open. A typographic take on the
  film's opening shot (the FIFA | Paradise Group lockup over an aerial view of the pitch at
  Sai World Empire, Kharghar): a top-down pitch in line that turns slowly with scroll, and the
  lockup set in the site's own type. No third-party logos are reproduced.
*/
import { motion, type MotionValue, useTransform } from "motion/react";

export type CardCopy = { left: string; right: string; place: string; line: string; hint: string };

export function ShowreelCard({ copy, progress, visible, reduce }: { copy: CardCopy; progress: MotionValue<number>; visible: boolean; reduce: boolean | null }) {
  const rotate = useTransform(progress, [0, 0.5], reduce ? [0, 0] : [-14, 0]);
  const scale = useTransform(progress, [0, 0.5], reduce ? [1.15, 1.15] : [1, 1.35]);

  return (
    <motion.div
      aria-hidden={!visible}
      className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Aerial pitch */}
      <motion.svg viewBox="0 0 400 260" className="absolute h-[120%] w-auto max-w-none text-white" style={{ rotate, scale }} aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1">
          <rect x="20" y="20" width="360" height="220" />
          <path d="M200 20 V240" />
          <circle cx="200" cy="130" r="36" />
          <rect x="20" y="78" width="54" height="104" />
          <rect x="20" y="104" width="20" height="52" />
          <rect x="326" y="78" width="54" height="104" />
          <rect x="360" y="104" width="20" height="52" />
          <path d="M74 106 A26 26 0 0 1 74 154 M326 106 A26 26 0 0 0 326 154" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${20 + i * 60} 20 V240`} strokeOpacity="0.05" />
          ))}
        </g>
      </motion.svg>

      <div className="relative grid justify-items-center gap-6 px-6 text-center text-white">
        <div className="flex items-center gap-[clamp(14px,2.4vw,32px)]">
          <span className="text-[clamp(2.8rem,1.6rem+5vw,6.5rem)] font-semibold leading-none tracking-[-0.02em]">{copy.left}</span>
          <span aria-hidden="true" className="h-[clamp(48px,7vw,104px)] w-px bg-white/60" />
          <span className="grid justify-items-start text-start">
            <span className="text-[clamp(1.5rem,0.9rem+2.6vw,3.4rem)] font-light leading-[1.02] tracking-[-0.02em]">{copy.right}</span>
            <span className="mt-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/70">{copy.place}</span>
          </span>
        </div>
        <p className="t-lead max-w-[34ch] text-white/80">{copy.line}</p>
        <span className="t-label !text-white/60">{copy.hint}</span>
      </div>
    </motion.div>
  );
}
