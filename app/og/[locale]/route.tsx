import type { Locale } from "@/content/types";
import { renderOgImage } from "@/lib/og";
import { builtLocales } from "@/lib/routes";

// Share images at fixed URLs (/og/en, /og/es), built at deploy time (from Sampayo). Not the
// opengraph-image file convention: inside a route group its URL gets a hash, and a page's openGraph
// object replaces it anyway. Only the languages the site is built in get one.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return builtLocales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!builtLocales.includes(locale as Locale)) return new Response("Not found", { status: 404 });
  return renderOgImage(locale as Locale);
}
