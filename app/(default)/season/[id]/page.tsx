import { SeasonPreviewPage, seasonPreviewMetadata } from "@/components/SeasonPreviewPage";
import { defaultLocale } from "@/content/types";
import { previewSeasonParams } from "@/lib/seasonPreview";

// Preview sites only: in production there are no params, so every /season/<id> is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return previewSeasonParams();
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  return seasonPreviewMetadata((await params).id, defaultLocale);
}

export default async function Page({ params }: Props) {
  return <SeasonPreviewPage id={(await params).id} locale={defaultLocale} />;
}
