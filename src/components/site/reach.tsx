import type { ReactNode } from "react";
import type { Content } from "@/content/types";
import { Tbc } from "./section-head";

/** Ways to reach the studio. Unknown details render as TBC until the client confirms them. */
export function Reach({ content: c }: { content: Content }) {
  return (
    <div className="grid gap-6">
      <dl className="border-t border-border">
        <Row k="Instagram">
          <a className="u" href={c.company.instagram} target="_blank" rel="noopener noreferrer">{c.company.instagramHandle}</a>
        </Row>
        <Row k="Website">{c.company.website}</Row>
        <Row k="Email">{c.company.email ?? <>Studio email <Tbc /></>}</Row>
        <Row k="Studio">{c.company.location ?? <>City and address <Tbc /></>}</Row>
      </dl>
      <p className="text-[0.95rem] text-muted-foreground">{c.contactPage.collaborate}</p>
    </div>
  );
}

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-border py-3 text-[0.96rem]">
      <dt className="t-label pt-0.5">{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}
