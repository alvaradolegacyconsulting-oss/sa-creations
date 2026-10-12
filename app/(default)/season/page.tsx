import { SeasonPage } from "@/components/SeasonPage";
import { SeasonPreviewList } from "@/components/SeasonPreviewList";
import { defaultLocale } from "@/content/types";
import { showSeasonPreviews } from "@/lib/seasonPreview";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("season", defaultLocale);

export default function Page() {
  return <SeasonPage locale={defaultLocale}>{showSeasonPreviews() && <SeasonPreviewList locale={defaultLocale} />}</SeasonPage>;
}
