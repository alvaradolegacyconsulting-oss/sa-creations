import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { gallery } from "@/content/gallery";
import { headerNav, navLabels } from "@/content/navigation";
import { hiddenHomeSections } from "@/lib/gallery";
import { t } from "@/lib/i18n";
import { visibleLinks } from "@/lib/sections";
import { bodyFont, displayFont } from "@/theme/fonts";
import { themeCssVariables } from "@/theme/tokens";
import "./globals.css";

const themeVariables = themeCssVariables as CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} style={themeVariables}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-3 focus:text-white"
        >
          {t(navLabels.skipToContent)}
        </a>
        {/* An empty gallery drops its nav link (GALLERY_EMPTY_STATE). */}
        <SiteHeader links={visibleLinks(headerNav, hiddenHomeSections(gallery))} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
