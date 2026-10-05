import { describe, expect, it } from "vitest";
import { headerNav } from "@/content/navigation";
import { hiddenHomeSections } from "@/lib/gallery";
import { visibleLinks } from "@/lib/sections";

const photo = { tag: "wedding" as const, src: "/images/gallery/wedding.jpg", alt: { en: "A wedding" } };

describe("GALLERY_EMPTY_STATE", () => {
  it("hides the gallery section and its nav link when there are no photos", () => {
    const hidden = hiddenHomeSections({ photos: [] });
    expect(hidden).toEqual(["gallery"]);
    expect(visibleLinks(headerNav, hidden).some((link) => link.section === "gallery")).toBe(false);
  });

  it("shows both once one real photo is set", () => {
    const hidden = hiddenHomeSections({ photos: [photo] });
    expect(hidden).toEqual([]);
    expect(visibleLinks(headerNav, hidden).some((link) => link.section === "gallery")).toBe(true);
  });
});
