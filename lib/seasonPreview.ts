import { seasonal, type Season } from "@/content/seasonal";
import type { Locale } from "@/content/types";
import { localeTag } from "@/lib/i18n";
import { isProductionBuild } from "@/lib/env";

/**
 * Params for the season preview pages (/season/<id>, /es/temporada/<id>): every season on preview and
 * local builds, none in production, so those addresses are 404s on the live site.
 */
export function previewSeasonParams(
  vercelEnv: string | undefined = process.env.VERCEL_ENV,
  seasons: readonly Season[] = seasonal.seasons,
): { id: string }[] {
  return isProductionBuild(vercelEnv) ? [] : seasons.map((season) => ({ id: season.id }));
}

/** Previews and local builds show the preview banner list; production never does. */
export function showSeasonPreviews(vercelEnv: string | undefined = process.env.VERCEL_ENV): boolean {
  return !isProductionBuild(vercelEnv);
}

/** "Nov 27, 2026" / "27 nov 2026": a calendar date, so formatted in UTC (no time zone shift). */
export function formatDateKey(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag[locale], { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
