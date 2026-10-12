import type { EmphasizedText as EmphasizedTextContent, Locale } from "@/content/types";
import { t } from "@/lib/i18n";

/** Renders a heading's text with its one italic phrase. */
export function EmphasizedText({ text, locale }: { text: EmphasizedTextContent; locale: Locale }) {
  return (
    <>
      {t(text.before, locale)}
      {text.emphasis && <em className="italic">{t(text.emphasis, locale)}</em>}
      {text.after && t(text.after, locale)}
    </>
  );
}
