import type { ServiceId } from "./services";
import type { LocalizedText } from "./types";

/** Home-page section anchors. Components use these ids, so a link and its section can't drift apart. */
export const sectionIds = {
  season: "season",
  services: "services",
  gallery: "gallery",
  story: "story",
  contact: "contact",
} as const;

export type SectionKey = keyof typeof sectionIds;

/** A header link: to a section, or to one service card inside the services section. */
export type NavLink = {
  label: LocalizedText;
  section: SectionKey;
  /** Set to scroll to that service's card instead of the top of the section. */
  service?: ServiceId;
};

/** Header links, in order. A link whose section isn't rendered (an empty gallery) is left out. */
export const headerNav: NavLink[] = [
  { label: { en: "Events", es: "Eventos" }, section: "services", service: "events" },
  { label: { en: "Decor", es: "Decoración" }, section: "services", service: "decor" },
  { label: { en: "Apparel", es: "Ropa" }, section: "services", service: "apparel" },
  { label: { en: "Gifts", es: "Regalos" }, section: "services", service: "gifts" },
  { label: { en: "Gallery", es: "Galería" }, section: "gallery" },
];

export const navLabels = {
  menu: { en: "Menu", es: "Menú" },
  mainNav: { en: "Main navigation", es: "Navegación principal" },
  footerNav: { en: "Footer", es: "Pie de página" },
  skipToContent: { en: "Skip to content", es: "Saltar al contenido" },
  instagram: { en: "Instagram", es: "Instagram" },
  facebook: { en: "Facebook", es: "Facebook" },
  contact: { en: "Contact", es: "Contacto" },
  season: { en: "This season", es: "Esta temporada" },
  languageSwitch: { en: "Language", es: "Idioma" },
  /** The switch's link to the other language, read in the language it links to (so both are set now). */
  switchTo: { en: "Read this page in English", es: "Ver esta página en español" },
} satisfies Record<string, LocalizedText>;

/** The 404 page, shown for any address that isn't a page (app/global-not-found.tsx). */
export const notFound = {
  title: { en: "Page not found", es: "Página no encontrada" },
  body: {
    en: "That page doesn't exist. It may have moved, or the address may have a typo.",
    es: "Esa página no existe. Puede que se haya movido o que la dirección tenga un error.",
  },
  home: { en: "Go to the home page", es: "Ir a la página principal" },
} satisfies Record<string, LocalizedText>;
