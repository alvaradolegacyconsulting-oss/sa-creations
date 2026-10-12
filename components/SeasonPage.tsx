import type { ReactNode } from "react";
import { PageShell } from "@/components/PageShell";
import { SeasonFeature } from "@/components/SeasonFeature";
import type { Season } from "@/content/seasonal";
import type { Locale } from "@/content/types";

/**
 * /season (and /es/temporada): this season's offer, or the evergreen copy. `season` pins one and
 * `banner` sits above it (preview pages); `children` go below (the preview list).
 */
export function SeasonPage({ locale, season, banner, children }: { locale: Locale; season?: Season; banner?: ReactNode; children?: ReactNode }) {
  return (
    <PageShell locale={locale} route="season">
      {banner}
      <SeasonFeature locale={locale} layout="page" season={season} />
      {children}
    </PageShell>
  );
}
