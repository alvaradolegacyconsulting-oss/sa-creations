import type { LocalizedText } from "./types";

/**
 * Links to the S&A online shop. Sayra opens and closes the shop from her portal, and the shop page
 * explains itself while it's closed, so this site never checks whether it's open: these are plain
 * links, followed in the same tab. They're on another domain, so they're not in the sitemap.
 */
export type ShopContent = {
  /** The shop's home page: "Shop" in the header, the phone menu and the footer. */
  url: string;
  /** The shop's quote request page: "Request a quote" in the footer and beside the contact form. */
  quoteUrl: string;
  labels: {
    shop: LocalizedText;
    quote: LocalizedText;
  };
};

export const shop: ShopContent = {
  url: "https://shop.sacustomcreations.com",
  quoteUrl: "https://shop.sacustomcreations.com/request",
  labels: {
    shop: { en: "Shop", es: "Tienda" },
    quote: { en: "Request a quote", es: "Solicitar cotización" },
  },
};
