"use client";

/*
  Hero behaviour that needs JS: ends the intro (marks <html data-intro="done"> so the intro layer
  is removed), skips it on any input, and moves a soft light after the pointer on the copper
  background. The intro plays again whenever the home page shows, on a reload or on client-side
  navigation back to it. Leaving sets data-intro="off": Next keeps the left page in the DOM
  (hidden), and "off" stops that hidden hero from styling the header.
*/
import { useEffect } from "react";

const INTRO_MS = 3500;

export function HeroMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const done = () => {
      root.dataset.intro = "done";
    };

    root.dataset.intro = matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "play";

    const cleanups: (() => void)[] = [
      () => {
        root.dataset.intro = "off";
      },
    ];

    if (root.dataset.intro === "play") {
      // The intro is a full-screen moment: start at the top instead of the restored scroll position
      const restoration = history.scrollRestoration;
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
      cleanups.push(() => {
        history.scrollRestoration = restoration;
      });

      const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
      const timer = setTimeout(done, INTRO_MS);
      const skip = () => {
        clearTimeout(timer);
        done();
        events.forEach((e) => window.removeEventListener(e, skip));
      };
      events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
      cleanups.push(() => {
        clearTimeout(timer);
        events.forEach((e) => window.removeEventListener(e, skip));
      });
    }

    // Pointer light, fine pointers only
    if (hero && matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let frame = 0;
      const move = (e: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = hero.getBoundingClientRect();
          hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
          hero.style.setProperty("--my", `${e.clientY - r.top}px`);
          hero.dataset.glow = "on";
        });
      };
      const leave = () => {
        hero.dataset.glow = "off";
      };
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", leave);
      });
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
