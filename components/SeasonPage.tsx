import type { ReactNode } from "react";
import { PageShell } from "@/components/PageShell";
import { SeasonFeature } from "@/components/SeasonFeature";
import type { Season } from "@/content/seasonal";
import type { Locale } from "@/content/types";

/** /season (and /es/temporada): this season's offer, or the evergreen copy. `season` pins one (previews). */
export function SeasonPage({ locale, season, children }: { locale: Locale; season?: Season; children?: ReactNode }) {
  return (
    <PageShell locale={locale} route="season">
      <SeasonFeature locale={locale} layout="page" season={season} />
      {children}
    </PageShell>
  );
}
