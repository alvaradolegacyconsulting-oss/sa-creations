import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { absoluteUrl, siteOrigin, sitemapPaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths.map((path) => ({ url: absoluteUrl(siteOrigin(site), path) }));
}
