import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { gallery } from "@/content/gallery";
import { headerNav } from "@/content/navigation";
import type { Locale } from "@/content/types";
import { hiddenHomeSections } from "@/lib/gallery";
import type { RouteKey } from "@/lib/routes";
import { visibleLinks } from "@/lib/sections";

/** Header, the page's <main> and footer, in one language. `route` lets the language switch link to this page. */
export function PageShell({ locale, route, children }: { locale: Locale; route: RouteKey; children: ReactNode }) {
  return (
    <>
      {/* An empty gallery drops its nav link (GALLERY_EMPTY_STATE). */}
      <SiteHeader links={visibleLinks(headerNav, hiddenHomeSections(gallery))} locale={locale} route={route} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
