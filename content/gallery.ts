import type { LocalizedText, SectionIntro } from "./types";

export type GalleryTag =
  | "wedding"
  | "quinceanera"
  | "balloon-arch"
  | "centerpieces"
  | "event-shirts"
  | "business-merch"
  | "gift-basket"
  | "personalized-sign";

/** A real photo in public/images/gallery/. No placeholders here: an empty list hides the section. */
export type GalleryPhoto = {
  tag: GalleryTag;
  src: string;
  alt: LocalizedText;
};

export type GalleryContent = {
  intro: SectionIntro;
  /** Caption shown on each photo. */
  tagLabels: Record<GalleryTag, LocalizedText>;
  /** Beside the heading; shown only when site.social.instagram is set. */
  followCta: LocalizedText;
  photos: GalleryPhoto[];
};

export const gallery: GalleryContent = {
  intro: {
    eyebrow: { en: "Recent work" },
    heading: { before: { en: "Moments we've made" } },
  },
  tagLabels: {
    wedding: { en: "Wedding" },
    quinceanera: { en: "Quinceañera" },
    "balloon-arch": { en: "Balloon arch" },
    centerpieces: { en: "Centerpieces" },
    "event-shirts": { en: "Event shirts" },
    "business-merch": { en: "Business merch" },
    "gift-basket": { en: "Gift basket" },
    "personalized-sign": { en: "Personalized sign" },
  },
  followCta: { en: "Follow on Instagram" },
  // Empty until real photos arrive; the section and its nav link stay hidden until then.
  photos: [],
};
