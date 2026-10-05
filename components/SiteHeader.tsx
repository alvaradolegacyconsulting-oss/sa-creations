import Link from "next/link";
import { buttonClasses } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";
import { MobileMenu, type MenuLink } from "@/components/MobileMenu";
import { navLabels, type NavLink } from "@/content/navigation";
import { site } from "@/content/site";
import { t } from "@/lib/i18n";
import { navHref, sectionHref } from "@/lib/sections";

/** `links` is already filtered to sections that render (see app/layout.tsx). */
export function SiteHeader({ links }: { links: NavLink[] }) {
  const menuLinks: MenuLink[] = links.map((link) => ({ label: t(link.label), href: navHref(link) }));
  const cta: MenuLink = { label: t(site.headerCta), href: sectionHref("contact") };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ivory">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label={site.businessName} className="inline-flex min-h-11 items-center rounded-sm">
          <Logo />
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label={t(navLabels.mainNav)} className="hidden md:block">
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
          <MobileMenu links={menuLinks} cta={cta} label={t(navLabels.menu)} navLabel={t(navLabels.mainNav)} />
        </div>
      </div>
    </header>
  );
}
