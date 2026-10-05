import { sectionIds, type NavLink, type SectionKey } from "@/content/navigation";
import type { ServiceId } from "@/content/services";

/** Anchor id of one service card. */
export function serviceAnchor(id: ServiceId): string {
  return `service-${id}`;
}

/** Link to a home-page section that works from any page. */
export function sectionHref(section: SectionKey): string {
  return `/#${sectionIds[section]}`;
}

/** A header link's href: the service card when it names one, else the section. */
export function navHref(link: NavLink): string {
  return link.service ? `/#${serviceAnchor(link.service)}` : sectionHref(link.section);
}

/** Leaves out links to sections that aren't rendered. */
export function visibleLinks(links: NavLink[], hidden: readonly SectionKey[]): NavLink[] {
  return links.filter((link) => !hidden.includes(link.section));
}
