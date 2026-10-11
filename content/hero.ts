import type { EmphasizedText, LocalizedText, Photo } from "./types";

export type HeroContent = {
  eyebrow: LocalizedText;
  headline: EmphasizedText;
  subhead: LocalizedText;
  /** Scrolls to the contact form. */
  primaryCta: LocalizedText;
  /** Scrolls to the gallery; hidden while the gallery has no photos. */
  secondaryCta: LocalizedText;
  /** The first is the tall arch (the only one on phones); the other two stack beside it on desktop. */
  photos: [Photo, Photo, Photo];
};

export const hero: HeroContent = {
  eyebrow: { en: "Events · Decor · Apparel · Gifts" },
  headline: {
    before: { en: "Making every moment " },
    emphasis: { en: "magical" },
    after: { en: "." },
  },
  subhead: {
    en: "From dreamy weddings and quinceañeras to custom apparel and one-of-a-kind gifts, we craft the moments and memories that last a lifetime.",
  },
  primaryCta: { en: "Plan something amazing" },
  secondaryCta: { en: "See our work" },
  photos: [
    {
      src: "/images/church-altar-love-sign.jpg",
      alt: {
        en: "Church altar decorated for a wedding: white drapes and greenery framing a lit LOVE sign, white flower stands and a white aisle runner",
      },
      label: { en: "Real photo: an event you decorated" },
    },
    {
      src: "/images/wedding-gift-basket-rose-wine.jpg",
      alt: { en: "Wedding gift basket with a lace-wrapped bottle of rosé, two glasses filled with chocolates and ivory flower trim" },
      label: { en: "Real photo: gift basket" },
    },
    {
      src: "/images/burgundy-ivory-floral-arrangement.jpg",
      alt: { en: "Floral arrangement of burgundy and ivory roses, a white orchid and eucalyptus over gold sequin fabric" },
      label: { en: "Real photo: floral arrangement" },
    },
  ],
};
