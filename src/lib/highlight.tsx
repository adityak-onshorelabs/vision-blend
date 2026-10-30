import { Fragment, type ReactNode } from "react";

/**
 * Renders a content title, turning *key words* (wrapped in asterisks in src/content) into the
 * brown highlight (`.hl`). Titles without asterisks come back unchanged.
 */
/** The same title as plain text (labels, aria), without the highlight markers. */
export const plain = (text: string) => text.replace(/\*/g, "");

export function hl(text: string): ReactNode {
  const parts = text.split(/\*([^*]+)\*/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 ? (
      <em key={i} className="hl">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
