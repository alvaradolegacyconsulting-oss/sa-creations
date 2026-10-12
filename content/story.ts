import type { LocalizedText, SectionIntro } from "./types";

export type StoryContent = {
  intro: SectionIntro;
  body: LocalizedText;
  /** `reference` names the Bible version, so it differs by language too. */
  verse: { text: LocalizedText; reference: LocalizedText };
};

export const story: StoryContent = {
  intro: {
    eyebrow: { en: "Our story", es: "Nuestra historia" },
    heading: { before: { en: "Partners in your story, not just vendors.", es: "Somos parte de tu historia, no solo proveedores." } },
  },
  body: {
    en: "S&A Creations was born from a love of bringing joy to life's biggest moments. Every celebration deserves to be as unique as the people in it. From hand-crafted gifts to full-scale event coordination, we bring creativity and care to everything we touch.",
    es: "S&A Creations nació del gusto por llenar de alegría los momentos más importantes de la vida. Cada celebración merece ser tan única como las personas que la viven. Desde regalos hechos a mano hasta la coordinación completa de eventos, ponemos creatividad y cariño en todo lo que hacemos.",
  },
  verse: {
    text: {
      en: "Whatever you do, work at it with all your heart, as working for the Lord.",
      es: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor.",
    },
    reference: { en: "Colossians 3:23 (NIV)", es: "Colosenses 3:23 (RVR1960)" },
  },
};
