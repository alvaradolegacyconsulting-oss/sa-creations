import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { siteOrigin, sitemapEntries } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(siteOrigin(site));
}
