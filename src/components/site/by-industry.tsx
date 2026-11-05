"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Picks the server-rendered variant for `?industry=<slug>` (set by the industry pages' "Start a
 * project" links), or the default children. Reading the query here, inside a Suspense boundary,
 * keeps the rest of the contact page prerendered.
 */
export function ByIndustry({ variants, children }: { variants: Record<string, ReactNode>; children: ReactNode }) {
  const slug = useSearchParams().get("industry");
  return <>{(slug && Object.hasOwn(variants, slug) && variants[slug]) || children}</>;
}
