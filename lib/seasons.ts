// Relative imports only: the gate scripts load this under tsx.
import type { Season, SeasonCopy, SeasonalContent } from "../content/seasonal";
import { isDateKey } from "./time";

/** A season id: a lowercase slug. The contact route accepts only ids of this shape. */
export const SEASON_ID = /^[a-z0-9-]{1,64}$/;

/** The season running on `today` (a Central "YYYY-MM-DD" date), or null. Start and end are inclusive. */
export function currentSeason(seasons: readonly Season[], today: string): Season | null {
  return seasons.find((season) => isDateKey(season.start) && isDateKey(season.end) && season.start <= today && today <= season.end) ?? null;
}

/**
 * What to show: the current season, or the evergreen copy when none is running. `today` is null on the
 * server and during hydration, so the static HTML always carries the evergreen copy, never an empty band.
 */
export function seasonToShow(content: Pick<SeasonalContent, "evergreen" | "seasons">, today: string | null): { season: Season | null; copy: SeasonCopy } {
  const season = today ? currentSeason(content.seasons, today) : null;
  return { season, copy: season ?? content.evergreen };
}

/** Everything wrong with content/seasonal.ts seasons, in plain English; empty means valid. Fails every build. */
export function findSeasonProblems(seasons: readonly Season[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();

  seasons.forEach((season, index) => {
    const label = `seasons[${index}] (${season.id})`;
    if (!SEASON_ID.test(season.id)) problems.push(`${label}: id must be lowercase letters, numbers and hyphens, e.g. "christmas-2026"`);
    if (ids.has(season.id)) problems.push(`${label}: id "${season.id}" is used twice`);
    ids.add(season.id);
    for (const key of ["start", "end"] as const) {
      if (!isDateKey(season[key])) problems.push(`${label}: ${key} "${season[key]}" must be a real date written YYYY-MM-DD`);
    }
    if (isDateKey(season.start) && isDateKey(season.end) && season.end < season.start) {
      problems.push(`${label}: ends (${season.end}) before it starts (${season.start})`);
    }
  });

  const dated = seasons.filter((season) => isDateKey(season.start) && isDateKey(season.end)).toSorted((a, b) => a.start.localeCompare(b.start));
  for (let i = 1; i < dated.length; i++) {
    const [previous, next] = [dated[i - 1], dated[i]];
    if (next.start <= previous.end) problems.push(`${previous.id} (to ${previous.end}) overlaps ${next.id} (from ${next.start})`);
  }
  return problems;
}
