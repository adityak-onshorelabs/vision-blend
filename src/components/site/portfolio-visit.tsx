"use client";

/*
  On an industry's work page: tells the studio that a known lead opened this industry, once per
  industry per browser (/api/portfolio/visit adds it to their existing lead). Renders nothing.
  The enquiry that unlocked the work already names its own industry, so the gate marks that one as
  sent (markVisit) before it navigates here.
*/
import { useEffect } from "react";

const key = (slug: string) => `vb_visit_${slug}`;

export function markVisit(slug: string) {
  try {
    localStorage.setItem(key(slug), "1");
  } catch {}
}

export function PortfolioVisit({ industry }: { industry: string }) {
  useEffect(() => {
    try {
      if (localStorage.getItem(key(industry))) return;
    } catch {}
    fetch("/api/portfolio/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry }),
      keepalive: true,
    })
      .then((res) => res.json())
      .then((out: { ok?: boolean; recorded?: boolean }) => out.ok && out.recorded && markVisit(industry))
      .catch(() => {});
  }, [industry]);

  return null;
}
