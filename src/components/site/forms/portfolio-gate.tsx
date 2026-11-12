"use client";

/*
  "See our work" on an industry page. The industry's portfolio opens only after an enquiry: the
  button opens the enquiry form in a modal dialog, and once the studio has it, the visitor goes on to
  the portfolio. Closing the dialog leaves the portfolio locked; the entries stay if they reopen it.
  The lock itself is on the server (src/lib/gate.ts and src/proxy.ts), so this is only the way in.

  - Already unlocked this session (the industry's cookie is there): straight to the portfolio.
  - Turned away by the proxy (?work=locked): the button with `autoOpen` opens the form at once.
*/
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import type { FormCopy } from "@/content/types";
import { ProjectForm } from "./project-form";

type Props = {
  copy: FormCopy;
  industry: { slug: string; name: string };
  href: string;
  className?: string;
  children: ReactNode;
  autoOpen?: boolean;
};

const unlocked = (slug: string) => document.cookie.split("; ").some((c) => c.startsWith(`vb_work_${slug}=`));
/** "real estate", but "D2C" stays as it is */
const inSentence = (name: string) => (name === name.toUpperCase() ? name : name.toLowerCase());

export function PortfolioGate({ copy, industry, href, className, children, autoOpen }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  const open = () => {
    if (unlocked(industry.slug)) return window.location.assign(href);
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  useEffect(() => {
    if (!autoOpen) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("work") !== "locked") return;
    url.searchParams.delete("work");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <ProjectForm copy={copy} kind="portfolio" industry={industry} idPrefix={id} onSent={() => window.location.assign(href)} />
        </div>
      </dialog>
    </>
  );
}
