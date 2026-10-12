import { HomePage } from "@/components/HomePage";
import { site } from "@/content/site";
import { defaultLocale } from "@/content/types";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(site, { path: routes.home[defaultLocale] });

export default function Page() {
  return <HomePage locale={defaultLocale} />;
}
