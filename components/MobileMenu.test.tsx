// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { MobileMenu } from "@/components/MobileMenu";

beforeAll(() => {
  // jsdom has no matchMedia.
  window.matchMedia ??= ((query: string) =>
    ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList);
});

const links = [
  { label: "Events", href: "/#service-events" },
  { label: "Decor", href: "/#service-decor" },
];

function setup() {
  render(<MobileMenu links={links} cta={{ label: "Free consultation", href: "/#contact" }} label="Menu" navLabel="Main navigation" />);
  return { user: userEvent.setup(), button: screen.getByRole("button", { name: "Menu" }) };
}

describe("MobileMenu", () => {
  it("opens and closes with the same accessible name, state in aria-expanded", async () => {
    const { user, button } = setup();
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation")).toBeNull();

    await user.click(button);
    expect(screen.getByRole("button", { name: "Menu" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
  });

  it("closes on Escape and returns focus to the button", async () => {
    const { user, button } = setup();
    await user.click(button);
    await user.tab();
    expect(document.activeElement?.textContent).toBe("Events");

    await user.keyboard("{Escape}");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("keeps Tab focus inside the open menu", async () => {
    const { user, button } = setup();
    await user.click(button);
    await user.tab(); // Events
    await user.tab(); // Decor
    await user.tab(); // Free consultation
    await user.tab(); // wraps to the button
    expect(document.activeElement).toBe(button);
    await user.tab({ shift: true }); // back to the last link
    expect(document.activeElement?.textContent).toBe("Free consultation");
  });

  it("closes on a click outside and when a link is followed", async () => {
    const { user, button } = setup();
    await user.click(button);
    await user.click(document.body);
    expect(button.getAttribute("aria-expanded")).toBe("false");

    await user.click(button);
    await user.click(screen.getByRole("link", { name: "Decor" }));
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
});
