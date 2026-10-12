import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { reviewDoc } from "@/lib/review";

describe("docs/REVIEW.md", () => {
  it("is up to date with content/ (run npm run review)", () => {
    expect(readFileSync(new URL("../docs/REVIEW.md", import.meta.url), "utf8")).toBe(reviewDoc(content));
  });

  it("lists each text once with English and Spanish, marking missing Spanish", () => {
    const doc = reviewDoc({
      hero: { a: { en: "Hello", es: "Hola" }, b: { en: "Gifts" } },
      gallery: { alt: { en: "Hello", es: "Hola" } },
    });
    expect(doc).toContain("| `hero.a` (also `gallery.alt`) | Hello | Hola |");
    expect(doc).toContain("| `hero.b` | Gifts | — |");
    expect(doc).toContain("2 pieces of text; 1 still without Spanish");
  });

  it("escapes a | so it can't break the table", () => {
    expect(reviewDoc({ site: { a: { en: "A | B" } } })).toContain("| A \\| B |");
  });
});
