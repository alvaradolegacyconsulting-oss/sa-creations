import type { EmphasizedText as EmphasizedTextContent } from "@/content/types";
import { t } from "@/lib/i18n";

/** Renders a heading's text with its one italic phrase. */
export function EmphasizedText({ text }: { text: EmphasizedTextContent }) {
  return (
    <>
      {t(text.before)}
      {text.emphasis && <em className="italic">{t(text.emphasis)}</em>}
      {text.after && t(text.after)}
    </>
  );
}
