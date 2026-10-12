import { contact } from "@/content/contact";
import type { Locale } from "@/content/types";
import { sectionIds } from "@/content/navigation";
import type { ServiceId } from "@/content/services";

/** Field limits, shared by the form (maxLength) and the server schema so they can't drift (from alc-site). */
export const contactLimits = {
  name: 80,
  email: 254,
  phone: 30,
  details: 5000,
  /** Largest request body /api/contact reads. The longest valid submission is well under this. */
  bodyBytes: 32 * 1024,
} as const;

/** Query parameter a service CTA sets to preselect that service's checkbox in the form. */
export const SERVICE_PARAM = "service";

/** Link from a service card to the contact form with that service checked (from a1wrecker). */
export function contactHrefForService(id: ServiceId): string {
  return `/?${SERVICE_PARAM}=${id}#${sectionIds.contact}`;
}

/** The service for a ?service= value, or null for anything unknown. */
export function serviceFromParam(value: string | null): ServiceId | null {
  return contact.serviceOptions.find((option) => option.id === value)?.id ?? null;
}

/** Window event a service CTA fires on the home page; ContactForm checks that service in state. */
export const SERVICE_PRESELECT_EVENT = "contact:preselect-service";

export function requestServicePreselect(id: ServiceId): void {
  window.dispatchEvent(new CustomEvent<ServiceId>(SERVICE_PRESELECT_EVENT, { detail: id }));
}

/** The URL with ?service= removed (hash kept), so it only preselects on the first load. */
export function withoutServiceParam(href: string): string {
  const url = new URL(href);
  url.searchParams.delete(SERVICE_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}

/** What the contact form POSTs to /api/contact as JSON. */
export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  /** yyyy-mm-dd from the date input, or "" when left empty. */
  date: string;
  /** ids from content/contact.ts serviceOptions. */
  services: ServiceId[];
  details: string;
  /** The language of the page the form was sent from, so S&A knows which language to reply in. */
  locale: Locale;
  /** The season id when the visitor came from a season's call to action. */
  season?: string;
  /** Honeypot: hidden from people, so anything here means a bot. */
  website: string;
};

/** Fields a visitor can fix, in form order. A 400 reply names only these (never their values). */
export const contactFields = ["name", "email", "phone", "date", "services", "details"] as const;
export type ContactField = (typeof contactFields)[number];

/**
 * /api/contact's reply. `ok: true` is sent only after the email API reports success.
 * "invalid" means nothing was sent because a field needs fixing; "send-failed" means the send itself failed.
 */
export type ContactResponse =
  | { ok: true }
  | { ok: false; reason: "invalid"; fields: ContactField[] }
  | { ok: false; reason: "send-failed" };

export function payloadFromForm(form: HTMLFormElement): ContactPayload {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? "").trim();

  return {
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    date: text("date"),
    services: data
      .getAll("services")
      .map((value) => serviceFromParam(String(value)))
      .filter((id): id is ServiceId => id !== null),
    details: text("details"),
    locale: "en",
    website: text("website"),
  };
}

/** What the form should show for a reply. */
export type ContactOutcome = { kind: "sent" } | { kind: "invalid"; fields: ContactField[] } | { kind: "failed" };

/**
 * Sent only for a 2xx reply whose body is exactly { ok: true }. Invalid only for a 400 that says
 * reason "invalid" and names at least one known field. Anything else is a failure (from alc-site).
 */
export async function interpretReply(response: Response): Promise<ContactOutcome> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { kind: "failed" };
  }
  if (typeof body !== "object" || body === null) return { kind: "failed" };
  const reply = body as { ok?: unknown; reason?: unknown; fields?: unknown };

  if (response.ok && reply.ok === true) return { kind: "sent" };
  if (response.status === 400 && reply.ok === false && reply.reason === "invalid" && Array.isArray(reply.fields)) {
    const known: readonly string[] = contactFields;
    const fields = reply.fields.filter((field): field is ContactField => typeof field === "string" && known.includes(field));
    if (fields.length > 0) return { kind: "invalid", fields };
  }
  return { kind: "failed" };
}
