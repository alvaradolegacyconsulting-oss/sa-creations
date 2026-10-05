import type { LocalizedText, SectionIntro } from "./types";

export type StoryContent = {
  intro: SectionIntro;
  body: LocalizedText;
  verse: { text: LocalizedText; reference: string };
};

export const story: StoryContent = {
  intro: {
    eyebrow: { en: "Our story" },
    heading: { before: { en: "Partners in your story, not just vendors." } },
  },
  body: {
    en: "S&A Creations was born from a love of bringing joy to life's biggest moments. Every celebration deserves to be as unique as the people in it. From hand-crafted gifts to full-scale event coordination, we bring creativity and care to everything we touch.",
  },
  verse: {
    text: { en: "Whatever you do, work at it with all your heart, as working for the Lord." },
    reference: "Colossians 3:23 (NIV)",
  },
};
