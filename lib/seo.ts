import type { Metadata } from "next";
import { seasonal } from "@/content/seasonal";
import { site as siteContent, type SiteContent } from "@/content/site";
import { defaultLocale, type Locale, type LocalizedText } from "@/content/types";
import { localeTag, t } from "@/lib/i18n";
import { builtLocales, routeKeys, routes, type RouteKey } from "@/lib/routes";

/** Share images, one per language, served by app/og/[locale]/route.tsx. */
export const ogImagePath: Record<Locale, string> = { en: "/og/en", es: "/og/es" };

type VercelEnv = Partial<Record<"VERCEL_ENV" | "VERCEL_BRANCH_URL" | "VERCEL_URL", string>> & Record<string, string | undefined>;

/**
 * The origin this build is served from. Production uses site.url; a preview uses its own Vercel URL
 * so share images and links resolve on the preview itself; a local build uses localhost.
 */
export function siteOrigin(site: Pick<SiteContent, "url">, env: VercelEnv = process.env): string {
  if (env.VERCEL_ENV === "production") return site.url;
  const host = env.VERCEL_BRANCH_URL ?? env.VERCEL_URL;
  return host ? `https://${host}` : "http://localhost:3000";
}

export function absoluteUrl(origin: string, path: string): string {
  return new URL(path, `${origin}/`).toString();
}

/** Each page's title (none for home: it uses the business name and tagline) and description. */
const pageText: Record<RouteKey, { title?: LocalizedText; description?: LocalizedText }> = {
  home: {},
  season: seasonal.page,
};

/**
 * hreflang alternates for a page: each built language, with English for everyone else. Empty while the
 * site is built in one language (there is nothing to point to).
 */
export function languageAlternates(route: RouteKey, languages: readonly Locale[] = builtLocales): Record<string, string> | undefined {
  if (languages.length < 2) return undefined;
  return { ...Object.fromEntries(languages.map((locale) => [locale, routes[route][locale]])), "x-default": routes[route][defaultLocale] };
}

/** Every page in every built language, each listing its translations, for app/sitemap.ts. */
export function sitemapEntries(origin: string, languages: readonly Locale[] = builtLocales) {
  return routeKeys.flatMap((route) =>
    languages.map((locale) => {
      const alternates = languageAlternates(route, languages);
      return {
        url: absoluteUrl(origin, routes[route][locale]),
        ...(alternates
          ? { alternates: { languages: Object.fromEntries(languages.map((code) => [code, absoluteUrl(origin, routes[route][code])])) } }
          : {}),
      };
    }),
  );
}

/** Base metadata for a root layout; each page adds its own with pageMetadata(). */
export function rootMetadata(locale: Locale, site: SiteContent = siteContent): Metadata {
  return {
    metadataBase: new URL(siteOrigin(site)),
    title: { default: `${site.businessName} | ${t(site.tagline, locale)}`, template: `%s | ${site.businessName}` },
    description: t(site.description, locale),
  };
}

const ogLocale = (locale: Locale) => localeTag[locale].replace("-", "_");

/**
 * Full metadata for one page in one language. Next.js replaces (not merges) a parent's openGraph and
 * twitter objects, so every page sets all of them here.
 */
export function pageMetadata(route: RouteKey, locale: Locale, site: SiteContent = siteContent): Metadata {
  const text = pageText[route];
  const title = text.title && t(text.title, locale);
  const description = t(text.description ?? site.description, locale);
  const fullTitle = title ? `${title} | ${site.businessName}` : `${site.businessName} | ${t(site.tagline, locale)}`;
  const path = routes[route][locale];
  const image = { url: ogImagePath[locale], width: 1200, height: 630, type: "image/png", alt: site.businessName };
  const languages = languageAlternates(route);
  const others = builtLocales.filter((code) => code !== locale);

  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: { canonical: path, ...(languages ? { languages } : {}) },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.businessName,
      type: "website",
      locale: ogLocale(locale),
      ...(others.length > 0 ? { alternateLocale: others.map(ogLocale) } : {}),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/**
 * schema.org Organization built only from content. S&A Creations is the trade name; legalName is
 * the LLC it's a DBA of. No address (none published); telephone, sameAs and logo only once set.
 */
export function buildOrganizationJsonLd(
  site: SiteContent,
  origin: string,
  { locale = defaultLocale, languages = builtLocales, logoPath }: { locale?: Locale; languages?: readonly Locale[]; logoPath?: string } = {},
) {
  const sameAs = [site.social.instagram, site.social.facebook].filter((link): link is string => Boolean(link));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.businessName,
    legalName: site.legalName,
    description: t(site.description, locale),
    url: absoluteUrl(origin, routes.home[locale]),
    knowsLanguage: languages.map((code) => localeTag[code]),
    email: site.email,
    ...(logoPath ? { logo: absoluteUrl(origin, logoPath) } : {}),
    ...(site.phone ? { telephone: site.phone.tel } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** JSON for a <script type="application/ld+json">, with `<` escaped so content can't close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
