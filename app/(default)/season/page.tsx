import { SeasonPage } from "@/components/SeasonPage";
import { defaultLocale } from "@/content/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("season", defaultLocale);

export default function Page() {
  return <SeasonPage locale={defaultLocale} />;
}
