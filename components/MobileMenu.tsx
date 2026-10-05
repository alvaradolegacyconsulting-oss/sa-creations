"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ButtonLink";

export type MenuLink = { label: string; href: string };

const focusableSelector = "a[href], button:not([disabled])";

/**
 * Phone menu (hidden from md up), ported from casa-del-cordero: focus stays inside the open menu,
 * Escape returns focus to the button, it closes on an outside tap, on a link, and when the screen
 * widens to desktop. The button keeps one accessible name; aria-expanded carries the state.
 */
export function MobileMenu({ links, cta, label, navLabel }: { links: MenuLink[]; cta: MenuLink; label: string; navLabel: string }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !container) return;
      const focusable = [...container.querySelectorAll<HTMLElement>(focusableSelector)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (container && !container.contains(event.target as Node)) setOpen(false);
    };
    // Tailwind's md breakpoint: from here up the inline nav shows instead.
    const wide = window.matchMedia("(min-width: 48rem)");
    const onWiden = () => wide.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    wide.addEventListener("change", onWiden);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      wide.removeEventListener("change", onWiden);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 items-center justify-center rounded-full text-navy hover:bg-sand"
      >
        <span className="sr-only">{label}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <nav
        id="mobile-navigation"
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-ivory px-4 pb-6 pt-2 shadow-md"
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close} className="flex min-h-12 items-center border-b border-line text-base font-medium text-navy">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={cta.href} onClick={close} className={`${buttonClasses("primary")} mt-5 w-full`}>
          {cta.label}
        </a>
      </nav>
    </div>
  );
}
