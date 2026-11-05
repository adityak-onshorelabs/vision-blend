"use client";

/*
  For a full-screen photo hero other than the home one (industry pages): the header sits over it,
  transparent with light type, exactly as on the home hero, but with no intro to wait for. Marks
  <html data-intro="done"> while the page shows and "off" when it leaves, since Next keeps the left
  page in the DOM (hidden) and its hero must stop styling the header.
*/
import { useEffect } from "react";

export function HeroHeader() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.intro = "done";
    return () => {
      root.dataset.intro = "off";
    };
  }, []);

  return null;
}
