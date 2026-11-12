"use client";

/*
  The parts every form on the site shares: underlined fields with real labels and inline errors,
  radio chips, the honeypot, the sent state, and useSubmit, which runs the human check (Turnstile),
  posts to /api/enquiry and reports success or failure. Each form keeps its own fields and checks.
*/
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { FormCopy } from "@/content/types";
import type { EnquiryKind } from "@/lib/enquiry";
import { cn } from "@/lib/utils";
import { HumanCheck, TURNSTILE_SITE_KEY } from "../human-check";

export type Status = "idle" | "verifying" | "sending" | "sent" | "failed";
type Payload = { fields: Record<string, string>; file?: File };

/**
 * Sends a form to /api/enquiry. With Turnstile on, a submit before the token arrives waits for it
 * and sends as soon as it does. `send` resolves to true once the studio has the enquiry.
 */
export function useSubmit(kind: EnquiryKind, onSent?: () => void) {
  const [status, setStatus] = useState<Status>("idle");
  const [checkKey, setCheckKey] = useState(0);
  const token = useRef<string | null>(null);
  const pending = useRef<Payload | null>(null);
  const startedAt = useRef(0);
  const sentRef = useRef(onSent);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    sentRef.current = onSent;
  });

  const post = async ({ fields, file }: Payload, turnstile: string | null) => {
    setStatus("sending");
    let ok = false;
    try {
      const elapsed = Date.now() - startedAt.current;
      let res: Response;
      if (file) {
        const body = new FormData();
        for (const [k, v] of Object.entries({ ...fields, kind, turnstile: turnstile ?? "", elapsed: String(elapsed) })) body.set(k, v);
        body.set("cv", file);
        res = await fetch("/api/enquiry", { method: "POST", body });
      } else {
        res = await fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fields, kind, turnstile, elapsed }),
        });
      }
      ok = res.ok;
    } catch {}
    pending.current = null;
    setStatus(ok ? "sent" : "failed");
    if (ok) sentRef.current?.();
    // Tokens are single use, so a failed send needs a fresh check
    else {
      token.current = null;
      setCheckKey((k) => k + 1);
    }
  };

  const send = (payload: Payload) => {
    if (TURNSTILE_SITE_KEY && !token.current) {
      pending.current = payload;
      setStatus("verifying");
      return;
    }
    void post(payload, token.current);
  };

  const onToken = (t: string | null) => {
    token.current = t;
    if (t && pending.current) void post(pending.current, t);
  };

  const onRetry = () => {
    if (status === "verifying") setStatus("idle");
    pending.current = null;
    setCheckKey((k) => k + 1);
  };

  return { status, send, busy: status === "sending" || status === "verifying", check: { key: checkKey, onToken, onRetry } };
}

/** Turnstile status line (renders nothing when Turnstile is off) */
export function Check({ copy, check }: { copy: FormCopy; check: ReturnType<typeof useSubmit>["check"] }) {
  if (!TURNSTILE_SITE_KEY) return null;
  return <HumanCheck key={check.key} copy={copy.verify} onToken={check.onToken} onRetry={check.onRetry} />;
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optionalLabel?: string;
  placeholder?: string;
  className?: string;
  inputMode?: "text" | "email" | "tel" | "url";
};

function LabelText({ label, required, optionalLabel }: { label: string; required?: boolean; optionalLabel?: string }) {
  return (
    <>
      {label}
      {!required && optionalLabel && <span className="ms-2 normal-case tracking-normal text-[var(--faint)]">{optionalLabel}</span>}
    </>
  );
}

export function Field({ id, label, value, onChange, error, type = "text", autoComplete, required, optionalLabel, placeholder, className, inputMode }: FieldProps) {
  return (
    <div className={cn("grid min-w-0 gap-1", className)}>
      <label htmlFor={id} className="t-label">
        <LabelText label={label} required={required} optionalLabel={optionalLabel} />
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
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
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </div>
  );
}

