"use client";

/*
  The application on Careers, on its own sheet in three parts: about you, discipline and
  opportunity (cards, one tap each), and your work (portfolio link and a CV drop well). The CV is
  checked as soon as it is chosen and sent as an attachment.
*/
import { useRef, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import type { FormCopy } from "@/content/types";
import { CV_ACCEPT, CV_MAX_BYTES, CV_TYPES, DISCIPLINES, EMAIL_RE, OPPORTUNITIES, PORTFOLIO_OPTIONAL, isPhone } from "@/lib/enquiry";
import { Check, Choices, Field, FieldError, Honeypot, Sent, Step, Submit, focusFirstError, useSubmit } from "./kit";

type Data = { name: string; email: string; phone: string; city: string; discipline: string; opportunity: string; portfolio: string; website: string };
type Key = "name" | "email" | "phone" | "city" | "discipline" | "opportunity" | "portfolio" | "cv";

const isUrl = (v: string) => {
  try {
    return ["http:", "https:"].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

const size = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

export function CareersForm({ copy }: { copy: FormCopy }) {
  const [data, setData] = useState<Data>({ name: "", email: "", phone: "", city: "", discipline: "", opportunity: "", portfolio: "", website: "" });
  const [cv, setCv] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const form = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const { status, send, busy, check } = useSubmit("careers");
  const t = copy.careers;
  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key as Key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const portfolioRequired = !PORTFOLIO_OPTIONAL.includes(data.discipline);

  const cvError = (f: File | null) => (!f || !CV_TYPES[f.type] ? copy.errors.cv : f.size > CV_MAX_BYTES ? copy.errors.cvSize : undefined);

  const pick = (f: File | null) => {
    if (!f) return;
    const err = cvError(f);
    setErrors((e) => ({ ...e, cv: err }));
    setCv(err ? null : f);
    if (fileInput.current) fileInput.current.value = "";
  };

  const remove = () => {
    setCv(null);
    requestAnimationFrame(() => fileInput.current?.focus());
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files?.[0] ?? null);
  };

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
    const ce = cvError(cv);
    if (ce) e.cv = ce;
    setErrors(e);
    if (Object.keys(e).length || !cv) return focusFirstError(form.current);
    send({ fields: { ...data, portfolio: link }, file: cv });
  };

  if (status === "sent") return <Sent title={t.sentTitle} text={t.sent} />;

  return (
    <form ref={form} onSubmit={submit} noValidate className="form-sheet relative grid gap-9">
      <Step n={1} title={t.steps[0]}>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
          <Field id="c-name" required label={copy.labels.name} error={errors.name} value={data.name} onChange={(v) => set("name", v)} autoComplete="name" />
          <Field id="c-email" required label={copy.labels.email} error={errors.email} value={data.email} onChange={(v) => set("email", v)} autoComplete="email" type="email" inputMode="email" />
          <Field id="c-phone" required label={copy.labels.phone} error={errors.phone} value={data.phone} onChange={(v) => set("phone", v)} autoComplete="tel" type="tel" inputMode="tel" />
          <Field id="c-city" required label={copy.labels.city} error={errors.city} value={data.city} onChange={(v) => set("city", v)} autoComplete="address-level2" />
        </div>
      </Step>

      <Step n={2} title={t.steps[1]}>
        <Choices
          name="discipline"
          label={copy.labels.discipline}
          options={DISCIPLINES}
          value={data.discipline}
          onChange={(v) => set("discipline", v)}
          error={errors.discipline}
          numbered
          className="sm:grid-cols-2 xl:grid-cols-3"
        />
        <Choices
          name="opportunity"
          label={copy.labels.opportunity}
          options={OPPORTUNITIES}
          value={data.opportunity}
          onChange={(v) => set("opportunity", v)}
          error={errors.opportunity}
          className="grid-cols-2"
        />
      </Step>

      <Step n={3} title={t.steps[2]}>
        <div className="grid gap-1">
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
          {portfolioRequired && !errors.portfolio && <span className="text-[0.82rem] text-muted-foreground">{t.portfolioOptional}</span>}
        </div>

        <div className="grid min-w-0 gap-2">
          <span id="c-cv-label" className="t-label">{copy.labels.cv}</span>
          {/* The input stays in the page so the label, keyboard and "Replace" all reach it */}
          <input
            ref={fileInput}
            id="c-cv"
            type="file"
            accept={CV_ACCEPT}
            className="sr-only"
            tabIndex={cv ? -1 : 0}
            aria-labelledby="c-cv-label"
            aria-required
            aria-invalid={errors.cv ? true : undefined}
            aria-describedby={errors.cv ? "c-cv-hint c-cv-err" : "c-cv-hint"}
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
          {cv ? (
            <div className="file-row">
              <DocIcon />
              <div className="grid min-w-0 flex-1">
                <span className="truncate text-[0.98rem]">{cv.name}</span>
                <span className="text-[0.82rem] text-muted-foreground">{size(cv.size)}</span>
              </div>
              <label htmlFor="c-cv" className="file-act grid place-items-center">{t.cvReplace}</label>
              <button type="button" className="file-act" onClick={remove}>{t.cvRemove}</button>
            </div>
          ) : (
            <label
              htmlFor="c-cv"
              className="dropzone"
              data-drag={drag || undefined}
              aria-invalid={errors.cv ? true : undefined}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <UploadIcon />
              <span className="grid gap-0.5">
                <span className="text-[0.98rem]">
                  {t.cvDrop} <span className="underline underline-offset-3">{t.cvBrowse}</span>
                </span>
                <span id="c-cv-hint" className="text-[0.82rem] text-muted-foreground">{copy.cvHint}</span>
              </span>
            </label>
          )}
          {cv && <span id="c-cv-hint" className="sr-only">{copy.cvHint}</span>}
          {errors.cv && <FieldError id="c-cv-err">{errors.cv}</FieldError>}
        </div>
        <Honeypot value={data.website} onChange={(v) => set("website", v)} />
      </Step>

      <div className="grid gap-6 border-t border-border pt-8">
        <Check copy={copy} check={check} />
        <Submit copy={copy} status={status} busy={busy} label={t.submit} />
      </div>
    </form>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" className="shrink-0 text-brand">
      <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4 15v4.5h16V15" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" className="shrink-0 text-brand">
      <path d="M6 2.5h8.5L19 7v14.5H6zM14.5 2.5V7H19M9 12h7M9 15.5h7" />
    </svg>
  );
}
