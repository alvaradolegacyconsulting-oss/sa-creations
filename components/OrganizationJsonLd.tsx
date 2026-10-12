import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { buildOrganizationJsonLd, serializeJsonLd, siteOrigin } from "@/lib/seo";

export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildOrganizationJsonLd(site, siteOrigin(site), { locale })) }}
    />
  );
}
