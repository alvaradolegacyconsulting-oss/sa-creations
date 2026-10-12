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
  { label: { en: "Events" }, section: "services", service: "events" },
  { label: { en: "Decor" }, section: "services", service: "decor" },
  { label: { en: "Apparel" }, section: "services", service: "apparel" },
  { label: { en: "Gifts" }, section: "services", service: "gifts" },
  { label: { en: "Gallery" }, section: "gallery" },
];

export const navLabels = {
  menu: { en: "Menu" },
  mainNav: { en: "Main navigation" },
  footerNav: { en: "Footer" },
  skipToContent: { en: "Skip to content" },
  instagram: { en: "Instagram" },
  facebook: { en: "Facebook" },
  contact: { en: "Contact" },
  season: { en: "This season" },
  languageSwitch: { en: "Language" },
  /** The switch's link to the other language, read in the language it links to (so both are set now). */
  switchTo: { en: "Read this page in English", es: "Ver esta página en español" },
} satisfies Record<string, LocalizedText>;

/** The 404 page, shown for any address that isn't a page (app/global-not-found.tsx). */
export const notFound = {
  title: { en: "Page not found" },
  body: { en: "That page doesn't exist. It may have moved, or the address may have a typo." },
  home: { en: "Go to the home page" },
} satisfies Record<string, LocalizedText>;
