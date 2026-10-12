import { placeholder, type Locale, type LocalizedText } from "./types";

export type SiteContent = {
  /**
   * The languages the site is built in. English is always served at "/"; adding "es" builds the
   * Spanish site at "/es", shows the EN | ES switch and makes production require every Spanish string.
   */
  languages: Locale[];
  /**
   * Set to true only after S&A has signed off the Spanish (docs/REVIEW.md). While Spanish is built and
   * this is false, production is blocked (TRANSLATIONS_REVIEWED), so unreviewed drafts never ship.
   */
  translationsReviewed: boolean;
  /** Production origin, no trailing slash. Previews use their own Vercel URL (lib/seo.ts). */
  url: string;
  businessName: string;
  /** The LLC that S&A Creations is a DBA of; JSON-LD legalName. */
  legalName: string;
  /** The two halves of the text wordmark: "S&A" in copper (gold on dark), "Creations" in navy. */
  wordmark: { top: string; bottom: string };
  /** Second half of the home page title, after the business name. */
  tagline: LocalizedText;
  /** Default meta description and JSON-LD description. */
  description: LocalizedText;
  /** Header button; links to the contact section. */
  headerCta: LocalizedText;
  /** Inquiry inbox: shown in the contact section and in the form's failure message. */
  email: string;
  /** Leave undefined to publish no phone number; every tel: link is then left out. */
  phone?: { display: string; tel: string };
  /** Leave a link undefined until confirmed; its footer link and JSON-LD sameAs are then left out. */
  social: { instagram?: string; facebook?: string };
  /** Footer line after the copyright. */
  footerNote: LocalizedText;
};

export const site: SiteContent = {
  languages: ["en", "es"],
  translationsReviewed: false,
  url: placeholder("production domain, e.g. https://sacreations.com"),
  businessName: "S&A Creations",
  legalName: "Alvarado Legacy Consulting, LLC",
  wordmark: { top: "S&A", bottom: "Creations" },
  tagline: { en: "Events, decor, apparel and gifts", es: "Eventos, decoración, ropa y regalos" },
  description: {
    en: "From dreamy weddings and quinceañeras to custom apparel and one-of-a-kind gifts, we craft the moments and memories that last a lifetime.",
    es: "Desde bodas y quinceañeras de ensueño hasta ropa personalizada y regalos únicos, creamos momentos y recuerdos que duran toda la vida.",
  },
  headerCta: { en: "Free consultation", es: "Consulta gratis" },
  email: placeholder("inquiry email"),
  // Open question: phone to publish. Undefined publishes none (content/pending.ts).
  phone: undefined,
  // Open question: Instagram and Facebook URLs (content/pending.ts).
  social: { instagram: undefined, facebook: undefined },
  footerNote: {
    en: "S&A Creations is a DBA of Alvarado Legacy Consulting, LLC.",
    es: "S&A Creations es el nombre comercial (DBA) de Alvarado Legacy Consulting, LLC.",
  },
};
