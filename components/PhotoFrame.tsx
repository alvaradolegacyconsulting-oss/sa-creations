import Image from "next/image";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import type { Photo } from "@/content/types";
import { t } from "@/lib/i18n";

export type PhotoShape = "arch" | "rounded";

const shapeClasses: Record<PhotoShape, string> = {
  // The concept's signature shape: a tall arch with softly rounded bottom corners.
  arch: "rounded-t-full rounded-b-lg",
  rounded: "rounded-lg",
};

/**
 * The real photo from public/images/ when `photo.src` is set; a labelled placeholder until then
 * (ported from a1wrecker). The box keeps its size either way, so swapping in the file doesn't
 * shift the layout. Size the box with `className` (an aspect ratio or a height).
 */
export function PhotoFrame({
  photo,
  shape = "rounded",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  className = "",
  priority = false,
}: {
  photo: Photo;
  shape?: PhotoShape;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (!photo.src) {
    return <PhotoPlaceholder label={t(photo.label)} className={`w-full ${shapeClasses[shape]} ${className}`} />;
  }

  return (
    <div className={`relative w-full overflow-hidden ${shapeClasses[shape]} ${className}`}>
      <Image src={photo.src} alt={t(photo.alt)} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
