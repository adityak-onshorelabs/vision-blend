/*
  The studio's headline figures ("*10,000+* content pieces created"): the starred part is the large
  brown figure, the rest its label. Shared by the Industries overview headline and the strip under
  the client logos on Home. The figures live in industriesPage.stats (src/content/en.ts).
*/
import { cn } from "@/lib/utils";

export function StatFigure({ text }: { text: string }) {
  const m = text.match(/^\*([^*]+)\*\s*(.*)$/);
  if (!m) return <span className="t-h2">{text}</span>;
  return (
    <>
      <span className="t-h1 text-brand">{m[1]}</span>{" "}
      <span className="t-lead">{m[2]}</span>
    </>
  );
}

/** One cell of the three-up figures row: ruled between cells from md, stacked with rules below */
export const statCell =
  "grid content-start gap-2 border-b border-border py-6 md:border-b-0 md:border-s md:px-6 md:py-8 md:first:border-s-0 md:first:ps-0";

/** The figures as a list (Home); the Industries page sets them as its h1 instead */
export function StatsRow({ stats, className }: { stats: string[]; className?: string }) {
  return (
    <ul aria-label="Vision Blend in numbers" className={cn("grid border-t border-border md:grid-cols-3", className)}>
      {stats.map((s) => (
        <li key={s} className={statCell}>
          <StatFigure text={s} />
        </li>
      ))}
    </ul>
  );
}
