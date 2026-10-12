import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { alternateLocale, hasAlternate } from "@/lib/routes";
import { rootMetadata } from "@/lib/seo";
import "../../globals.css";

// Spanish, served at "/es" once content/site.ts languages lists "es"; until then there are no params and
// "/es" is a 404. [alt] never has any other value: "/fr" or "/xyz" is a 404 (app/global-not-found.tsx).
export const dynamicParams = false;

export function generateStaticParams() {
  return hasAlternate() ? [{ alt: alternateLocale }] : [];
}

export const metadata = rootMetadata(alternateLocale);

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale={alternateLocale}>{children}</RootDocument>;
}
