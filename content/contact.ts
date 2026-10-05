import type { ServiceId } from "./services";
import type { EmphasizedText, LocalizedText } from "./types";

export type ContactServiceOption = {
  /** Sent to /api/contact; matches a services.ts id. */
  id: ServiceId;
  label: LocalizedText;
};

export type ContactContent = {
  eyebrow: LocalizedText;
  heading: EmphasizedText;
  intro: LocalizedText;
  labels: {
    name: LocalizedText;
    email: LocalizedText;
    phone: LocalizedText;
    date: LocalizedText;
    optional: LocalizedText;
    services: LocalizedText;
    details: LocalizedText;
    /** Label on the hidden spam-trap field; only bots ever fill it in. */
    honeypot: LocalizedText;
  };
  serviceOptions: ContactServiceOption[];
  submit: LocalizedText;
  pending: LocalizedText;
  /** Shown only after /api/contact confirms the email was sent. */
  success: LocalizedText;
  /** Shown on any failure; the inquiry email is appended as a link. The fields stay filled. */
  failure: LocalizedText;
  /** Shown when a required field is empty or the email isn't valid. */
  invalid: LocalizedText;
};

export const contact: ContactContent = {
  eyebrow: { en: "Get in touch" },
  heading: { before: { en: "Let's plan something amazing." } },
  intro: {
    en: "Whether you have a date set or just a dream, we'd love to hear from you. Send a few details for a free consultation and a custom proposal.",
  },
  labels: {
    name: { en: "Name" },
    email: { en: "Email" },
    phone: { en: "Phone" },
    date: { en: "Event or need-by date" },
    optional: { en: "optional" },
    services: { en: "What can we help with?" },
    details: { en: "Tell us about it" },
    honeypot: { en: "Leave this field empty" },
  },
  serviceOptions: [
    { id: "events", label: { en: "Event planning" } },
    { id: "decor", label: { en: "Custom decor" } },
    { id: "apparel", label: { en: "Custom apparel" } },
    { id: "gifts", label: { en: "Custom gifts" } },
  ],
  submit: { en: "Request my free consultation" },
  pending: { en: "Sending..." },
  success: { en: "Thank you! Your request was sent. We'll reach out to set up your free consultation." },
  failure: { en: "We couldn't send your request. Your details are still here, so you can try again, or email us at" },
  invalid: { en: "Please add your name, a valid email and a few details." },
};
