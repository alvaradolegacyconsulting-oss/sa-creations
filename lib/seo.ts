import type { Metadata } from "next";
import { site as siteContent, type SiteContent } from "@/content/site";
import { defaultLocale, type Locale, type LocalizedText } from "@/content/types";
import { localeTag, t } from "@/lib/i18n";
import { routes, type RouteKey } from "@/lib/routes";

/** Pages listed in the sitemap. */
export const sitemapPaths: string[] = [routes.home[defaultLocale]];

/** Served by app/opengraph-image.tsx. */
const ogImage = { url: "/opengraph-image", width: 1200, height: 630, type: "image/png" };

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
};

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
  const image = { ...ogImage, alt: site.businessName };

  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.businessName,
      type: "website",
      locale: ogLocale(locale),
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
export function buildOrganizationJsonLd(site: SiteContent, origin: string, logoPath?: string) {
  const sameAs = [site.social.instagram, site.social.facebook].filter((link): link is string => Boolean(link));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.businessName,
    legalName: site.legalName,
    description: site.description.en,
    url: absoluteUrl(origin, "/"),
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
