import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { defaultLocale } from "@/content/types";
import { rootMetadata } from "@/lib/seo";
import "../globals.css";

// The default language (English), served at "/". Spanish is app/(alternate)/[alt], at "/es".
export const metadata = rootMetadata(defaultLocale);

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale={defaultLocale}>{children}</RootDocument>;
}
