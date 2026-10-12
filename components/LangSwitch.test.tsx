// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { LangSwitch } from "@/components/LangSwitch";
import { SiteHeader } from "@/components/SiteHeader";
import { headerNav } from "@/content/navigation";
import { locales } from "@/content/types";
import { builtLocales, otherLocale, routeKeys, routes } from "@/lib/routes";

beforeAll(() => {
  // jsdom has no matchMedia (the phone menu uses it once open).
  window.matchMedia ??= ((query: string) =>
    ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList);
});

// LANG_SWITCH: in both languages, the switch goes to the same page in the other language.
describe("EN | ES switch", () => {
  it.each(routeKeys.flatMap((key) => locales.map((locale) => [key, locale] as const)))("%s (%s)", (key, locale) => {
    render(<LangSwitch route={key} locale={locale} locales={["en", "es"]} />);
    const other = otherLocale(locale);
    const link = screen.getByRole("link", { name: other === "en" ? "Read this page in English" : "Ver esta página en español" });

    expect(link.getAttribute("href")).toBe(routes[key][other]);
    expect(link.getAttribute("hreflang")).toBe(other);
    expect(link.getAttribute("lang")).toBe(other);
    expect(screen.getByText(locale.toUpperCase()).getAttribute("aria-current")).toBe("true");
  });

  it("isn't in the header while the site is built in one language", () => {
    render(<SiteHeader links={headerNav} locale="en" route="home" />);
    expect(builtLocales.length > 1).toBe(screen.queryByRole("navigation", { name: "Language" }) !== null);
  });
});
