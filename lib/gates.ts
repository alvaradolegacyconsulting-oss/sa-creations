// Relative imports only: scripts/check-production-gates.ts runs this under tsx without the "@/" alias.
import type { SiteContent } from "../content/site";
import { PLACEHOLDER, TRANSLATE } from "../content/types";

/** Every string under `value` that still contains "[PLACEHOLDER", as "path: text". */
export function findPlaceholders(value: unknown, path = "content"): string[] {
  if (typeof value === "string") return value.includes(PLACEHOLDER) ? [`${path}: ${value}`] : [];
  if (Array.isArray(value)) return value.flatMap((item, index) => findPlaceholders(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => findPlaceholders(item, `${path}.${key}`));
  }
  return [];
}

/** Every Photo (an object with `src` and `label`) whose src is still null: a placeholder box would ship. */
export function findMissingPhotos(value: unknown, path = "content"): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => findMissingPhotos(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  if ("src" in record && "label" in record && record.src === null) {
    const label = (record.label as { en?: string }).en ?? "";
    return [`${path}.src is null (${label})`];
  }
  return Object.entries(record).flatMap(([key, item]) => findMissingPhotos(item, `${path}.${key}`));
}

/** A LocalizedText: an object whose only keys are `en` (a string) and, optionally, `es`. */
export function isLocalizedText(value: object): value is { en: string; es?: string } {
  const keys = Object.keys(value);
  return typeof (value as { en?: unknown }).en === "string" && keys.every((key) => key === "en" || key === "es");
}

/** Every LocalizedText under `value`, depth first, with its path (e.g. "services[2].items[3]"). */
export function findTexts(value: unknown, path: string): { path: string; text: { en: string; es?: string } }[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => findTexts(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [];
  if (isLocalizedText(value)) return [{ path, text: value }];
  return Object.entries(value).flatMap(([key, item]) => findTexts(item, `${path}.${key}`));
}

/**
 * TRANSLATIONS_COMPLETE: every piece of text has real Spanish: not missing, not empty, no "[TRANSLATE"
 * marker. There is no fallback to English on the live site.
 */
export function findUntranslated(content: Record<string, unknown>): string[] {
  return Object.entries(content).flatMap(([name, value]) =>
    findTexts(value, name).flatMap(({ path, text }) => {
      if (text.es === undefined) return [`${path}.es is missing (en: ${text.en})`];
      if (text.es.trim() === "") return [`${path}.es is empty (en: ${text.en})`];
      if (text.es.includes(TRANSLATE)) return [`${path}.es: ${text.es}`];
      return [];
    }),
  );
}

export type Gate = { name: string; problems: string[] };

/**
 * PLACEHOLDERS_RESOLVED: "[PLACEHOLDER" strings anywhere in content (incl. content/pending.ts) and
 * photos still missing. An empty gallery is not a problem: that section is simply absent.
 * TRANSLATIONS_COMPLETE and TRANSLATIONS_REVIEWED apply once Spanish is built (site.languages); before
 * that there is no Spanish to check, and both pass.
 */
export function runGates(content: Record<string, unknown>, site: Pick<SiteContent, "languages" | "translationsReviewed">): Gate[] {
  const spanish = site.languages.includes("es");
  return [
    {
      name: "PLACEHOLDERS_RESOLVED",
      problems: Object.entries(content).flatMap(([name, value]) => [...findPlaceholders(value, name), ...findMissingPhotos(value, name)]),
    },
    { name: "TRANSLATIONS_COMPLETE", problems: spanish ? findUntranslated(content) : [] },
    {
      name: "TRANSLATIONS_REVIEWED",
      problems:
        spanish && !site.translationsReviewed
          ? ["content/site.ts translationsReviewed is false: S&A hasn't signed off the Spanish yet (docs/REVIEW.md)"]
          : [],
    },
  ];
}
