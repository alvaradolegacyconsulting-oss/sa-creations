import { HomePage } from "@/components/HomePage";
import { defaultLocale } from "@/content/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", defaultLocale);

export default function Page() {
  return <HomePage locale={defaultLocale} />;
}
