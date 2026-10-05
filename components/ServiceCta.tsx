"use client";

import type { MouseEvent, ReactNode } from "react";
import { ArrowLink } from "@/components/ButtonLink";
import { sectionIds } from "@/content/navigation";
import type { ServiceId } from "@/content/services";
import { contactHrefForService, requestServicePreselect } from "@/lib/contact";

/**
 * A service card's link to the form. On the home page it checks the service in the form's state and
 * jumps to #contact without a reload, so anything already typed stays. The href still works on its
 * own (opened in a new tab, or without JavaScript): the form reads ?service= on first load.
 */
export function ServiceCta({ service, className = "", children }: { service: ServiceId; className?: string; children: ReactNode }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let the browser handle new-tab and new-window clicks.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(sectionIds.contact);
    if (!target) return;

    event.preventDefault();
    requestServicePreselect(service);
    // A hash-only change jumps there like any in-page link (and honors reduced motion via CSS).
    // If the hash is already #contact, setting it again wouldn't move, so scroll directly.
    if (window.location.hash === `#${sectionIds.contact}`) target.scrollIntoView();
    else window.location.hash = sectionIds.contact;
  }

  return (
    <ArrowLink href={contactHrefForService(service)} className={className} onClick={handleClick}>
      {children}
    </ArrowLink>
  );
}
