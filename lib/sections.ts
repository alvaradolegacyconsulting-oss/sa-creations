import { sectionIds, type NavLink, type SectionKey } from "@/content/navigation";
import type { ServiceId } from "@/content/services";
import type { Locale } from "@/content/types";
import { routes } from "@/lib/routes";

/** Anchor id of one service card. */
export function serviceAnchor(id: ServiceId): string {
  return `service-${id}`;
}

/** Link to a home-page section, in this language's home page, that works from any page. */
export function sectionHref(section: SectionKey, locale: Locale): string {
  return `${routes.home[locale]}#${sectionIds[section]}`;
}

/** A header link's href: the service card when it names one, else the section. */
export function navHref(link: NavLink, locale: Locale): string {
  return link.service ? `${routes.home[locale]}#${serviceAnchor(link.service)}` : sectionHref(link.section, locale);
}

/** Leaves out links to sections that aren't rendered. */
export function visibleLinks(links: NavLink[], hidden: readonly SectionKey[]): NavLink[] {
  return links.filter((link) => !hidden.includes(link.section));
}
