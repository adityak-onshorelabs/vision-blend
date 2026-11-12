"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { FormCopy } from "@/content/types";
import { EMAIL_RE, PARTNER_TYPES, isPhone } from "@/lib/enquiry";
import { Check, Chips, Field, Honeypot, Sent, Submit, TextArea, focusFirstError, useSubmit } from "./kit";

type Data = { name: string; company: string; email: string; phone: string; type: string; about: string; website: string };
type Errors = Partial<Record<"name" | "company" | "email" | "phone" | "type" | "about", string>>;

/** Partner with us: the enquiry, sent with its partnership type */
export function PartnerForm({ copy }: { copy: FormCopy }) {
  const [data, setData] = useState<Data>({ name: "", company: "", email: "", phone: "", type: "", about: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const form = useRef<HTMLFormElement>(null);
  const { status, send, busy, check } = useSubmit("partner");
  const set = <K extends keyof Data>(key: K, value: Data[K]) => setData((d) => ({ ...d, [key]: value }));

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (busy) return;
    const e: Errors = {};
    if (!data.name.trim()) e.name = copy.errors.name;
    if (!data.company.trim()) e.company = copy.errors.company;
    if (!EMAIL_RE.test(data.email.trim())) e.email = copy.errors.email;
    if (!isPhone(data.phone)) e.phone = copy.errors.phone;
    if (!data.type) e.type = copy.errors.partnerType;
    if (!data.about.trim()) e.about = copy.errors.opportunityAbout;
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(form.current);
    send({ fields: data });
  };

  if (status === "sent") return <Sent title={copy.partner.sentTitle} text={copy.partner.sent} />;

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative grid gap-8">
      <Chips name="type" label={copy.labels.partnerType} options={PARTNER_TYPES} value={data.type} onChange={(v) => set("type", v)} error={errors.type} />
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
        <Field id="pt-name" required label={copy.labels.name} error={errors.name} value={data.name} onChange={(v) => set("name", v)} autoComplete="name" />
        <Field id="pt-company" required label={copy.labels.company} error={errors.company} value={data.company} onChange={(v) => set("company", v)} autoComplete="organization" />
        <Field id="pt-email" required label={copy.labels.email} error={errors.email} value={data.email} onChange={(v) => set("email", v)} autoComplete="email" type="email" inputMode="email" />
        <Field id="pt-phone" required label={copy.labels.phone} error={errors.phone} value={data.phone} onChange={(v) => set("phone", v)} autoComplete="tel" type="tel" inputMode="tel" />
        <TextArea id="pt-about" required className="sm:col-span-2" label={copy.labels.opportunityAbout} error={errors.about} value={data.about} onChange={(v) => set("about", v)} />
        <Honeypot value={data.website} onChange={(v) => set("website", v)} />
      </div>
      <Check copy={copy} check={check} />
      <Submit copy={copy} status={status} busy={busy} label={copy.partner.submit} />
    </form>
  );
}
