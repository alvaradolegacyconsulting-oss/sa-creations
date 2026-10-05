import { describe, expect, it } from "vitest";
import { site, type SiteContent } from "@/content/site";
import { isPlaceholder } from "@/content/types";
import { absoluteUrl, buildOrganizationJsonLd, pageMetadata, serializeJsonLd, siteOrigin, sitemapPaths } from "@/lib/seo";

const testSite: SiteContent = {
  ...site,
  url: "https://example.com",
  email: "hello@example.com",
  social: { instagram: "https://instagram.com/example", facebook: undefined },
  phone: undefined,
};

describe("siteOrigin", () => {
  it("uses site.url in production", () => {
    expect(siteOrigin(testSite, { VERCEL_ENV: "production", VERCEL_URL: "x.vercel.app" })).toBe("https://example.com");
  });

  it("uses the preview's own URL on previews, preferring the branch URL", () => {
    expect(siteOrigin(testSite, { VERCEL_ENV: "preview", VERCEL_URL: "abc.vercel.app" })).toBe("https://abc.vercel.app");
    expect(siteOrigin(testSite, { VERCEL_ENV: "preview", VERCEL_URL: "abc.vercel.app", VERCEL_BRANCH_URL: "branch.vercel.app" })).toBe(
      "https://branch.vercel.app",
    );
  });

  it("falls back to localhost for local builds", () => {
    expect(siteOrigin(testSite, {})).toBe("http://localhost:3000");
  });
});

describe("SEO (Organization JSON-LD)", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("https://example.com", "/")).toBe("https://example.com/");
  });

  it("describes S&A Creations as an Organization, legal name the LLC, no street address", () => {
    const jsonLd = buildOrganizationJsonLd(testSite, "https://example.com");

    expect(jsonLd["@type"]).toBe("Organization");
    expect(jsonLd.name).toBe("S&A Creations");
    expect(jsonLd.legalName).toBe("Alvarado Legacy Consulting, LLC");
    expect(jsonLd.email).toBe("hello@example.com");
    expect(jsonLd.sameAs).toEqual(["https://instagram.com/example"]);
    expect("address" in jsonLd).toBe(false);
    expect("telephone" in jsonLd).toBe(false);
    expect("logo" in jsonLd).toBe(false);
    expect("sameAs" in buildOrganizationJsonLd({ ...testSite, social: {} }, "https://example.com")).toBe(false);
  });

  it("adds telephone and logo once they're set", () => {
    const jsonLd = buildOrganizationJsonLd({ ...testSite, phone: { display: "(555) 010-0000", tel: "+15550100000" } }, "https://example.com", "/images/logo.png");
    expect(jsonLd.telephone).toBe("+15550100000");
    expect(jsonLd.logo).toBe("https://example.com/images/logo.png");
  });

  it("gives the home page its canonical, share image and site name", () => {
    const home = pageMetadata(testSite, { path: "/" });

    expect(home.alternates?.canonical).toBe("/");
    expect(home.title).toEqual({ absolute: "S&A Creations | Events, decor, apparel and gifts" });
    expect(home.openGraph).toMatchObject({ siteName: testSite.businessName, images: [{ url: "/opengraph-image" }] });
    expect(home.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: "/opengraph-image" }] });
  });

  it("lists the home page in the sitemap", () => {
    expect(sitemapPaths).toEqual(["/"]);
  });

  it("escapes < so content cannot close the script tag", () => {
    expect(serializeJsonLd({ name: "</script>" })).toBe('{"name":"\\u003c/script>"}');
  });

  it("site.url is an https origin with no trailing slash, or still a placeholder (blocks production)", () => {
    if (!isPlaceholder(site.url)) expect(site.url).toMatch(/^https:\/\/[^/]+$/);
  });
});
