import type { LocalizedText } from "@/content/types";

/** The site launches English-only; this is the one place a language switch would go. */
export function t(text: LocalizedText): string {
  return text.en;
}
