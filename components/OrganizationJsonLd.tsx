import { site } from "@/content/site";
import { buildOrganizationJsonLd, serializeJsonLd, siteOrigin } from "@/lib/seo";

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildOrganizationJsonLd(site, siteOrigin(site))) }}
    />
  );
}
