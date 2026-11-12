"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { FormCopy } from "@/content/types";
import { CV_ACCEPT, CV_MAX_BYTES, CV_TYPES, DISCIPLINES, EMAIL_RE, OPPORTUNITIES, PORTFOLIO_OPTIONAL, isPhone } from "@/lib/enquiry";
import { cn } from "@/lib/utils";
import { Check, Chips, Field, FieldError, Honeypot, Select, Sent, Submit, focusFirstError, useSubmit } from "./kit";

type Data = { name: string; email: string; phone: string; city: string; discipline: string; opportunity: string; portfolio: string; website: string };
type Key = "name" | "email" | "phone" | "city" | "discipline" | "opportunity" | "portfolio" | "cv";

const isUrl = (v: string) => {
  try {
    return ["http:", "https:"].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

/** The application on Careers: details, discipline, opportunity, work link and CV (sent as an attachment) */
export function CareersForm({ copy }: { copy: FormCopy }) {
  const [data, setData] = useState<Data>({ name: "", email: "", phone: "", city: "", discipline: "", opportunity: "", portfolio: "", website: "" });
  const [cv, setCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const form = useRef<HTMLFormElement>(null);
  const { status, send, busy, check } = useSubmit("careers");
  const set = <K extends keyof Data>(key: K, value: Data[K]) => setData((d) => ({ ...d, [key]: value }));
  const portfolioRequired = data.discipline !== PORTFOLIO_OPTIONAL;

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (busy) return;
    const e: Partial<Record<Key, string>> = {};
    if (!data.name.trim()) e.name = copy.errors.name;
    if (!EMAIL_RE.test(data.email.trim())) e.email = copy.errors.email;
    if (!isPhone(data.phone)) e.phone = copy.errors.phone;
    if (!data.city.trim()) e.city = copy.errors.city;
    if (!data.discipline) e.discipline = copy.errors.discipline;
    if (!data.opportunity) e.opportunity = copy.errors.opportunity;
    const link = data.portfolio.trim();
    if ((portfolioRequired || link) && !isUrl(link)) e.portfolio = copy.errors.portfolio;
    if (!cv || !CV_TYPES[cv.type]) e.cv = copy.errors.cv;
    else if (cv.size > CV_MAX_BYTES) e.cv = copy.errors.cvSize;
    setErrors(e);
    if (Object.keys(e).length || !cv) return focusFirstError(form.current);
    send({ fields: { ...data, portfolio: link }, file: cv });
  };

  if (status === "sent") return <Sent title={copy.careers.sentTitle} text={copy.careers.sent} />;

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative grid gap-8">
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
        <Field id="c-name" required label={copy.labels.name} error={errors.name} value={data.name} onChange={(v) => set("name", v)} autoComplete="name" />
        <Field id="c-email" required label={copy.labels.email} error={errors.email} value={data.email} onChange={(v) => set("email", v)} autoComplete="email" type="email" inputMode="email" />
        <Field id="c-phone" required label={copy.labels.phone} error={errors.phone} value={data.phone} onChange={(v) => set("phone", v)} autoComplete="tel" type="tel" inputMode="tel" />
        <Field id="c-city" required label={copy.labels.city} error={errors.city} value={data.city} onChange={(v) => set("city", v)} autoComplete="address-level2" />
        <Select
          id="c-discipline"
          label={copy.labels.discipline}
          placeholder="Select a discipline"
          options={DISCIPLINES}
          value={data.discipline}
          onChange={(v) => set("discipline", v)}
          error={errors.discipline}
          className="sm:col-span-2"
        />
      </div>
      <Chips name="opportunity" label={copy.labels.opportunity} options={OPPORTUNITIES} value={data.opportunity} onChange={(v) => set("opportunity", v)} error={errors.opportunity} />
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
        <Field
          id="c-portfolio"
          required={portfolioRequired}
          optionalLabel={copy.optional}
          label={copy.labels.portfolio}
          placeholder={copy.placeholders.portfolio}
          error={errors.portfolio}
          value={data.portfolio}
          onChange={(v) => set("portfolio", v)}
          type="url"
          inputMode="url"
          autoComplete="url"
        />
        <div className="grid min-w-0 content-start gap-1">
          <label htmlFor="c-cv" className="t-label">{copy.labels.cv}</label>
          <input
            id="c-cv"
            type="file"
            accept={CV_ACCEPT}
            required
            aria-required
            aria-invalid={errors.cv ? true : undefined}
            aria-describedby={errors.cv ? "c-cv-hint c-cv-err" : "c-cv-hint"}
            onChange={(e) => setCv(e.target.files?.[0] ?? null)}
            className={cn(
              "field-input cursor-pointer text-[0.95rem] file:me-4 file:cursor-pointer file:border file:border-solid file:border-ink file:bg-transparent file:px-4 file:py-2 file:font-[inherit] file:text-[0.88rem] file:text-ink hover:file:bg-ink hover:file:text-paper",
            )}
          />
          <span id="c-cv-hint" className="text-[0.82rem] text-muted-foreground">{copy.cvHint}</span>
          {errors.cv && <FieldError id="c-cv-err">{errors.cv}</FieldError>}
        </div>
        <Honeypot value={data.website} onChange={(v) => set("website", v)} />
      </div>
      <Check copy={copy} check={check} />
      <Submit copy={copy} status={status} busy={busy} label={copy.careers.submit} />
    </form>
  );
}
