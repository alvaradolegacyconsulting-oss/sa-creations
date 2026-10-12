import { SeasonPreviewPage, seasonPreviewMetadata } from "@/components/SeasonPreviewPage";
import { alternateLocale } from "@/lib/routes";
import { previewSeasonParams } from "@/lib/seasonPreview";

// Preview sites only: in production there are no params, so every /es/temporada/<id> is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return previewSeasonParams();
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  return seasonPreviewMetadata((await params).id, alternateLocale);
}

export default async function Page({ params }: Props) {
  return <SeasonPreviewPage id={(await params).id} locale={alternateLocale} />;
}
