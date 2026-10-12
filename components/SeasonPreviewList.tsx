import { Container } from "@/components/Section";
import { seasonal } from "@/content/seasonal";
import type { Locale } from "@/content/types";
import { fill, t } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { formatDateKey } from "@/lib/seasonPreview";

/** Links to every season's preview page, under /season on preview sites only. */
export function SeasonPreviewList({ locale }: { locale: Locale }) {
  const { preview, seasons } = seasonal;
  if (seasons.length === 0) return null;

  return (
    <section aria-labelledby="season-previews" className="border-t border-line bg-white py-10">
      <Container>
        <h2 id="season-previews" className="font-display text-2xl font-medium text-navy">
          {t(preview.listHeading, locale)}
        </h2>
        <p className="mt-1 text-sm text-ink/80">{t(preview.listNote, locale)}</p>
        <ul className="mt-4 grid gap-1 sm:grid-cols-2">
          {seasons.map((season) => (
            <li key={season.id}>
              <a
                href={`${routes.season[locale]}/${season.id}`}
                className="inline-flex min-h-11 flex-wrap items-center gap-x-2 text-sm font-semibold text-copper underline underline-offset-4 hover:text-navy"
              >
                {t(season.name, locale)}
                <span className="font-normal text-ink/80 no-underline">
                  {fill(t(preview.dates, locale), { start: formatDateKey(season.start, locale), end: formatDateKey(season.end, locale) })}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
