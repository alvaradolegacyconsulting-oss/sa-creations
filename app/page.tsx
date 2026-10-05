import { ContactSection } from "@/components/ContactSection";
import { GallerySection } from "@/components/GallerySection";
import { HeroSection } from "@/components/HeroSection";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { ServicesSection } from "@/components/ServicesSection";
import { StorySection } from "@/components/StorySection";
import { ValuesStrip } from "@/components/ValuesStrip";
import { gallery } from "@/content/gallery";
import { site } from "@/content/site";
import { hasGallery } from "@/lib/gallery";
import { pages } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(site, { path: pages.home });

export default function HomePage() {
  return (
    <main id="main">
      <OrganizationJsonLd />
      <HeroSection showWorkLink={hasGallery(gallery)} />
      <ValuesStrip />
      <ServicesSection />
      <GallerySection />
      <StorySection />
      <ContactSection />
    </main>
  );
}
