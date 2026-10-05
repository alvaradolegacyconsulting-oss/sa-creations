import { GallerySection } from "@/components/GallerySection";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { StorySection } from "@/components/StorySection";
import { ValuesStrip } from "@/components/ValuesStrip";
import { gallery } from "@/content/gallery";
import { hasGallery } from "@/lib/gallery";

export default function HomePage() {
  return (
    <main id="main">
      <HeroSection showWorkLink={hasGallery(gallery)} />
      <ValuesStrip />
      <ServicesSection />
      <GallerySection />
      <StorySection />
    </main>
  );
}
