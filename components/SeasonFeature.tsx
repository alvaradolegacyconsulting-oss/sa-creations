"use client";

import { ArrowLink } from "@/components/ButtonLink";
import { ContactCta } from "@/components/ContactCta";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Container, Eyebrow } from "@/components/Section";
import { sectionIds } from "@/content/navigation";
import { seasonal as seasonalContent, type Season, type SeasonalContent } from "@/content/seasonal";
import { photoOrNone, type Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { seasonToShow } from "@/lib/seasons";
import { useCentralDateKey } from "@/lib/useCentralDateKey";

export type SeasonLayout = "band" | "page";

/**
 * The current season (or the evergreen copy), as the home-page band or the /season page.
 * The static HTML carries the evergreen copy; once the browser knows today's Central date it swaps in
 * the season running today, if any. `season` pins one season regardless of date (preview pages).
 */
export function SeasonFeature({
  locale,
  layout,
  season: pinned,
  content = seasonalContent,
}: {
  locale: Locale;
  layout: SeasonLayout;
  season?: Season;
  content?: SeasonalContent;
}) {
  const today = useCentralDateKey();
  const { season, copy } = pinned ? { season: pinned, copy: pinned } : seasonToShow(content, today);
  const page = layout === "page";
  const Heading = page ? "h1" : "h2";
  const headingId = `${sectionIds.season}-heading`;
  const photo = photoOrNone(copy.photo);

  return (
    <section
      id={page ? undefined : sectionIds.season}
      aria-labelledby={headingId}
      className={page ? "bg-ivory py-12 sm:py-16" : "bg-sand py-14 sm:py-16"}
      data-season={season?.id ?? "evergreen"}
    >
      <Container className={`grid items-center gap-8 ${photo ? "lg:grid-cols-[1.1fr_1fr] lg:gap-12" : ""}`}>
        <div className={photo ? "" : "max-w-3xl"}>
          <Eyebrow>{t(season ? season.name : content.evergreenEyebrow, locale)}</Eyebrow>
          <Heading
            id={headingId}
            className={`mt-3 font-display font-medium leading-[1.1] text-navy ${page ? "text-[2.75rem] sm:text-6xl" : "text-[2.25rem] sm:text-5xl"}`}
          >
            {t(copy.headline, locale)}
          </Heading>
          <p className="mt-4 max-w-xl leading-relaxed text-ink/80">{t(copy.body, locale)}</p>
          {copy.occasions.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {copy.occasions.map((occasion) => (
                <li key={occasion.en} className="rounded-full border border-line bg-white px-3 py-1 text-[0.8125rem] text-ink">
                  {t(occasion, locale)}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            {/* A season's button names it on the form; the evergreen one is a plain link to the form. */}
            <ContactCta preselect={{ service: copy.cta.service, season: season?.id }} locale={locale} look="button">
              {t(copy.cta.label, locale)}
            </ContactCta>
            {!page && <ArrowLink href={routes.season[locale]}>{t(content.seeMore, locale)}</ArrowLink>}
          </div>
        </div>
        {photo && (
          <PhotoFrame
            photo={photo}
            locale={locale}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={page ? "aspect-[4/3] lg:aspect-[5/4]" : "aspect-[4/3]"}
            priority={page}
          />
        )}
      </Container>
    </section>
  );
}
