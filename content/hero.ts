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
      src: null,
      alt: { en: "[PLACEHOLDER: describe the event photo]" },
      label: { en: "Real photo: an event you decorated" },
    },
    {
      src: null,
      alt: { en: "[PLACEHOLDER: describe the gift basket photo]" },
      label: { en: "Real photo: gift basket" },
    },
    {
      src: null,
      alt: { en: "[PLACEHOLDER: describe the custom shirt photo]" },
      label: { en: "Real photo: custom shirt" },
    },
  ],
};
