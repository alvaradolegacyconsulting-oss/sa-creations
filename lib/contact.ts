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
