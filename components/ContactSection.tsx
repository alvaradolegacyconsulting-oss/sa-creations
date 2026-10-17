import { ContactForm } from "@/components/ContactForm";
import { EmphasizedText } from "@/components/EmphasizedText";
import { Container, Eyebrow } from "@/components/Section";
import { contact } from "@/content/contact";
import { sectionIds } from "@/content/navigation";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";

const linkClasses = "inline-flex min-h-11 items-center break-all font-medium text-navy underline underline-offset-4 hover:text-copper";

export function ContactSection({ locale }: { locale: Locale }) {
  const headingId = `${sectionIds.contact}-heading`;

  return (
    <section id={sectionIds.contact} aria-labelledby={headingId} className="bg-white py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <Eyebrow>{t(contact.eyebrow, locale)}</Eyebrow>
          <h2 id={headingId} className="mt-3 font-display text-[2.25rem] font-medium leading-[1.1] text-navy sm:text-5xl">
            <EmphasizedText text={contact.heading} locale={locale} />
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-ink/80">{t(contact.intro, locale)}</p>
          {/* Call and text appear only when content/site.ts has a phone number. */}
          <ul className="mt-4 text-sm">
            {site.phone && (
              <>
                <li>
                  <a className={linkClasses} href={`tel:${site.phone.tel}`}>
                    {t(contact.call, locale)} {site.phone.display}
                  </a>
                </li>
                <li>
                  <a className={linkClasses} href={`sms:${site.phone.tel}`}>
                    {t(contact.text, locale)} {site.phone.display}
                  </a>
                </li>
              </>
            )}
            <li>
              <a className={linkClasses} href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
          </ul>
        </div>
        <ContactForm locale={locale} />
      </Container>
    </section>
  );
}
