import { contact } from "@/content/contact";
import { sectionIds } from "@/content/navigation";
import type { ServiceId } from "@/content/services";

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
  /** Honeypot: hidden from people, so anything here means a bot. */
  website: string;
};

/** /api/contact's reply. `ok: true` is sent only after the email API reports success. */
export type ContactResponse = { ok: true } | { ok: false; error: string };

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
    website: text("website"),
  };
}

/** True only for a 2xx reply whose body is exactly { ok: true }. Anything else is a failure (from alc-site). */
export async function isConfirmedSent(response: Response): Promise<boolean> {
  if (!response.ok) return false;
  try {
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && (body as { ok?: unknown }).ok === true;
  } catch {
    return false;
  }
}
