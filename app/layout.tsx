import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { site } from "@/content/site";
import { defaultLocale } from "@/content/types";
import { siteOrigin } from "@/lib/seo";
import "./globals.css";

// Each page exports pageMetadata() from lib/seo.ts; this sets the base URL and title template.
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin(site)),
  title: {
    default: `${site.businessName} | ${site.tagline.en}`,
    template: `%s | ${site.businessName}`,
  },
  description: site.description.en,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale={defaultLocale}>{children}</RootDocument>;
}
