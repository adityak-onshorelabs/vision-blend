import type { Belief } from "@/content/types";

/** The studio's own lines from Instagram, set large. Each links to its post. */
export function Beliefs({ beliefs }: { beliefs: Belief[] }) {
  return (
    <ol className="border-t border-border">
      {beliefs.map((b, i) => (
        <li key={b.text}>
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid items-baseline gap-2 border-b border-border py-[clamp(22px,2.6vw,34px)] text-muted-foreground transition-colors duration-400 hover:text-ink focus-visible:text-ink sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-4"
          >
            <span className="relative hidden text-[0.78rem] font-medium text-[var(--faint)] sm:block">
              <span
                aria-hidden="true"
                className="absolute -start-4 top-[0.45em] size-1.5 scale-0 rounded-full bg-brand transition-transform duration-400 group-hover:scale-100 group-focus-visible:scale-100"
              />
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="t-quote text-balance">{b.text}</span>
            <span className="whitespace-nowrap text-[0.88rem] text-[var(--faint)]">{b.date}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
