// Relative imports only in content/: scripts/check-production-gates.ts loads these files under tsx,
// which doesn't resolve the "@/" alias.

/** The languages the site can be written in. English is the default (served at "/"). */
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

/** Served at "/"; the other language is served under "/<code>" once content/site.ts languages lists it. */
export const defaultLocale: Locale = "en";

export type LocalizedText = {
  en: string;
  es?: string;
};

/** A heading with one italic phrase, e.g. "Making every moment *magical*." */
export type EmphasizedText = {
  before: LocalizedText;
  emphasis?: LocalizedText;
  after?: LocalizedText;
};

/** The small eyebrow line and heading that open a home-page section. */
export type SectionIntro = {
  eyebrow: LocalizedText;
  heading: EmphasizedText;
};

/**
 * A photo in public/images/. `src: null` renders a labelled placeholder box instead, and the
 * production build fails while any remain (real photos only; see the preflight).
 */
export type Photo = {
  src: string | null;
  alt: LocalizedText;
  /** Shown inside the placeholder box until the real photo arrives, e.g. "Real photo: gift basket". */
  label: LocalizedText;
};

/**
 * A deliberate "no photo here" (e.g. a service with no real photo yet): the card renders without a
 * photo box, and the production gate accepts it. Unlike `src: null`, which still blocks production.
 */
export type NoPhoto = { kind: "none" };

/** The photo to show, or null for the no-photo marker. */
export function photoOrNone(photo: Photo | NoPhoto): Photo | null {
  return "src" in photo ? photo : null;
}

/** Marks a value Jose hasn't confirmed yet. The production build fails while any remain (lib/gates.ts). */
export const PLACEHOLDER = "[PLACEHOLDER";

/** Marks a missing translation. TRANSLATIONS_COMPLETE blocks production while any show (lib/gates.ts). */
export const TRANSLATE = "[TRANSLATE";

/** "[PLACEHOLDER: what]": shows on previews, blocks the production build. */
export function placeholder(what: string): string {
  return `${PLACEHOLDER}: ${what}]`;
}

export function isPlaceholder(value: string): boolean {
  return value.includes(PLACEHOLDER);
}
