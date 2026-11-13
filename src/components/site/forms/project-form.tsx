"use client";

/*
  The compact enquiry: Name, Email, Phone number, Your business, Your industry, and an optional note.
  - kind "project": "Start a project" on home and contact. The visitor picks their industry (or
    Other); on contact, ?industry=<slug> from an industry page picks it for them.
  - kind "portfolio": the gate in front of an industry's work (portfolio-gate.tsx). The industry is
    sent automatically; the studio must have the enquiry before the portfolio opens.
*/
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import type { FormCopy } from "@/content/types";
import { isBusinessEmail, isPhone } from "@/lib/enquiry";
import { Check, Field, Honeypot, Select, Sent, Submit, TextArea, focusFirstError, useSubmit } from "./kit";

type Industry = { slug: string; name: string };
const noSubscribe = () => () => {};
/** The value sent for "Other / not sure yet" */
export const OTHER_INDUSTRY = "other";
type Data = { name: string; email: string; phone: string; business: string; about: string; website: string };
type Errors = Partial<Record<"name" | "email" | "phone" | "business" | "industry", string>>;

type Props = {
  copy: FormCopy;
  kind?: "project" | "portfolio";
  /** The industry this enquiry is for (always set for a portfolio) */
  industry?: Industry;
  /** The industries to choose from (project kind); ?industry=<slug> preselects one of them */
  industries?: Industry[];
  /** Runs once the studio has the enquiry (the gate opens the portfolio) */
  onSent?: () => void;
  /** Shown under the thank-you (project kind) */
  sentExtra?: ReactNode;
  idPrefix?: string;
};

export function ProjectForm({ copy, kind = "project", industry, industries, onSent, sentExtra, idPrefix = "p" }: Props) {
  const [data, setData] = useState<Data>({ name: "", email: "", phone: "", business: "", about: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const form = useRef<HTMLFormElement>(null);
  const { status, send, busy, check } = useSubmit(kind, onSent);
  // ?industry=<slug> (read in the browser only, so the page itself stays static)
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const fromUrl = useMemo(() => {
    const slug = new URLSearchParams(search).get("industry");
    return industries?.find((s) => s.slug === slug);
  }, [search, industries]);
  // The visitor's pick; until they choose, the industry page they came from
  const [picked, setPicked] = useState<string | null>(null);
  const choosing = kind === "project" && !!industries?.length;
  const chosen = picked ?? fromUrl?.slug ?? "";
  const forIndustry = industry ?? (choosing ? industries.find((s) => s.slug === chosen) : fromUrl);
  const otherLabel = copy.project.industryOther;
  const industryLabel = (slug: string) => (slug === OTHER_INDUSTRY ? otherLabel : industries?.find((s) => s.slug === slug)?.name ?? "");

  const set = <K extends keyof Data>(key: K, value: Data[K]) => setData((d) => ({ ...d, [key]: value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = copy.errors.name;
    if (!isBusinessEmail(data.email)) e.email = copy.errors.businessEmail;
    if (!isPhone(data.phone)) e.phone = copy.errors.phone;
    if (!data.business.trim()) e.business = copy.errors.business;
    if (choosing && !chosen) e.industry = copy.errors.industry;
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (busy) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(form.current);
    const slug = forIndustry?.slug ?? (chosen === OTHER_INDUSTRY ? OTHER_INDUSTRY : "");
    send({ fields: { ...data, ...(slug ? { industry: slug } : {}) } });
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
      {kind === "project" && !choosing && forIndustry && (
        <p className="t-label marker !text-ink">
          {forIndustry.name}
        </p>
      )}
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
        <Field id={id("name")} required label={copy.labels.name} error={errors.name} value={data.name} onChange={(v) => set("name", v)} autoComplete="name" />
        <Field id={id("email")} required label={copy.labels.email} error={errors.email} value={data.email} onChange={(v) => set("email", v)} autoComplete="email" type="email" inputMode="email" />
        <Field id={id("phone")} required label={copy.labels.phone} error={errors.phone} value={data.phone} onChange={(v) => set("phone", v)} autoComplete="tel" type="tel" inputMode="tel" />
        <Field id={id("business")} required label={copy.labels.business} error={errors.business} value={data.business} onChange={(v) => set("business", v)} autoComplete="organization" />
        {choosing && (
          <Select
            id={id("industry")}
            className="sm:col-span-2"
            label={copy.labels.industry}
            placeholder={copy.placeholders.industry}
            error={errors.industry}
            options={[...industries.map((s) => s.name), otherLabel]}
            value={industryLabel(chosen)}
            onChange={(name) => setPicked(name === otherLabel ? OTHER_INDUSTRY : industries.find((s) => s.name === name)?.slug ?? "")}
          />
        )}
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
