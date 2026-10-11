import type { LocalizedText, SectionIntro } from "./types";

export type GalleryTag =
  | "wedding"
  | "quinceanera"
  | "baby-shower"
  | "proposal"
  | "balloon-arch"
  | "centerpieces"
  | "event-shirts"
  | "business-merch"
  | "gift-basket"
  | "personalized-sign";

/** A real photo in public/images/. No placeholders here: an empty list hides the section. */
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
    "baby-shower": { en: "Baby shower" },
    proposal: { en: "Proposal" },
    "balloon-arch": { en: "Balloon arch" },
    centerpieces: { en: "Centerpieces" },
    "event-shirts": { en: "Event shirts" },
    "business-merch": { en: "Business merch" },
    "gift-basket": { en: "Gift basket" },
    "personalized-sign": { en: "Personalized sign" },
  },
  followCta: { en: "Follow on Instagram" },
  // An empty list hides the section and its nav link.
  photos: [
    {
      tag: "wedding",
      src: "/images/church-altar-love-sign.jpg",
      alt: {
        en: "Church altar decorated for a wedding: white drapes and greenery framing a lit LOVE sign, white flower stands and a white aisle runner",
      },
    },
    {
      tag: "baby-shower",
      src: "/images/baby-shower-balloon-arch.jpg",
      alt: { en: "Balloon arch in yellow, blue, rust and cow print around an \"It's a Boy Story\" banner, with BABY letter blocks" },
    },
    {
      tag: "proposal",
      src: "/images/marry-me-proposal-setup.jpg",
      alt: {
        en: "Outdoor proposal setup: a red carpet lined with candles leading to a MARRY ME marquee sign under red and gold drapes and a greenery garland",
      },
    },
    {
      tag: "gift-basket",
      src: "/images/wedding-gift-basket-rose-wine.jpg",
      alt: { en: "Wedding gift basket with a lace-wrapped bottle of rosé, two glasses filled with chocolates and ivory flower trim" },
    },
    {
      tag: "quinceanera",
      src: "/images/quinceanera-reception-hall.jpg",
      alt: { en: "Reception hall set for a quinceañera, with gold satin chair covers, white floral centerpieces and black and gold balloons" },
    },
    {
      tag: "baby-shower",
      src: "/images/winnie-the-pooh-diaper-cake.jpg",
      alt: { en: "Three-tier diaper cake topped with a Winnie-the-Pooh plush, trimmed with yellow flowers, burlap and baby bottles" },
    },
    {
      tag: "wedding",
      src: "/images/church-aisle-pew-garlands.jpg",
      alt: { en: "Church aisle set for a wedding, with a white runner, scattered petals and flower garlands on every pew" },
    },
    {
      tag: "proposal",
      src: "/images/proposal-candle-heart.jpg",
      alt: { en: "Heart of tea-light candles on a red runner, with rose petals and a pillar candle on the grass" },
    },
    {
      tag: "baby-shower",
      src: "/images/pink-diaper-cake-gift-table.jpg",
      alt: { en: "Pink diaper cake with a bunny plush and fabric bows, beside gift bags on a pink table" },
    },
    {
      tag: "proposal",
      src: "/images/burgundy-ivory-floral-arrangement.jpg",
      alt: { en: "Floral arrangement of burgundy and ivory roses, a white orchid and eucalyptus over gold sequin fabric" },
    },
  ],
};
