"use client";

import type { MouseEvent, ReactNode } from "react";
import { ArrowLink, ButtonLink } from "@/components/ButtonLink";
import { sectionIds } from "@/content/navigation";
import type { Locale } from "@/content/types";
import { contactHref, requestPreselect, type ContactPreselect } from "@/lib/contact";

/**
 * A link to the contact form that can check a service and name a season. On the home page it applies
 * them in the form's state and jumps to #contact without a reload, so anything already typed stays.
 * The href works on its own too (from /season, in a new tab, or without JavaScript): the form reads
 * ?service= and ?season= on first load.
 */
export function ContactCta({
  preselect,
  locale,
  look = "arrow",
  className = "",
  children,
}: {
  preselect: ContactPreselect;
  locale: Locale;
  /** "arrow": a text link (service cards). "button": a primary button (This Season). */
  look?: "arrow" | "button";
  className?: string;
  children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let the browser handle new-tab and new-window clicks.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(sectionIds.contact);
    // Not on this page (e.g. /season): follow the link, and the form reads the query on load.
    if (!target) return;

    event.preventDefault();
    requestPreselect(preselect);
    // A hash-only change jumps there like any in-page link (and honors reduced motion via CSS).
    // If the hash is already #contact, setting it again wouldn't move, so scroll directly.
    if (window.location.hash === `#${sectionIds.contact}`) target.scrollIntoView();
    else window.location.hash = sectionIds.contact;
  }

  const href = contactHref(preselect, locale);
  return look === "button" ? (
    <ButtonLink href={href} className={className} onClick={handleClick}>
      {children}
    </ButtonLink>
  ) : (
    <ArrowLink href={href} className={className} onClick={handleClick}>
      {children}
    </ArrowLink>
  );
}
