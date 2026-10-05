import type { GalleryContent } from "@/content/gallery";
import type { SectionKey } from "@/content/navigation";

/** The gallery renders only when it has at least one real photo. */
export function hasGallery(gallery: Pick<GalleryContent, "photos">): boolean {
  return gallery.photos.length > 0;
}

/** Home sections that don't render in this build; their nav links and CTAs are left out. */
export function hiddenHomeSections(gallery: Pick<GalleryContent, "photos">): SectionKey[] {
  return hasGallery(gallery) ? [] : ["gallery"];
}
