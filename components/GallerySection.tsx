import Image from "next/image";
import { ArrowLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";
import { gallery as galleryContent, type GalleryContent } from "@/content/gallery";
import { sectionIds } from "@/content/navigation";
import { site } from "@/content/site";
import { hasGallery } from "@/lib/gallery";
import { t } from "@/lib/i18n";

/**
 * Tagged grid of real photos. With no photos the whole section is absent, not an empty box
 * (GALLERY_EMPTY_STATE); app/layout.tsx drops its nav link and the hero drops "See our work".
 */
export function GallerySection({ gallery = galleryContent, instagram = site.social.instagram }: { gallery?: GalleryContent; instagram?: string }) {
  if (!hasGallery(gallery)) return null;

  const follow = instagram && (
    <ArrowLink href={instagram} external>
      {t(gallery.followCta)}
    </ArrowLink>
  );

  return (
    <Section id={sectionIds.gallery} intro={gallery.intro} aside={follow}>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {gallery.photos.map((photo) => (
          <li key={photo.src} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-sand">
            <Image src={photo.src} alt={t(photo.alt)} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            {/* A solid chip, so the caption stays readable over any photo. */}
            <span className="absolute bottom-2 left-2 rounded-sm bg-ivory px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink">
              {t(gallery.tagLabels[photo.tag])}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