export function TextArea({ id, label, value, onChange, error, required, optionalLabel, placeholder, className }: FieldProps) {
  return (
    <div className={cn("grid min-w-0 gap-1", className)}>
      <label htmlFor={id} className="t-label">
        <LabelText label={label} required={required} optionalLabel={optionalLabel} />
      </label>
      <textarea
        id={id}
        name={id}
        className="field-input"
        required={required}
        aria-required={required || undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </div>
  );
}

export function Select({
  id, label, value, onChange, error, options, placeholder, className,
}: { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; options: readonly string[]; placeholder: string; className?: string }) {
  return (
    <div className={cn("grid min-w-0 gap-1", className)}>
      <label htmlFor={id} className="t-label">{label}</label>
      <select
        id={id}
        name={id}
        className={cn("field-input", !value && "text-[var(--faint)]")}
        required
        aria-required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">{o}</option>
        ))}
      </select>
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </div>
  );
}

/** One choice from a few, as chips (native radios inside, so arrow keys work) */
export function Chips({
  name, label, value, onChange, error, options, className,
}: { name: string; label: string; value: string; onChange: (v: string) => void; error?: string; options: readonly string[]; className?: string }) {
  return (
    <fieldset className={cn("grid min-w-0 gap-3", className)} aria-describedby={error ? `${name}-err` : undefined}>
      <legend className="t-label mb-3">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="chip cursor-pointer">
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
      {error && <FieldError id={`${name}-err`}>{error}</FieldError>}
    </fieldset>
  );
}

/** One choice from several, as a grid of cards (native radios inside, so arrow keys work) */
export function Choices({
  name, label, value, onChange, error, options, className, numbered, hideLegend,
}: {
  name: string; label: string; value: string; onChange: (v: string) => void; error?: string;
  options: readonly string[]; className?: string; numbered?: boolean; hideLegend?: boolean;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <fieldset className="grid min-w-0 gap-3" aria-describedby={error ? `${name}-err` : undefined} aria-invalid={error ? true : undefined}>
      <legend className={cn("t-label mb-3", hideLegend && "sr-only")}>{label}</legend>
      <div className={cn("grid gap-2", className)}>
        {options.map((o, i) => (
          <label key={o} className="choice">
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {numbered && <span className="choice-n" aria-hidden="true">{pad(i + 1)}</span>}
            <span className="choice-label">{o}</span>
            <span className="choice-mark" aria-hidden="true" />
          </label>
        ))}
      </div>
      {error && <FieldError id={`${name}-err`}>{error}</FieldError>}
    </fieldset>
  );
}

/** A numbered part of a longer form */
export function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="form-step grid min-w-0 gap-7">
      <legend className="form-step-head">
        <span className="form-step-n">{String(n).padStart(2, "0")}</span>
        <span className="t-label !text-ink">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} className="text-[0.82rem] text-destructive">
      {children}
    </span>
  );
}

/** Bots fill every field; people never see this one */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
      <label htmlFor="f-website">Leave this empty</label>
      <input id="f-website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Submit button, the privacy line, and the failure message */
export function Submit({ copy, status, label, busy }: { copy: FormCopy; status: Status; label: string; busy: boolean }) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" className="cta" disabled={busy}>
          {status === "sending" ? copy.sending : status === "verifying" ? copy.verifying : label}
          <span className="arr" aria-hidden="true">&rarr;</span>
        </button>
        <p className="max-w-[40ch] text-[0.86rem] text-muted-foreground">{copy.privacy}</p>
      </div>
      {status === "failed" && (
        <p role="alert" className="text-[0.92rem] text-destructive">
          {copy.failed}
        </p>
      )}
    </div>
  );
}

export function Sent({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="grid gap-5 border-t border-border pt-8 outline-none">
      <svg viewBox="0 0 240 120" aria-hidden="true" className="ill ill-draw h-auto w-[180px] text-ink">
        <path className="s" d="M24 70 H170" pathLength={1} />
        <path className="s f" d="M24 48 H120" pathLength={1} />
        <circle className="dot" cx="186" cy="68" r="6" />
      </svg>
      <h3 className="t-h2">
        {title}
        <span className="stop">.</span>
      </h3>
      <p className="t-lead max-w-[36ch]">{text}</p>
      {children}
    </div>
  );
}

/** Focus the first field with an error after a failed check */
export function focusFirstError(form: HTMLFormElement | null) {
  requestAnimationFrame(() => form?.querySelector<HTMLElement>(':is(input, select, textarea)[aria-invalid="true"], fieldset[aria-describedby] input')?.focus());
}
