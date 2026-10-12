// Relative imports only: next.config.ts loads this file, and it doesn't resolve "@/".
import { site } from "../content/site";
import { defaultLocale, type Locale } from "../content/types";

/**
 * Every page, in each language. Add new pages here; the sitemap, hreflang, the language switch and the
 * redirect checks all read from this table.
 */
export const routes = {
  home: { en: "/", es: "/es" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;
export const routeKeys = Object.keys(routes) as RouteKey[];

/** Every page path in every language the site is built in (redirect targets must be one of these). */
export function pagePathsFor(languages: readonly Locale[]): string[] {
  return routeKeys.flatMap((key) => languages.map((locale) => routes[key][locale]));
}

/** The language served under "/<code>" (app/(alternate)/[alt]). */
export const alternateLocale: Locale = "es";

/** True when the site is built in the alternate language too (content/site.ts languages). */
export function hasAlternate(languages: readonly Locale[] = site.languages): boolean {
  return languages.includes(alternateLocale);
}

/** The languages this build serves, default first. */
export const builtLocales: Locale[] = hasAlternate() ? [defaultLocale, alternateLocale] : [defaultLocale];

export const pagePaths: string[] = pagePathsFor(builtLocales);

export function otherLocale(locale: Locale): Locale {
  return locale === defaultLocale ? alternateLocale : defaultLocale;
}
