import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { site } from "@/content/site";
import { collectPhotos, findMissingPhotos, findPlaceholders, findStockPhotos, findUntranslated, runGates } from "@/lib/gates";

const englishOnly = { languages: ["en" as const], translationsReviewed: false };
const bilingual = (translationsReviewed: boolean) => ({ languages: ["en" as const, "es" as const], translationsReviewed });
const gate = (gates: ReturnType<typeof runGates>, name: string) => gates.find((g) => g.name === name)!;

describe("PLACEHOLDERS_RESOLVED", () => {
  it("finds placeholders at any depth, with their path", () => {
    expect(findPlaceholders({ a: [{ b: "[PLACEHOLDER: x]" }], c: "fine" }, "site")).toEqual(["site.a[0].b: [PLACEHOLDER: x]"]);
  });

  it("finds photos whose src is still null", () => {
    const photos = [
      { src: null, alt: { en: "x" }, kind: "real", label: { en: "Real photo: cake" } },
      { src: "/images/a.jpg", alt: { en: "y" }, kind: "real", label: { en: "Real photo: arch" } },
    ];
    expect(findMissingPhotos(photos, "hero.photos")).toEqual(["hero.photos[0].src is null (Real photo: cake)"]);
  });

  it("accepts an intentional no-photo marker but not a missing photo", () => {
    const services = [{ photo: { kind: "none" } }, { photo: { src: null, alt: { en: "x" }, kind: "real", label: { en: "Real photo" } } }];
    expect(runGates({ services }, englishOnly)[0].problems).toEqual(["services[1].photo.src is null (Real photo)"]);
  });

  it("does not treat an empty gallery as a problem", () => {
    expect(runGates({ gallery: { photos: [] } }, englishOnly)[0].problems).toEqual([]);
  });

  it("passes clean content", () => {
    expect(runGates({ site: { url: "https://example.com" } }, englishOnly).every((g) => g.problems.length === 0)).toBe(true);
  });

  it("currently fails on the open questions (expected until Jose answers them)", () => {
    const problems = runGates(content, site)[0].problems.join("\n");
    expect(problems).toContain("site.url");
    expect(problems).toContain("site.email");
    expect(problems).not.toContain("src is null");
  });
});

describe("TRANSLATIONS_COMPLETE", () => {
  const text = {
    hero: { headline: { en: "Hello", es: "Hola" }, items: [{ en: "Gifts" }, { en: "Decor", es: "" }, { en: "Cake", es: "[TRANSLATE] Cake" }] },
    redirects: [{ from: "/a", to: "/" }],
  };

  it("lists every missing, empty or marked Spanish string by path, and nothing else", () => {
    expect(findUntranslated(text)).toEqual([
      "hero.items[0].es is missing (en: Gifts)",
      "hero.items[1].es is empty (en: Decor)",
      "hero.items[2].es: [TRANSLATE] Cake",
    ]);
  });

  it("doesn't apply while the site is English only", () => {
    expect(gate(runGates(text, englishOnly), "TRANSLATIONS_COMPLETE").problems).toEqual([]);
  });

  it("fails once Spanish is built, and passes when every string has Spanish", () => {
    expect(gate(runGates(text, bilingual(true)), "TRANSLATIONS_COMPLETE").problems).toHaveLength(3);
    expect(gate(runGates({ hero: { headline: { en: "Hello", es: "Hola" } } }, bilingual(true)), "TRANSLATIONS_COMPLETE").problems).toEqual([]);
  });
});

describe("TRANSLATIONS_REVIEWED", () => {
  it("fails while Spanish is built and not signed off, and passes once it is (or while English only)", () => {
    expect(gate(runGates({}, bilingual(false)), "TRANSLATIONS_REVIEWED").problems).toHaveLength(1);
    expect(gate(runGates({}, bilingual(true)), "TRANSLATIONS_REVIEWED").problems).toEqual([]);
    expect(gate(runGates({}, englishOnly), "TRANSLATIONS_REVIEWED").problems).toEqual([]);
  });
});

describe("STOCK_IN_USE (never fails)", () => {
  const stock = (src: string | null, sourceUrl?: string) => ({ src, alt: { en: "A gift basket" }, kind: "stock", sourceUrl, label: { en: "Stock photo" } });

  it("lists each stock photo on the site with its source, and skips real ones and files not supplied yet", () => {
    const content = {
      seasonal: { seasons: [{ photo: stock("/images/seasonal/fall-2026.jpg", "https://stock.example/123") }, { photo: stock("/images/seasonal/x.jpg") }, { photo: stock(null) }] },
      hero: { photos: [{ src: "/images/a.jpg", alt: { en: "y" }, kind: "real", label: { en: "Real photo" } }] },
    };
    expect(findStockPhotos(content)).toEqual([
      "seasonal.seasons[0].photo: /images/seasonal/fall-2026.jpg (source: https://stock.example/123)",
      "seasonal.seasons[1].photo: /images/seasonal/x.jpg (source: not recorded)",
    ]);
  });

  it("is not one of the gates, so stock never blocks production", () => {
    expect(runGates({}, englishOnly).map((g) => g.name)).not.toContain("STOCK_IN_USE");
  });
});

describe("photo sources in content", () => {
  const photos = Object.entries(content).flatMap(([name, value]) => collectPhotos(value, name));

  it("uses stock only for seasons; everything else is S&A's own work", () => {
    for (const { path, photo } of photos) {
      if (photo.kind === "stock") expect(path).toMatch(/^seasonal\./);
    }
  });

  it("never describes a stock photo as S&A's work", () => {
    const claims = /S&A|\bour\b|\bwe\b|\bnuestr|hecho por nosotros/i;
    for (const { photo } of photos.filter(({ photo }) => photo.kind === "stock")) {
      for (const text of [photo.alt.en, photo.alt.es ?? "", photo.label.en, photo.label.es ?? ""]) expect(text).not.toMatch(claims);
    }
  });
});
