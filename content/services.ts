import type { LocalizedText, NoPhoto, Photo, SectionIntro } from "./types";

/** Also the contact form's service checkbox values and the ?service= preselect. */
export type ServiceId = "events" | "decor" | "apparel" | "gifts";

export type Service = {
  id: ServiceId;
  title: LocalizedText;
  description: LocalizedText;
  items: LocalizedText[];
  /** Link to the contact form with this service checked. An arrow is added after it. */
  cta: LocalizedText;
  /** `{ kind: "none" }` renders the card without a photo, on purpose. */
  photo: Photo | NoPhoto;
};

export const servicesSection: SectionIntro = {
  eyebrow: { en: "What we do", es: "Lo que hacemos" },
  heading: { before: { en: "Every occasion, beautifully handled", es: "Cada ocasión, con todo el cuidado que merece" } },
};

export const services: Service[] = [
  {
    id: "events",
    title: { en: "Event planning", es: "Planeación de eventos" },
    description: {
      en: "Full-service planning for your most important milestones. We handle every detail so you can be fully present.",
      es: "Planeación completa para tus momentos más importantes. Nos encargamos de cada detalle para que tú disfrutes al máximo.",
    },
    items: [
      { en: "Weddings", es: "Bodas" },
      { en: "Quinceañeras", es: "Quinceañeras" },
      { en: "Baby showers", es: "Baby showers" },
      { en: "Birthdays", es: "Cumpleaños" },
      { en: "Special occasions", es: "Ocasiones especiales" },
    ],
    cta: { en: "Plan your event", es: "Planea tu evento" },
    photo: {
      src: "/images/church-aisle-pew-garlands.jpg",
      alt: {
        en: "Church aisle set for a wedding, with a white runner, scattered petals and flower garlands on every pew",
        es: "Pasillo de iglesia preparado para una boda, con un camino blanco, pétalos esparcidos y guirnaldas de flores en cada banca",
      },
      kind: "real",
      label: { en: "Real photo", es: "Foto real" },
    },
  },
  {
    id: "decor",
    title: { en: "Custom decor", es: "Decoración personalizada" },
    description: {
      en: "Personalized decor that turns any venue into an unforgettable experience.",
      es: "Decoración personalizada que convierte cualquier lugar en una experiencia inolvidable.",
    },
    items: [
      { en: "Centerpieces", es: "Centros de mesa" },
      { en: "Backdrops", es: "Fondos decorativos" },
      { en: "Balloon arches", es: "Arcos de globos" },
      { en: "Floral arrangements", es: "Arreglos florales" },
      { en: "Table setups", es: "Montaje de mesas" },
    ],
    cta: { en: "Design your decor", es: "Diseña tu decoración" },
    photo: {
      src: "/images/baby-shower-balloon-arch.jpg",
      alt: {
        en: "Balloon arch in yellow, blue, rust and cow print around an \"It's a Boy Story\" banner, with BABY letter blocks",
        es: "Arco de globos amarillos, azules, color óxido y con estampado de vaca alrededor de un letrero de \"It's a Boy Story\", con cubos de letras que dicen BABY",
      },
      kind: "real",
      label: { en: "Real photo", es: "Foto real" },
    },
  },
  {
    id: "apparel",
    title: { en: "Custom apparel", es: "Ropa personalizada" },
    description: {
      en: "Branded and personalized clothing and accessories for small businesses and special events.",
      es: "Ropa y accesorios con tu marca o personalizados para pequeños negocios y eventos especiales.",
    },
    items: [
      { en: "T-shirts", es: "Camisetas" },
      { en: "Hoodies", es: "Sudaderas" },
      { en: "Business merch", es: "Artículos para tu negocio" },
      { en: "Event shirts", es: "Camisetas para eventos" },
      { en: "Hats and bags", es: "Gorras y bolsas" },
    ],
    cta: { en: "Order apparel", es: "Pide tu ropa" },
    // No real apparel photo yet; the card renders without one on purpose.
    photo: { kind: "none" },
  },
  {
    id: "gifts",
    title: { en: "Custom gifts", es: "Regalos personalizados" },
    description: {
      en: "Thoughtful, handcrafted gifts made with care for every person and occasion.",
      es: "Regalos hechos a mano con cariño, pensados para cada persona y cada ocasión.",
    },
    items: [
      { en: "Gift baskets", es: "Canastas de regalo" },
      { en: "Custom frames", es: "Marcos personalizados" },
      { en: "Mugs and tumblers", es: "Tazas y termos" },
      { en: "Keychains", es: "Llaveros" },
      { en: "Personalized signs", es: "Letreros personalizados" },
    ],
    cta: { en: "Create a gift", es: "Crea un regalo" },
    photo: {
      src: "/images/winnie-the-pooh-diaper-cake.jpg",
      alt: {
        en: "Three-tier diaper cake topped with a Winnie-the-Pooh plush, trimmed with yellow flowers, burlap and baby bottles",
        es: "Pastel de pañales de tres pisos con un peluche de Winnie the Pooh arriba, adornado con flores amarillas, yute y biberones",
      },
      kind: "real",
      label: { en: "Real photo", es: "Foto real" },
    },
  },
];
