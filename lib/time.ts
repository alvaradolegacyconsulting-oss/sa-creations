/** The business's time zone. Vercel builds run in UTC, so date parts always go through here. */
export const TIME_ZONE = "America/Chicago";

/** The calendar year in Central time at `date`. */
export function yearInCentral(date: Date = new Date()): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric" }).format(date));
}
