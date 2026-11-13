"use client";

/*
  "See our work" on an industry page. The industry's portfolio opens only after an enquiry: the
  button opens the enquiry form in a modal dialog, and once the studio has it, the visitor goes on to
  the portfolio. Closing the dialog leaves the portfolio locked; the entries stay if they reopen it.
  The lock itself is on the server (src/lib/gate.ts and src/proxy.ts), so this is only the way in.

  - Already a known lead in this browser (any earlier saved enquiry, for any industry): straight
    to the portfolio, with no form. The work page records the new industry against their lead.
  - Turned away by the proxy (?work=locked): the button with `autoOpen` opens the form at once.
    The "known" flag is cleared first, since the proxy has just said the lead cookie is not valid,
    so the button cannot bounce between the two.
*/
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import type { FormCopy } from "@/content/types";
import { markVisit } from "../portfolio-visit";
import { ProjectForm } from "./project-form";

type Props = {
  copy: FormCopy;
  industry: { slug: string; name: string };
  /** For the "Your industry" dropdown, preset to this page's industry */
  industries?: { slug: string; name: string }[];
  href: string;
  className?: string;
  children: ReactNode;
  autoOpen?: boolean;
};

/** vb_known (src/lib/gate.ts): set with the signed lead cookie, readable here */
const known = () => document.cookie.split("; ").some((c) => c === "vb_known=1");
const forget = () => {
  document.cookie = "vb_known=; path=/; max-age=0; samesite=lax";
};
/** "real estate", but "D2C" stays as it is */
const inSentence = (name: string) => (name === name.toUpperCase() ? name : name.toLowerCase());

export function PortfolioGate({ copy, industry, industries, href, className, children, autoOpen }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  const showForm = () => {
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  const open = () => {
    if (known()) return window.location.assign(href);
    showForm();
  };

  useEffect(() => {
    if (!autoOpen) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("work") !== "locked") return;
    url.searchParams.delete("work");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    forget();
    showForm();
  }, [autoOpen]);

  const onClose = () => {
    document.documentElement.style.overflow = "";
  };

  return (
    <>
      <button type="button" className={className} onClick={open} aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={dialog}
        onClose={onClose}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-intro`}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto max-h-[calc(100dvh-24px)] w-[min(680px,calc(100vw-24px))] overflow-y-auto bg-paper p-0 text-ink backdrop:bg-[oklch(0.13_0.006_40/0.72)] backdrop:backdrop-blur-sm"
      >
        <div className="grid gap-8 p-6 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <div className="grid gap-3">
              <span className="t-label marker">{industry.name}</span>
              <h2 id={`${id}-title`} className="t-h2">
                {copy.portfolio.title}
                <span className="stop">.</span>
              </h2>
              <p id={`${id}-intro`} className="max-w-[44ch] text-muted-foreground">
                {copy.portfolio.intro.replace("{industry}", inSentence(industry.name))}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="grid size-11 shrink-0 place-items-center border border-border transition-colors hover:border-ink"
              aria-label={copy.portfolio.close}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M3 3 L13 13 M13 3 L3 13" />
              </svg>
            </button>
          </div>
          <ProjectForm
            copy={copy}
            kind="portfolio"
            industry={industry}
            industries={industries}
            idPrefix={id}
            onSent={() => {
              markVisit(industry.slug);
              window.location.assign(href);
            }}
          />
        </div>
      </dialog>
    </>
  );
}
