"use client";

/*
  Adapted from Watermelon UI `progressive-input-stack` (reference/watermelon/progressive-input-stack.tsx).
  Kept: one step at a time, finished steps stay stacked above the active one, Back/Next with an
  animated label swap.
  Changed: three grouped steps (need, brand, details) instead of one field per step; finished
  steps become editable summary strips instead of scaled cards; sharp borders and underline
  fields from the site tokens; real labels, fieldset/legend and inline errors; posts to
  /api/enquiry; react-icons and the shadow/rounded styling removed.
*/
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { Content } from "@/content/types";
import { NEEDS, WHENS, isPhone } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

type FormCopy = Content["contactPage"]["form"];
type Data = { needs: string[]; when: string; about: string; name: string; brand: string; company: string; email: string; phone: string; website: string };
type Errors = Partial<Record<"needs" | "brand" | "company" | "about" | "name" | "email" | "phone", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EnquiryForm({ copy, children }: { copy: FormCopy; children?: ReactNode }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({ needs: [], when: WHENS[1], about: "", name: "", brand: "", company: "", email: "", phone: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const prevStep = useRef(step);

  useEffect(() => {
    if (prevStep.current !== step) headingRefs.current[step]?.focus();
    prevStep.current = step;
  }, [step]);

  const set = <K extends keyof Data>(key: K, value: Data[K]) => setData((d) => ({ ...d, [key]: value }));
  const toggleNeed = (need: string) =>
    set("needs", data.needs.includes(need) ? data.needs.filter((n) => n !== need) : [...data.needs, need]);

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0 && data.needs.length === 0) e.needs = copy.errors.needs;
    if (s === 1) {
      if (!data.brand.trim()) e.brand = copy.errors.brand;
      if (!data.company.trim()) e.company = copy.errors.company;
      if (!data.about.trim()) e.about = copy.errors.about;
    }
    if (s === 2) {
      if (!data.name.trim()) e.name = copy.errors.name;
      if (!EMAIL.test(data.email.trim())) e.email = copy.errors.email;
      if (!isPhone(data.phone)) e.phone = copy.errors.phone;
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(s + 1, 2));
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (step < 2) return next();
    const e = validate(2);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const summaries = [
    `${data.needs.join(", ")} · ${data.when}`,
    [data.brand, data.company, data.about].filter(Boolean).join(" · "),
  ];

  if (status === "sent") {
    return (
      <div role="status" className="grid gap-6 border-t border-border pt-8">
        <svg viewBox="0 0 240 120" aria-hidden="true" className="ill ill-draw h-auto w-[200px] text-ink">
          <path className="s" d="M24 70 H170" pathLength={1} />
          <path className="s f" d="M24 48 H120" pathLength={1} />
          <circle className="dot" cx="186" cy="68" r="6" />
        </svg>
        <h3 className="t-h2">
          {copy.sentTitle}
          <span className="stop">.</span>
        </h3>
        <p className="t-lead max-w-[34ch]">{copy.sent}</p>
        {children && (
          <div className="grid gap-3 border-t border-border pt-6">
            <span className="t-label">{copy.sentNext}</span>
            {children}
          </div>
        )}
      </div>
    );
  }

  const transition = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 500, damping: 45 };

  return (
    <form onSubmit={submit} noValidate className="grid gap-0">
      <div className="grid gap-3 pb-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="t-label !text-ink" aria-live="polite">
            {copy.progress.replace("{n}", String(step + 1))}
          </span>
          <span className="text-[0.88rem] text-muted-foreground">{copy.steps[step]}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
          {copy.steps.map((label, i) => (
            <span key={label} className="relative h-[3px] overflow-hidden bg-border">
              <span
                className={cn(
                  "absolute inset-0 origin-left bg-brand transition-transform duration-500 ease-[var(--ease)]",
                  i <= step ? "scale-x-100" : "scale-x-0",
                )}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-border" />
      {copy.steps.map((label, i) => {
        if (i > step) {
          return (
            <div key={label} className="flex items-center justify-between border-b border-border py-5 text-[var(--faint)]">
              <span className="t-label !text-[var(--faint)]">
                {String(i + 1).padStart(2, "0")} &nbsp;{label}
              </span>
            </div>
          );
        }
        if (i < step) {
          return (
            <motion.div layout={!reduce} key={label} className="flex items-center justify-between gap-4 border-b border-border py-5">
              <span className="min-w-0">
                <span className="t-label">
                  {String(i + 1).padStart(2, "0")} &nbsp;{label}
                </span>
                <span className="mt-1 block truncate text-[0.98rem]">{summaries[i]}</span>
              </span>
              <button type="button" className="u shrink-0 text-[0.9rem]" onClick={() => setStep(i)}>
                {copy.edit} <span className="sr-only">{label}</span>
              </button>
            </motion.div>
          );
        }
        return (
          <motion.fieldset
            layout={!reduce}
            key={label}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="relative grid gap-7 border-b border-border pb-9 pt-6"
          >
            <legend className="sr-only">{label}</legend>
            <h3 ref={(el) => { headingRefs.current[i] = el; }} tabIndex={-1} className="t-label marker !text-ink outline-none">
              {String(i + 1).padStart(2, "0")} &nbsp;{label}
            </h3>

            {i === 0 && (
              <>
                <div className="grid gap-3" role="group" aria-labelledby="need-label" aria-describedby={errors.needs ? "e-needs" : undefined}>
                  <span id="need-label" className="t-label">{copy.needLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {NEEDS.map((need, n) => (
                      <button key={need} type="button" className="chip" aria-pressed={data.needs.includes(need)} onClick={() => toggleNeed(need)}>
                        {copy.needs[n] ?? need}
                      </button>
                    ))}
                  </div>
                  {errors.needs && <span id="e-needs" className="text-[0.82rem] text-destructive">{errors.needs}</span>}
                </div>
                <div className="grid gap-1 sm:max-w-[50%]">
                  <label htmlFor="f-when" className="t-label">{copy.whenLabel}</label>
                  <select id="f-when" className="field-input" value={data.when} onChange={(e) => set("when", e.target.value)}>
                    {WHENS.map((w, n) => (
                      <option key={w} value={w}>{copy.whens[n] ?? w}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {i === 1 && (
              <>
                <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
                  <Field id="f-brand" required label={copy.brand} error={errors.brand} value={data.brand} onChange={(v) => set("brand", v)} placeholder={copy.brandPlaceholder} />
                  <Field id="f-company" required label={copy.company} error={errors.company} value={data.company} onChange={(v) => set("company", v)} autoComplete="organization" placeholder={copy.companyPlaceholder} />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="f-about" className="t-label">{copy.aboutLabel}</label>
                  <textarea
                    id="f-about"
                    className="field-input"
                    required
                    aria-required
                    aria-invalid={errors.about ? true : undefined}
                    aria-describedby={errors.about ? "f-about-err" : undefined}
                    placeholder={copy.aboutPlaceholder}
                    value={data.about}
                    onChange={(e) => set("about", e.target.value)}
                  />
                  {errors.about && <span id="f-about-err" className="text-[0.82rem] text-destructive">{errors.about}</span>}
                </div>
              </>
            )}

            {i === 2 && (
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-6">
                <Field id="f-name" required label={copy.name} error={errors.name} value={data.name} onChange={(v) => set("name", v)} autoComplete="name" />
                <Field id="f-email" required label={copy.email} error={errors.email} value={data.email} onChange={(v) => set("email", v)} autoComplete="email" type="email" />
                <Field id="f-phone" label={copy.phone} error={errors.phone} value={data.phone} onChange={(v) => set("phone", v)} autoComplete="tel" type="tel" required />
                <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
                  <label htmlFor="f-website">Leave this empty</label>
                  <input id="f-website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {i > 0 && (
                <button type="button" className="cta cta-line" onClick={() => setStep(i - 1)}>
                  {copy.back}
                </button>
              )}
              <button type="submit" className="cta" disabled={status === "sending"}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={i === 2 ? (status === "sending" ? "sending" : "submit") : "next"}
                    initial={reduce ? false : { y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduce ? undefined : { y: -14, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {i === 2 ? (status === "sending" ? copy.sending : copy.submit) : copy.next}
                  </motion.span>
                </AnimatePresence>
                <span className="arr" aria-hidden="true">&rarr;</span>
              </button>
              {status === "failed" && <span role="alert" className="text-[0.92rem] text-destructive">{copy.failed}</span>}
            </div>
          </motion.fieldset>
        );
      })}
    </form>
  );
}

function Field({
  id, label, value, onChange, error, type = "text", autoComplete, required, placeholder,
}: { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; autoComplete?: string; required?: boolean; placeholder?: string }) {
  return (
    <div className={cn("grid min-w-0 gap-1")}>
      <label htmlFor={id} className="t-label">{label}</label>
      <input
        id={id}
        type={type}
        className="field-input"
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        aria-required={required || undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && <span id={`${id}-err`} className="text-[0.82rem] text-destructive">{error}</span>}
    </div>
  );
}
