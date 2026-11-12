import { z } from "zod";

/*
  Every form on the site posts to /api/enquiry with a `kind`:
  - project: the compact "Start a project" form (home and contact)
  - portfolio: the enquiry that unlocks an industry's portfolio (gate)
  - partner: the Partner with us form
  - careers: the application on Careers (multipart, with the CV)
  The same validation runs in the browser (for inline errors) and on the server.
*/

/** Phone: optional leading +, then digits, spaces, dashes, dots or brackets, with at least 7 digits. */
export function isPhone(value: string) {
  const v = value.trim();
  return v.length <= 40 && /^\+?[\d\s().-]+$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PARTNER_TYPES = ["Refer a client", "Collaborate as an agency"] as const;
export const DISCIPLINES = ["Strategy & Ideation", "Film & Production", "Post-production", "Design", "Social Media", "Studio Operations"] as const;
export const OPPORTUNITIES = ["Full-time", "Internship"] as const;
/** Operations applicants may apply without a portfolio (brief, 11 Nov 2026) */
export const PORTFOLIO_OPTIONAL: (typeof DISCIPLINES)[number] = "Studio Operations";

/** CV upload: PDF or Word, up to 3 MB (Vercel caps a function's request body at 4.5 MB) */
export const CV_MAX_BYTES = 3 * 1024 * 1024;
export const CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
export const CV_ACCEPT = ".pdf,.doc,.docx";

const name = z.string().trim().min(1).max(120);
const email = z.email().max(200);
const phone = z.string().trim().max(40).refine(isPhone);
const honeypot = z.string().max(0).optional();
const optionalText = z.string().trim().max(4000).optional().default("");
const slug = z.string().regex(/^[a-z0-9-]{1,60}$/);

const project = z.object({
  kind: z.literal("project"),
  name,
  email,
  phone,
  business: z.string().trim().min(1).max(160),
  about: optionalText,
  /** The industry page the visitor came from, if any */
  industry: slug.optional(),
  website: honeypot,
});

const portfolio = project.extend({ kind: z.literal("portfolio"), industry: slug });

const partner = z.object({
  kind: z.literal("partner"),
  name,
  company: z.string().trim().min(1).max(160),
  email,
  phone,
  type: z.enum(PARTNER_TYPES),
  about: z.string().trim().min(1).max(4000),
  website: honeypot,
});

const careers = z
  .object({
    kind: z.literal("careers"),
    name,
    email,
    phone,
    city: z.string().trim().min(1).max(120),
    discipline: z.enum(DISCIPLINES),
    opportunity: z.enum(OPPORTUNITIES),
    portfolio: z.union([z.url().max(500), z.literal("")]).optional().default(""),
    website: honeypot,
  })
  .refine((a) => a.discipline === PORTFOLIO_OPTIONAL || !!a.portfolio, { path: ["portfolio"] });

export const enquirySchema = z.discriminatedUnion("kind", [project, portfolio, partner, careers]);

export type Enquiry = z.infer<typeof enquirySchema>;
export type EnquiryKind = Enquiry["kind"];
