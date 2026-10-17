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
  eyebrow: { en: "Events · Decor · Apparel · Gifts", es: "Eventos · Decoración · Ropa · Regalos" },
  headline: {
    before: { en: "Making every moment ", es: "Hacemos de cada momento algo " },
    emphasis: { en: "magical", es: "mágico" },
    after: { en: ".", es: "." },
  },
  subhead: {
    en: "From dreamy weddings and quinceañeras to custom apparel and one-of-a-kind gifts, we craft the moments and memories that last a lifetime.",
    es: "Desde bodas y quinceañeras de ensueño hasta ropa personalizada y regalos únicos, creamos momentos y recuerdos que duran toda la vida.",
  },
  primaryCta: { en: "Plan something amazing", es: "Planea algo increíble" },
  secondaryCta: { en: "See our work", es: "Ve nuestro trabajo" },
  photos: [
    {
      src: "/images/church-altar-love-sign.jpg",
      alt: {
        en: "Church altar decorated for a wedding: white drapes and greenery framing a lit LOVE sign, white flower stands and a white aisle runner",
        es: "Altar de iglesia decorado para una boda: cortinas blancas y follaje alrededor de un letrero iluminado de LOVE, bases con flores blancas y un camino de pasillo blanco",
      },
      kind: "real",
      label: { en: "Real photo: an event you decorated", es: "Foto real: un evento que decoraste" },
    },
    {
      src: "/images/wedding-gift-basket-rose-wine.jpg",
      alt: {
        en: "Wedding gift basket with a lace-wrapped bottle of rosé, two glasses filled with chocolates and ivory flower trim",
        es: "Canasta de regalo de boda con una botella de vino rosado envuelta en encaje, dos copas llenas de chocolates y adornos de flores color marfil",
      },
      kind: "real",
      label: { en: "Real photo: gift basket", es: "Foto real: canasta de regalo" },
    },
    {
      src: "/images/shieldmylot-team-apparel.jpg",
      alt: {
        en: "Custom team apparel S&A made for ShieldMyLot: a gray polo with the ShieldMyLot logo printed on the chest, a navy jacket and a charcoal dress shirt with the logo embroidered",
        es: "Ropa personalizada que S&A hizo para el equipo de ShieldMyLot: una playera polo gris con el logo de ShieldMyLot impreso en el pecho, una chamarra azul marino y una camisa de vestir gris oscuro con el logo bordado",
      },
      kind: "real",
      label: { en: "Real photo: custom apparel", es: "Foto real: ropa personalizada" },
    },
  ],
};
