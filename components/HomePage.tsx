import { ContactSection } from "@/components/ContactSection";
import { GallerySection } from "@/components/GallerySection";
import { HeroSection } from "@/components/HeroSection";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { PageShell } from "@/components/PageShell";
import { ServicesSection } from "@/components/ServicesSection";
import { StorySection } from "@/components/StorySection";
import { ValuesStrip } from "@/components/ValuesStrip";
import { gallery } from "@/content/gallery";
import type { Locale } from "@/content/types";
import { hasGallery } from "@/lib/gallery";

/** The one-page site in one language. Each language's page.tsx renders this. */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <OrganizationJsonLd />
      <HeroSection locale={locale} showWorkLink={hasGallery(gallery)} />
      <ValuesStrip locale={locale} />
      <ServicesSection locale={locale} />
      <GallerySection locale={locale} />
      <StorySection locale={locale} />
      <ContactSection locale={locale} />
    </PageShell>
  );
}
