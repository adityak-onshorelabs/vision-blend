type Draft = { to: string; cc?: string | null; subject: string; body: string };

/**
 * A pre-filled draft in Gmail's web composer (opens in the browser, so it works without a mail
 * app, unlike mailto:). Parts are encoded with encodeURIComponent, not URLSearchParams, so spaces
 * don't show up as "+".
 */
export function gmailCompose({ to, cc, subject, body }: Draft) {
  const params = [`to=${encodeURIComponent(to)}`, cc && `cc=${encodeURIComponent(cc)}`, `su=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`];
  return `https://mail.google.com/mail/?view=cm&fs=1&${params.filter(Boolean).join("&")}`;
}
