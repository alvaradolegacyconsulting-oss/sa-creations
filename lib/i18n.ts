import { TRANSLATE, type Locale, type LocalizedText } from "@/content/types";

/**
 * The text in `locale`. A Spanish string that isn't written yet shows as "[TRANSLATE] <English>", so
 * it stands out on previews instead of passing for a translation; TRANSLATIONS_COMPLETE blocks production.
 */
export function t(text: LocalizedText, locale: Locale): string {
  if (locale === "en") return text.en;
  return text.es?.trim() ? text.es : `${TRANSLATE}] ${text.en}`;
}

/** BCP 47 tag for Intl formatting and og:locale. */
export const localeTag: Record<Locale, string> = { en: "en-US", es: "es-US" };
