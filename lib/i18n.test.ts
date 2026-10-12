import { describe, expect, it } from "vitest";
import { t } from "@/lib/i18n";
import { sectionHref } from "@/lib/sections";

describe("t", () => {
  it("returns the text in the requested language", () => {
    expect(t({ en: "Hello", es: "Hola" }, "en")).toBe("Hello");
    expect(t({ en: "Hello", es: "Hola" }, "es")).toBe("Hola");
  });

  it.each([
    ["missing", { en: "Hello" }],
    ["empty", { en: "Hello", es: "  " }],
  ])("marks a %s Spanish string visibly instead of passing English off as Spanish", (_name, text) => {
    expect(t(text, "es")).toBe("[TRANSLATE] Hello");
  });
});

describe("links stay in the page's language", () => {
  it("points section links at that language's home page", () => {
    expect(sectionHref("contact", "en")).toBe("/#contact");
    expect(sectionHref("contact", "es")).toBe("/es#contact");
  });
});
