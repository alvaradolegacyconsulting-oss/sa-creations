import type { CSSProperties, ReactNode } from "react";
import { navLabels } from "@/content/navigation";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { bodyFont, displayFont } from "@/theme/fonts";
import { themeCssVariables } from "@/theme/tokens";

const themeVariables = themeCssVariables as CSSProperties;

/** <html> and <body> for one language (from Sampayo). Each root layout renders one of these. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`} style={themeVariables}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-3 focus:text-white"
        >
          {t(navLabels.skipToContent, locale)}
        </a>
        {children}
      </body>
    </html>
  );
}
