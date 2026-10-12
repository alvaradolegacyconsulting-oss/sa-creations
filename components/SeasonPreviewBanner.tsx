"use client";

import { Container } from "@/components/Section";
import { seasonal, type Season } from "@/content/seasonal";
import type { Locale } from "@/content/types";
import { fill, t } from "@/lib/i18n";
import { currentSeason } from "@/lib/seasons";
import { formatDateKey } from "@/lib/seasonPreview";
import { useCentralDateKey } from "@/lib/useCentralDateKey";

/**
 * Banner on a season preview page: its dates, and (once the browser knows today's Central date)
 * whether it's the season the site is showing today. Before that, it says neither.
 */
export function SeasonPreviewBanner({ season, locale, seasons = seasonal.seasons }: { season: Season; locale: Locale; seasons?: Season[] }) {
  const today = useCentralDateKey();
  const { preview } = seasonal;
  const status = today === null ? null : currentSeason(seasons, today)?.id === season.id ? preview.active : preview.notActive;
  const dates = fill(t(preview.dates, locale), { start: formatDateKey(season.start, locale), end: formatDateKey(season.end, locale) });

  return (
    <div className="border-y border-copper/40 bg-white">
      <Container className="py-3 text-sm text-ink">
        <p>
          <strong className="font-semibold text-copper">{t(preview.label, locale)}:</strong> {status && `${t(status, locale)} `}
          {dates}
        </p>
      </Container>
    </div>
  );
}
