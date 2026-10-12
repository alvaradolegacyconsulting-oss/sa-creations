import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { buttonClasses } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";
import { notFound } from "@/content/navigation";
import { site } from "@/content/site";
import { t } from "@/lib/i18n";
import { builtLocales, routes } from "@/lib/routes";
import { bodyFont, displayFont } from "@/theme/fonts";
import { themeCssVariables } from "@/theme/tokens";
import "./globals.css";

// With two root layouts there's no single layout to build a 404 from, so this page stands alone
// (next.config.ts: experimental.globalNotFound, from Sampayo). It can't know the visitor's language,
// so it says it in each language the site is built in, English first.
export const metadata: Metadata = {
  title: `${builtLocales.map((locale) => t(notFound.title, locale)).join(" · ")} | ${site.businessName}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} style={themeCssVariables as CSSProperties}>
      <body className="bg-ivory text-ink">
        <main id="main" className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-10 px-4 py-16">
          <a href={routes.home.en} aria-label={site.businessName} className="self-start rounded-sm">
            <Logo />
          </a>
          {builtLocales.map((locale) => (
            <section key={locale} lang={locale}>
              <h1 className="font-display text-4xl font-medium text-navy">{t(notFound.title, locale)}</h1>
              <p className="mt-3 leading-relaxed text-ink/80">{t(notFound.body, locale)}</p>
              <a href={routes.home[locale]} className={`${buttonClasses("primary")} mt-5`}>
                {t(notFound.home, locale)}
              </a>
            </section>
          ))}
        </main>
      </body>
    </html>
  );
}
