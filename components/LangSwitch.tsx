import { navLabels } from "@/content/navigation";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { builtLocales, otherLocale, routes, type RouteKey } from "@/lib/routes";

/** EN | ES (from Sampayo): the current language marked, the other a link to this same page in it. */
export function LangSwitch({ route, locale, locales = builtLocales }: { route: RouteKey; locale: Locale; locales?: Locale[] }) {
  const other = otherLocale(locale);

  return (
    <nav aria-label={t(navLabels.languageSwitch, locale)}>
      <ul className="flex items-center rounded-sm border border-line bg-white px-1 text-xs font-semibold">
        {locales.map((code, index) => (
          <li key={code} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="text-line">
                |
              </span>
            )}
            {code === locale ? (
              <span aria-current="true" className="flex min-h-11 items-center px-2 text-navy">
                {code.toUpperCase()}
              </span>
            ) : (
              <a
                href={routes[route][other]}
                hrefLang={other}
                lang={other}
                aria-label={t(navLabels.switchTo, other)}
                className="flex min-h-11 items-center px-2 text-copper underline-offset-4 hover:underline"
              >
                {code.toUpperCase()}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
