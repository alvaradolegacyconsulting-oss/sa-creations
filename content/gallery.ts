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
    eyebrow: { en: "Recent work", es: "Trabajos recientes" },
    heading: { before: { en: "Moments we've made", es: "Momentos que hemos creado" } },
  },
  tagLabels: {
    wedding: { en: "Wedding", es: "Boda" },
    quinceanera: { en: "Quinceañera", es: "Quinceañera" },
    "baby-shower": { en: "Baby shower", es: "Baby shower" },
    proposal: { en: "Proposal", es: "Propuesta de matrimonio" },
    "balloon-arch": { en: "Balloon arch", es: "Arco de globos" },
    centerpieces: { en: "Centerpieces", es: "Centros de mesa" },
    "event-shirts": { en: "Event shirts", es: "Camisetas para eventos" },
    "business-merch": { en: "Business merch", es: "Artículos para tu negocio" },
    "gift-basket": { en: "Gift basket", es: "Canasta de regalo" },
    "personalized-sign": { en: "Personalized sign", es: "Letrero personalizado" },
  },
  followCta: { en: "Follow on Instagram", es: "Síguenos en Instagram" },
  // An empty list hides the section and its nav link.
  photos: [
    {
      tag: "wedding",
      src: "/images/church-altar-love-sign.jpg",
      alt: {
        en: "Church altar decorated for a wedding: white drapes and greenery framing a lit LOVE sign, white flower stands and a white aisle runner",
        es: "Altar de iglesia decorado para una boda: cortinas blancas y follaje alrededor de un letrero iluminado de LOVE, bases con flores blancas y un camino de pasillo blanco",
      },
    },
    {
      tag: "baby-shower",
      src: "/images/baby-shower-balloon-arch.jpg",
      alt: {
        en: "Balloon arch in yellow, blue, rust and cow print around an \"It's a Boy Story\" banner, with BABY letter blocks",
        es: "Arco de globos amarillos, azules, color óxido y con estampado de vaca alrededor de un letrero de \"It's a Boy Story\", con cubos de letras que dicen BABY",
      },
    },
    {
      tag: "proposal",
      src: "/images/marry-me-proposal-setup.jpg",
      alt: {
        en: "Outdoor proposal setup: a red carpet lined with candles leading to a MARRY ME marquee sign under red and gold drapes and a greenery garland",
        es: "Decoración al aire libre para una propuesta de matrimonio: una alfombra roja bordeada de velas que lleva a un letrero iluminado de MARRY ME bajo cortinas rojas y doradas y una guirnalda de follaje",
      },
    },
    {
      tag: "gift-basket",
      src: "/images/wedding-gift-basket-rose-wine.jpg",
      alt: {
        en: "Wedding gift basket with a lace-wrapped bottle of rosé, two glasses filled with chocolates and ivory flower trim",
        es: "Canasta de regalo de boda con una botella de vino rosado envuelta en encaje, dos copas llenas de chocolates y adornos de flores color marfil",
      },
    },
    {
      tag: "quinceanera",
      src: "/images/quinceanera-reception-hall.jpg",
      alt: {
        en: "Reception hall set for a quinceañera, with gold satin chair covers, white floral centerpieces and black and gold balloons",
        es: "Salón de recepción preparado para una quinceañera, con fundas de silla de satín dorado, centros de mesa con flores blancas y globos negros y dorados",
      },
    },
    {
      tag: "baby-shower",
      src: "/images/winnie-the-pooh-diaper-cake.jpg",
      alt: {
        en: "Three-tier diaper cake topped with a Winnie-the-Pooh plush, trimmed with yellow flowers, burlap and baby bottles",
        es: "Pastel de pañales de tres pisos con un peluche de Winnie the Pooh arriba, adornado con flores amarillas, yute y biberones",
      },
    },
    {
      tag: "wedding",
      src: "/images/church-aisle-pew-garlands.jpg",
      alt: {
        en: "Church aisle set for a wedding, with a white runner, scattered petals and flower garlands on every pew",
        es: "Pasillo de iglesia preparado para una boda, con un camino blanco, pétalos esparcidos y guirnaldas de flores en cada banca",
      },
    },
    {
      tag: "proposal",
      src: "/images/proposal-candle-heart.jpg",
      alt: {
        en: "Heart of tea-light candles on a red runner, with rose petals and a pillar candle on the grass",
        es: "Corazón de velitas sobre un camino rojo, con pétalos de rosa y una vela de pilar sobre el pasto",
      },
    },
    {
      tag: "baby-shower",
      src: "/images/pink-diaper-cake-gift-table.jpg",
      alt: {
        en: "Pink diaper cake with a bunny plush and fabric bows, beside gift bags on a pink table",
        es: "Pastel de pañales rosa con un peluche de conejito y moños de tela, junto a bolsas de regalo en una mesa rosa",
      },
    },
    {
      tag: "proposal",
      src: "/images/burgundy-ivory-floral-arrangement.jpg",
      alt: {
        en: "Floral arrangement of burgundy and ivory roses, a white orchid and eucalyptus over gold sequin fabric",
        es: "Arreglo floral de rosas color vino y marfil, una orquídea blanca y eucalipto sobre tela dorada de lentejuelas",
      },
    },
  ],
};
