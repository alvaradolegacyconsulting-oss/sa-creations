// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { headerNav } from "@/content/navigation";
import { shop } from "@/content/shop";
import { locales, type Locale } from "@/content/types";
import { t } from "@/lib/i18n";

beforeAll(() => {
  // jsdom has no matchMedia (the phone menu uses it once open).
  window.matchMedia ??= ((query: string) =>
    ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList);
});

/** A shop link is a plain link to its URL that opens in the same tab. */
function expectSameTab(link: HTMLElement, href: string) {
  expect(link.getAttribute("href")).toBe(href);
  expect(link.hasAttribute("target")).toBe(false);
}

const mainNav = (locale: Locale) => (locale === "es" ? "Navegación principal" : "Main navigation");

describe.each(locales)("shop links (%s)", (locale) => {
  it("Shop is in the header and the phone menu, same tab", async () => {
    render(<SiteHeader links={headerNav} locale={locale} route="home" />);
    const name = t(shop.labels.shop, locale);

    const [desktop] = screen.getAllByRole("navigation", { name: mainNav(locale) });
    expectSameTab(within(desktop).getByRole("link", { name }), shop.url);

    await userEvent.setup().click(screen.getByRole("button", { name: locale === "es" ? "Menú" : "Menu" }));
    const phone = document.getElementById("mobile-navigation")!;
    expectSameTab(within(phone).getByRole("link", { name }), shop.url);
  });

  it("Shop and Request a quote are in the footer, same tab", () => {
    render(<SiteFooter locale={locale} />);
    const footer = screen.getByRole("navigation", { name: locale === "es" ? "Pie de página" : "Footer" });

    expectSameTab(within(footer).getByRole("link", { name: t(shop.labels.shop, locale) }), shop.url);
    expectSameTab(within(footer).getByRole("link", { name: t(shop.labels.quote, locale) }), shop.quoteUrl);
  });
});
