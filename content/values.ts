import type { LocalizedText } from "./types";

export type Value = {
  title: LocalizedText;
  description: LocalizedText;
};

/** The four-up strip under the hero. */
export const values: Value[] = [
  { title: { en: "Attention to detail", es: "Atención al detalle" }, description: { en: "Every ribbon, label and layout is intentional.", es: "Cada listón, etiqueta y diseño tiene su razón de ser." } },
  { title: { en: "Made with love", es: "Hecho con amor" }, description: { en: "Personal to us, special to you.", es: "Personal para nosotros, especial para ti." } },
  { title: { en: "Custom craftsmanship", es: "Hecho a la medida" }, description: { en: "Designs made with care, never off the shelf.", es: "Diseños hechos con cuidado, nunca genéricos." } },
  { title: { en: "Small-business friendly", es: "Ideal para pequeños negocios" }, description: { en: "Flexible options for brands and teams.", es: "Opciones flexibles para marcas y equipos." } },
];
