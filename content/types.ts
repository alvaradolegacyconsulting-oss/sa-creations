// Relative imports only in content/: scripts/check-production-gates.ts loads these files under tsx,
// which doesn't resolve the "@/" alias.

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

/** Marks a value Jose hasn't confirmed yet. The production build fails while any remain (lib/gates.ts). */
export const PLACEHOLDER = "[PLACEHOLDER";

/** "[PLACEHOLDER: what]": shows on previews, blocks the production build. */
export function placeholder(what: string): string {
  return `${PLACEHOLDER}: ${what}]`;
}

export function isPlaceholder(value: string): boolean {
  return value.includes(PLACEHOLDER);
}
