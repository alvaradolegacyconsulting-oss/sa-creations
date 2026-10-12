import { SeasonPage } from "@/components/SeasonPage";
import { SeasonPreviewList } from "@/components/SeasonPreviewList";
import { alternateLocale } from "@/lib/routes";
import { showSeasonPreviews } from "@/lib/seasonPreview";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("season", alternateLocale);

export default function Page() {
  return <SeasonPage locale={alternateLocale}>{showSeasonPreviews() && <SeasonPreviewList locale={alternateLocale} />}</SeasonPage>;
}
