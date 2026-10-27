import { z } from "zod";

/** Phone: optional leading +, then digits, spaces, dashes, dots or brackets, with at least 7 digits. */
export function isPhone(value: string) {
  const v = value.trim();
  return v.length <= 40 && /^\+?[\d\s().-]+$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7;
}

export const NEEDS = ["Branding", "Film & production", "Content & social", "Not sure yet"] as const;
export const WHENS = ["This month", "In 1 to 3 months", "Just exploring"] as const;

export const enquirySchema = z.object({
  needs: z.array(z.enum(NEEDS)).min(1).max(NEEDS.length),
  when: z.enum(WHENS),
  about: z.string().trim().min(1).max(4000),
  name: z.string().trim().min(1).max(120),
  brand: z.string().trim().min(1).max(160),
  email: z.email().max(200),
  phone: z.string().trim().max(40).refine(isPhone),
  website: z.string().max(0).optional(), // honeypot, must stay empty
});

export type Enquiry = z.infer<typeof enquirySchema>;
