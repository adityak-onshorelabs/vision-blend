import type { Content } from "@/content/types";

/** How to reach the studio by email: the address and a pre-filled brief in Gmail's web composer. */
export function ContactCard({ content: c }: { content: Content }) {
  const e = c.contactPage.email;
  if (!c.company.email) return null;

  return (
    <div className="grid gap-7">
      <div className="grid gap-3">
        <span className="t-label marker">{e.label}</span>
        <a href={c.company.enquiryGmail} target="_blank" rel="noopener noreferrer" className="t-h2 u justify-self-start break-all">
          {c.company.email}
        </a>
        {c.company.emailCc && (
          <p className="text-[0.94rem] text-muted-foreground">
            {e.ccNote} {c.company.emailCc}
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
