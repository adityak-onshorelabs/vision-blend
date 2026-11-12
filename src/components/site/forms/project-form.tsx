"use client";

/*
  The compact enquiry: Name, Email, Phone number, Your business, and an optional note.
  - kind "project": "Start a project" on home and contact. On contact it picks up ?industry=<slug>
    from an industry page, names the industry, and sends it with the enquiry.
  - kind "portfolio": the gate in front of an industry's work (portfolio-gate.tsx). The industry is
    sent automatically; the studio must have the enquiry before the portfolio opens.
*/
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import type { FormCopy } from "@/content/types";
import { isBusinessEmail, isPhone } from "@/lib/enquiry";
import { Check, Field, Honeypot, Sent, Submit, TextArea, focusFirstError, useSubmit } from "./kit";

type Industry = { slug: string; name: string };
const noSubscribe = () => () => {};
type Data = { name: string; email: string; phone: string; business: string; about: string; website: string };
type Errors = Partial<Record<"name" | "email" | "phone" | "business", string>>;

type Props = {
  copy: FormCopy;
  kind?: "project" | "portfolio";
  /** The industry this enquiry is for (always set for a portfolio) */
  industry?: Industry;
  /** Contact page: take the industry from ?industry=<slug> when it is one of these */
  industriesFromUrl?: Industry[];
  /** Runs once the studio has the enquiry (the gate opens the portfolio) */
  onSent?: () => void;
  /** Shown under the thank-you (project kind) */
  sentExtra?: ReactNode;
  idPrefix?: string;
};

export function ProjectForm({ copy, kind = "project", industry, industriesFromUrl, onSent, sentExtra, idPrefix = "p" }: Props) {
  const [data, setData] = useState<Data>({ name: "", email: "", phone: "", business: "", about: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const form = useRef<HTMLFormElement>(null);
  const { status, send, busy, check } = useSubmit(kind, onSent);
  // ?industry=<slug> (read in the browser only, so the page itself stays static)
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const fromUrl = useMemo(() => {
    const slug = new URLSearchParams(search).get("industry");
    return industriesFromUrl?.find((s) => s.slug === slug);
  }, [search, industriesFromUrl]);
  const forIndustry = industry ?? fromUrl;

  const set = <K extends keyof Data>(key: K, value: Data[K]) => setData((d) => ({ ...d, [key]: value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = copy.errors.name;
    if (!isBusinessEmail(data.email)) e.email = copy.errors.businessEmail;
    if (!isPhone(data.phone)) e.phone = copy.errors.phone;
    if (!data.business.trim()) e.business = copy.errors.business;
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (busy) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(form.current);
    send({ fields: { ...data, ...(forIndustry ? { industry: forIndustry.slug } : {}) } });
  };

  if (status === "sent") {
    if (kind === "portfolio") {
      return (
        <p role="status" className="t-lead">
          {copy.portfolio.opening}
          <span className="stop">.</span>
        </p>
      );
    }
    return (
      <Sent title={copy.project.sentTitle} text={copy.project.sent}>
        {sentExtra}
      </Sent>
    );
  }

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative grid gap-8">
      {kind === "project" && forIndustry && (
        <p className="t-label marker !text-ink">
          {forIndustry.name}
        </p>
      )}
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
        <Field id={id("name")} required label={copy.labels.name} error={errors.name} value={data.name} onChange={(v) => set("name", v)} autoComplete="name" />
        <Field id={id("email")} required label={copy.labels.email} error={errors.email} value={data.email} onChange={(v) => set("email", v)} autoComplete="email" type="email" inputMode="email" />
        <Field id={id("phone")} required label={copy.labels.phone} error={errors.phone} value={data.phone} onChange={(v) => set("phone", v)} autoComplete="tel" type="tel" inputMode="tel" />
        <Field id={id("business")} required label={copy.labels.business} error={errors.business} value={data.business} onChange={(v) => set("business", v)} autoComplete="organization" />
        <TextArea
          id={id("about")}
          className="sm:col-span-2"
          label={copy.labels.about}
          optionalLabel={copy.optional}
          placeholder={copy.placeholders.about}
          value={data.about}
          onChange={(v) => set("about", v)}
        />
        <Honeypot value={data.website} onChange={(v) => set("website", v)} />
      </div>
      <Check copy={copy} check={check} />
      <Submit copy={copy} status={status} busy={busy} label={kind === "portfolio" ? copy.portfolio.submit : copy.project.submit} />
    </form>
  );
}
