import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Section";
import { navLabels } from "@/content/navigation";
import { site } from "@/content/site";
import { t } from "@/lib/i18n";
import { sectionHref } from "@/lib/sections";
import { yearInCentral } from "@/lib/time";

const linkClasses = "inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4 hover:text-gold";

export function SiteFooter() {
  // Social links appear only once their URLs are set in content/site.ts.
  const links = [
    site.social.instagram && { label: t(navLabels.instagram), href: site.social.instagram, external: true },
    site.social.facebook && { label: t(navLabels.facebook), href: site.social.facebook, external: true },
    { label: t(navLabels.contact), href: sectionHref("contact"), external: false },
  ].filter((link) => link !== undefined && link !== "") as { label: string; href: string; external: boolean }[];

  return (
    <footer className="on-dark bg-ink text-ivory">
      <Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <Link href="/" aria-label={site.businessName} className="inline-flex self-start rounded-sm">
          <Logo dark />
        </Link>
        <nav aria-label={t(navLabels.footerNav)}>
          <ul className="flex flex-wrap gap-x-6">
            {links.map((link) => (
              <li key={link.href}>
                <a className={linkClasses} href={link.href} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-ivory/15">
        {/* Built statically: the year is the Central-time year of the last deploy. */}
        <Container className="py-5 text-xs text-ivory/80">
          © {yearInCentral()} {site.businessName}. {t(site.footerNote)}
        </Container>
      </div>
    </footer>
  );
}
