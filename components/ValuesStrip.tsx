import { Container } from "@/components/Section";
import type { Locale } from "@/content/types";
import { values } from "@/content/values";
import { t } from "@/lib/i18n";

/** Four short promises under the hero, on the same ivory background. */
export function ValuesStrip({ locale }: { locale: Locale }) {
  return (
    <div className="bg-ivory pb-14">
      <Container>
        <ul className="grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <li key={value.title.en}>
              <h2 className="font-display text-xl font-semibold text-navy">{t(value.title, locale)}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink/80">{t(value.description, locale)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
