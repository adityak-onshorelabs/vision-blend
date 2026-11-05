import type { Content, Industry } from "@/content/types";
import { gmailCompose } from "./mail";

/**
 * The emailed brief for an enquiry that started on an industry page: the industry is filled in,
 * so the studio knows which page it came from, and the industry's brief question replaces the
 * generic one. Built from `company` at render time because the admin can change the addresses.
 */
export function industryGmail(company: Content["company"], industry: Industry) {
  if (!company.email) return null;
  return gmailCompose({
    to: company.email,
    cc: company.emailCc,
    subject: `${industry.name} project enquiry`,
    body: [
      "Hi Vision Blend,",
      "",
      "Brand or company:",
      `Industry: ${industry.name}`,
      industry.detail?.enquiry?.placeholder ?? "A little about the project:",
      "",
      "",
      "Thanks,",
    ].join("\n"),
  });
}

/** The contact page link from an industry page, carrying the industry along. */
export const industryContactHref = (lang: string, industry: Industry) => `/${lang}/contact?industry=${industry.slug}`;
