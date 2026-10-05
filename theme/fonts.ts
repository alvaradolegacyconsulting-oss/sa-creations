import { Cormorant_Garamond, Jost } from "next/font/google";

// next/font only accepts literal options, so these mirror theme.font in tokens.ts.
export const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const bodyFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
});
