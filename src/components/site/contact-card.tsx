import { Fragment } from "react";
import type { Content } from "@/content/types";

/** How to reach the studio by email: the address and a pre-filled brief in Gmail's web composer. */
export function ContactCard({ content: c }: { content: Content }) {
  const e = c.contactPage.email;
  if (!c.company.email) return null;
  const [user, domain] = c.company.email.split("@");

  return (
    <div className="grid gap-7">
      <div className="grid gap-3">
        <span className="t-label marker">{e.label}</span>
        <a href={c.company.enquiryGmail} target="_blank" rel="noopener noreferrer" className="t-h2 u justify-self-start [overflow-wrap:anywhere]">
          {/* On narrow screens the address wraps at the @, not mid-word */}
          {user}
          <wbr />@{domain}
        </a>
        {c.company.emailCc && (
          <p className="text-[0.94rem] text-muted-foreground">
            {e.ccNote} {c.company.emailCc}
          </p>
        )}
        {c.company.phones.length > 0 && (
          <p className="text-[0.94rem] text-muted-foreground">
            {e.phone}{" "}
            {c.company.phones.map((p, i) => (
              <Fragment key={p.number}>
                {i > 0 && " or "}
                {p.name} on{" "}
                <a href={`tel:${p.number.replace(/[^\d+]/g, "")}`} className="u whitespace-nowrap text-ink">
                  {p.number}
                </a>
              </Fragment>
            ))}
          </p>
        )}
      </div>
      <a href={c.company.enquiryGmail} target="_blank" rel="noopener noreferrer" className="cta justify-self-start">
        {e.gmail} <span className="arr" aria-hidden="true">↗</span>
      </a>
      <p className="max-w-[46ch] text-[0.94rem] text-muted-foreground">{e.hint}</p>
    </div>
  );
}
