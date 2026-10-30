"use client";

/*
  Cloudflare Turnstile without Cloudflare's box. The widget runs with appearance "interaction-only",
  so most visitors never see it; our own line-and-dot status stands in for it. The line scans while
  Turnstile works and the dot (the site's full stop) turns brown once a token arrives. Cloudflare's
  checkbox only shows, framed by our hairlines, when it wants a real interaction.
*/
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content/types";

type Copy = Content["contactPage"]["form"]["verify"];
type State = "checking" | "interactive" | "verified" | "error";
type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

/** Public site key. Development falls back to Cloudflare's always-pass test key. */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV === "development" ? "1x00000000000000000000AA" : "");

let loader: Promise<Turnstile> | undefined;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loader ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
    script.onerror = () => {
      script.remove();
      loader = undefined;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return loader;
}

/** Remount (change its `key`) to get a fresh token, e.g. after a failed send: tokens are single use. */
export function HumanCheck({ copy, onToken, onRetry }: { copy: Copy; onToken: (token: string | null) => void; onRetry: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const tokenRef = useRef(onToken);
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    tokenRef.current = onToken;
  });

  useEffect(() => {
    let cancelled = false;
    let id: string | undefined;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !box.current) return;
        id = ts.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          theme: "light",
          size: "flexible",
          callback: (token: string) => {
            setState("verified");
            tokenRef.current(token);
          },
          "expired-callback": () => {
            setState("checking");
            tokenRef.current(null);
          },
          "error-callback": () => {
            setState("error");
            tokenRef.current(null);
          },
          "before-interactive-callback": () => setState("interactive"),
          "after-interactive-callback": () => setState((s) => (s === "interactive" ? "checking" : s)),
        });
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
      tokenRef.current(null);
    };
  }, []);

  return (
    <div className="grid gap-4">
      <div className="verify" data-state={state}>
        <span role="status" className={state === "error" ? "text-destructive" : undefined}>
          {copy[state]}
        </span>
        {state === "error" ? (
          <button type="button" className="u shrink-0" onClick={onRetry}>
            {copy.retry}
          </button>
        ) : (
          <>
            <span className="verify-line" aria-hidden="true" />
            <span className="verify-dot" aria-hidden="true" />
          </>
        )}
      </div>
      <div ref={box} className={state === "interactive" ? "verify-well" : undefined} />
    </div>
  );
}
