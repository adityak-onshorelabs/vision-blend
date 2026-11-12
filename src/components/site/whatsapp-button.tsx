"use client";

/*
  "Get in touch" on WhatsApp, fixed to the bottom corner of every page. It steps aside (fades out and
  leaves the tab order) whenever a form or a video player reaches the lower part of the screen, so it
  never sits over a field, a submit button or video controls. Mark anything else it should avoid with
  data-wa-avoid.
*/
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AVOID = "form, video[controls], [data-wa-avoid]";

export function WhatsAppButton({ label, name, url }: { label: string; name: string; url: string }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const inZone = new Set<Element>();
    let timer = 0;
    // Only the bottom third of the screen counts: that is where the button sits
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inZone.add(e.target);
          else inZone.delete(e.target);
        }
        setHidden(inZone.size > 0);
      },
      { rootMargin: "-66% 0px 0px 0px" },
    );
    const watch = () => {
      io.disconnect();
      inZone.clear();
      let watched = 0;
      document.querySelectorAll(AVOID).forEach((el) => {
        // Hidden pages Next keeps in the DOM, and closed dialogs, take no space
        if ((el as HTMLElement).offsetParent === null && el.tagName !== "VIDEO") return;
        io.observe(el);
        watched++;
      });
      // The observer reports every watched element once, straight away; with none, show the button
      if (!watched) setHidden(false);
    };
    watch();
    // Forms mount late (sent states, client components): look again when the page changes
    const mo = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(watch, 200);
    });
    mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: message ${name} on WhatsApp`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "fixed bottom-4 end-4 z-40 inline-flex min-h-12 items-center gap-2.5 border border-white/15 bg-night px-4 text-[0.92rem] text-[var(--on-night)] shadow-[0_8px_24px_oklch(0.13_0.006_40/0.25)] transition-[opacity,translate,background-color] duration-300 ease-[var(--ease)] hover:bg-brand sm:bottom-6 sm:end-6",
        hidden && "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0 text-[#25D366]" fill="currentColor">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43M20.08 3.9A11.3 11.3 0 0 0 12.05.58C5.8.58.7 5.67.7 11.93c0 2 .52 3.95 1.52 5.67L.6 23.5l6.03-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.03" />
      </svg>
      <span>{label}</span>
    </a>
  );
}
