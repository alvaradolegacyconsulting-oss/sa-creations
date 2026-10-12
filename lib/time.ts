// Relative imports only: the gate scripts load this under tsx.

/** The business's time zone. Vercel builds run in UTC, so date parts always go through here. */
export const TIME_ZONE = "America/Chicago";

/** The calendar year in Central time at `date`. */
export function yearInCentral(date: Date = new Date()): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric" }).format(date));
}

const centralDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  calendar: "iso8601",
  numberingSystem: "latn",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The Central calendar date at `instant`, as "YYYY-MM-DD" (from casa-del-cordero). */
export function centralDateKey(instant: Date = new Date()): string {
  const parts = Object.fromEntries(centralDateFormatter.formatToParts(instant).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** True for a real "YYYY-MM-DD" calendar date (rejects "2027-02-30" and "2027-2-3"). */
export function isDateKey(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date;
}
/** Whole days from one calendar date to another (no time zone involved: both are dates). */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}
