import { z } from "zod";
import { contact } from "@/content/contact";
import type { ServiceId } from "@/content/services";
import { locales } from "@/content/types";
import { contactLimits } from "@/lib/contact";
import { emailPattern } from "@/lib/email-rule";

const serviceIds = contact.serviceOptions.map((option) => option.id) as [ServiceId, ...ServiceId[]];

// The name goes into the email subject, so no line breaks or control characters.
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((value) => !/[\u0000-\u001f\u007f]/.test(value), "must be a single line");

/** A season id is a slug; anything else is dropped rather than rejected (the visitor can't fix it). */
const SEASON_ID = /^[a-z0-9-]{1,64}$/;

/** Server-side validation for /api/contact (from alc-site). Mirrors the form's required fields. */
export const contactSchema = z.object({
  name: singleLine(contactLimits.name).pipe(z.string().min(1)),
  email: z.string().trim().max(contactLimits.email).pipe(z.email({ pattern: emailPattern })),
  phone: singleLine(contactLimits.phone).optional().default(""),
  /** yyyy-mm-dd from the date input, or "". */
  date: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/)
    .optional()
    .default(""),
  services: z.array(z.enum(serviceIds)).max(serviceIds.length).optional().default([]),
  details: z.string().trim().min(1).max(contactLimits.details),
  /** Not something the visitor can fix, so an unknown value falls back to English instead of failing. */
  locale: z.enum(locales).catch("en"),
  season: z
    .unknown()
    .optional()
    .transform((value) => (typeof value === "string" && SEASON_ID.test(value) ? value : undefined)),
  /** Honeypot. Checked before validation in the route; any value means a bot. */
  website: z.string().optional().default(""),
});

export type ContactSubmission = z.infer<typeof contactSchema>;
