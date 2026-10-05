import type { LocalizedText } from "./types";

export type Value = {
  title: LocalizedText;
  description: LocalizedText;
};

/** The four-up strip under the hero. */
export const values: Value[] = [
  { title: { en: "Attention to detail" }, description: { en: "Every ribbon, label and layout is intentional." } },
  { title: { en: "Made with love" }, description: { en: "Personal to us, special to you." } },
  { title: { en: "Custom craftsmanship" }, description: { en: "Designs made with care, never off the shelf." } },
  { title: { en: "Small-business friendly" }, description: { en: "Flexible options for brands and teams." } },
];
