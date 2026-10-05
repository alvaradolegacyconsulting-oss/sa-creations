import { ArrowLink } from "@/components/ButtonLink";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Section } from "@/components/Section";
import { sectionIds } from "@/content/navigation";
import { services, servicesSection } from "@/content/services";
import { contactHrefForService } from "@/lib/contact";
import { t } from "@/lib/i18n";
import { serviceAnchor } from "@/lib/sections";

export function ServicesSection() {
  return (
    <Section id={sectionIds.services} intro={servicesSection} tone="white" centered>
      <ul className="grid gap-5 lg:grid-cols-2">
        {services.map((service) => (
          <li
            key={service.id}
            id={serviceAnchor(service.id)}
            className="grid gap-5 rounded-lg border border-line bg-ivory p-4 sm:grid-cols-[11rem_1fr] sm:p-5"
          >
            <PhotoFrame photo={service.photo} shape="arch" sizes="(min-width: 640px) 11rem, 100vw" className="aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-56" />
            <div className="pb-1">
              <h3 className="font-display text-[1.75rem] font-medium leading-tight text-navy">{t(service.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{t(service.description)}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.items.map((item) => (
                  <li key={item.en} className="rounded-full border border-line bg-white px-3 py-1 text-[0.8125rem] text-ink">
                    {t(item)}
                  </li>
                ))}
              </ul>
              <ArrowLink href={contactHrefForService(service.id)} className="mt-3">
                {t(service.cta)}
              </ArrowLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
