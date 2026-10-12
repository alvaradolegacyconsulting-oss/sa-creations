import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SeasonPage } from "@/components/SeasonPage";
import { SeasonPreviewBanner } from "@/components/SeasonPreviewBanner";
import { seasonal } from "@/content/seasonal";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";

const findSeason = (id: string) => seasonal.seasons.find((season) => season.id === id);

/** Title for a preview page; never indexed (the pages don't exist in production anyway). */
export function seasonPreviewMetadata(id: string, locale: Locale): Metadata {
  const season = findSeason(id);
  return {
    title: { absolute: `${t(seasonal.preview.label, locale)}: ${season ? t(season.name, locale) : id} | ${site.businessName}` },
    robots: { index: false, follow: false },
  };
}

/** One season, whatever today's date, with the preview banner. Previews only (lib/seasonPreview.ts). */
export function SeasonPreviewPage({ id, locale }: { id: string; locale: Locale }) {
  const season = findSeason(id);
  if (!season) notFound();

  return (
    <SeasonPage locale={locale} season={season} banner={<SeasonPreviewBanner season={season} locale={locale} />} />
  );
}
