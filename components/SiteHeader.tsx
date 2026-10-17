import Link from "next/link";
import { buttonClasses } from "@/components/ButtonLink";
import { LangSwitch } from "@/components/LangSwitch";
import { Logo } from "@/components/Logo";
import { MobileMenu, type MenuLink } from "@/components/MobileMenu";
import { navLabels, type NavLink } from "@/content/navigation";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { builtLocales, routes, type RouteKey } from "@/lib/routes";
import { navHref, sectionHref } from "@/lib/sections";

/** `links` is already filtered to sections that render (see components/PageShell.tsx). */
export function SiteHeader({ links, locale, route }: { links: NavLink[]; locale: Locale; route: RouteKey }) {
  const menuLinks: MenuLink[] = links.map((link) => ({ label: t(link.label, locale), href: navHref(link, locale) }));
  const cta: MenuLink = { label: t(site.headerCta, locale), href: sectionHref("contact", locale) };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ivory">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <Link href={routes.home[locale]} aria-label={site.businessName} className="inline-flex min-h-11 items-center rounded-sm">
          <Logo priority />
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <nav aria-label={t(navLabels.mainNav, locale)} className="hidden md:block">
            <ul className="flex items-center gap-6">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="py-2 text-[0.9375rem] font-medium text-ink hover:text-copper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Wrapped so "hidden" isn't overridden by the button's own display class; phones get it in the menu. */}
          <div className="hidden md:block">
            <a href={cta.href} className={`${buttonClasses("primary")} min-h-11 px-5 text-sm`}>
              {cta.label}
            </a>
          </div>
          {/* Shown at every width, so phones can switch without opening the menu. */}
          {builtLocales.length > 1 && <LangSwitch route={route} locale={locale} />}
          <MobileMenu links={menuLinks} cta={cta} label={t(navLabels.menu, locale)} navLabel={t(navLabels.mainNav, locale)} />
        </div>
      </div>
    </header>
  );
}
