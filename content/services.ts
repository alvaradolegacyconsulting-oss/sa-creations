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
  eyebrow: { en: "What we do" },
  heading: { before: { en: "Every occasion, beautifully handled" } },
};

export const services: Service[] = [
  {
    id: "events",
    title: { en: "Event planning" },
    description: {
      en: "Full-service planning for your most important milestones. We handle every detail so you can be fully present.",
    },
    items: [
      { en: "Weddings" },
      { en: "Quinceañeras" },
      { en: "Baby showers" },
      { en: "Birthdays" },
      { en: "Special occasions" },
    ],
    cta: { en: "Plan your event" },
    photo: {
      src: "/images/church-aisle-pew-garlands.jpg",
      alt: { en: "Church aisle set for a wedding, with a white runner, scattered petals and flower garlands on every pew" },
      label: { en: "Real photo" },
    },
  },
  {
    id: "decor",
    title: { en: "Custom decor" },
    description: { en: "Personalized decor that turns any venue into an unforgettable experience." },
    items: [
      { en: "Centerpieces" },
      { en: "Backdrops" },
      { en: "Balloon arches" },
      { en: "Floral arrangements" },
      { en: "Table setups" },
    ],
    cta: { en: "Design your decor" },
    photo: {
      src: "/images/baby-shower-balloon-arch.jpg",
      alt: { en: "Balloon arch in yellow, blue, rust and cow print around an \"It's a Boy Story\" banner, with BABY letter blocks" },
      label: { en: "Real photo" },
    },
  },
  {
    id: "apparel",
    title: { en: "Custom apparel" },
    description: { en: "Branded and personalized clothing and accessories for small businesses and special events." },
    items: [
      { en: "T-shirts" },
      { en: "Hoodies" },
      { en: "Business merch" },
      { en: "Event shirts" },
      { en: "Hats and bags" },
    ],
    cta: { en: "Order apparel" },
    // No real apparel photo yet; the card renders without one on purpose.
    photo: { kind: "none" },
  },
  {
    id: "gifts",
    title: { en: "Custom gifts" },
    description: { en: "Thoughtful, handcrafted gifts made with care for every person and occasion." },
    items: [
      { en: "Gift baskets" },
      { en: "Custom frames" },
      { en: "Mugs and tumblers" },
      { en: "Keychains" },
      { en: "Personalized signs" },
    ],
    cta: { en: "Create a gift" },
    photo: {
      src: "/images/winnie-the-pooh-diaper-cake.jpg",
      alt: { en: "Three-tier diaper cake topped with a Winnie-the-Pooh plush, trimmed with yellow flowers, burlap and baby bottles" },
      label: { en: "Real photo" },
    },
  },
];
