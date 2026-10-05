import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { findMissingPhotos, findPlaceholders, runGates } from "@/lib/gates";

describe("PLACEHOLDERS_RESOLVED", () => {
  it("finds placeholders at any depth, with their path", () => {
    expect(findPlaceholders({ a: [{ b: "[PLACEHOLDER: x]" }], c: "fine" }, "site")).toEqual(["site.a[0].b: [PLACEHOLDER: x]"]);
  });

  it("finds photos whose src is still null", () => {
    const photos = [
      { src: null, alt: { en: "x" }, label: { en: "Real photo: cake" } },
      { src: "/images/a.jpg", alt: { en: "y" }, label: { en: "Real photo: arch" } },
    ];
    expect(findMissingPhotos(photos, "hero.photos")).toEqual(["hero.photos[0].src is null (Real photo: cake)"]);
  });

  it("does not treat an empty gallery as a problem", () => {
    expect(runGates({ gallery: { photos: [] } })[0].problems).toEqual([]);
  });

  it("passes clean content", () => {
    expect(runGates({ site: { url: "https://example.com" } })).toEqual([{ name: "PLACEHOLDERS_RESOLVED", problems: [] }]);
  });

  it("currently fails on the open questions (expected until Jose answers them)", () => {
    const problems = runGates(content)[0].problems.join("\n");
    expect(problems).toContain("site.url");
    expect(problems).toContain("site.email");
    expect(problems).toContain("hero.photos[0].src is null");
  });
});
