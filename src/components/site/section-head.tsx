import type { ReactNode } from "react";

type Props = {
  label: string;
  index?: number;
  total?: number;
  title: ReactNode;
  text?: ReactNode;
  id: string;
  as?: "h1" | "h2";
};

/** Index row ("02 / 06") plus the section title and its side note. */
export function SectionHead({ label, index, total, title, text, id, as: Tag = "h2" }: Props) {
  return (
    <>
      <div className="index-row">
        <span className="t-label marker">{label}</span>
        {index !== undefined && total !== undefined && (
          <span className="count" aria-hidden="true">
            <b>{String(index).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="s-head">
        <Tag id={id} className={Tag === "h1" ? "t-h1" : "t-h2"}>
          {title}
          <span className="stop">.</span>
        </Tag>
        {text && <p>{text}</p>}
      </div>
    </>
  );
}

export function Tbc({ children = "TBC" }: { children?: ReactNode }) {
  return <span className="tbc">{children}</span>;
}
