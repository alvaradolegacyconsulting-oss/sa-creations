import { SeasonPage } from "@/components/SeasonPage";
import { alternateLocale } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("season", alternateLocale);

export default function Page() {
  return <SeasonPage locale={alternateLocale} />;
}
