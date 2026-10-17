// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/ContactForm";
import { ContactSection } from "@/components/ContactSection";
import { SeasonFeature } from "@/components/SeasonFeature";
import { ServicesSection } from "@/components/ServicesSection";
import { contact } from "@/content/contact";
import { seasonal, type Season } from "@/content/seasonal";
import { site } from "@/content/site";
import { contactLimits } from "@/lib/contact";

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

const submit = () => screen.getByRole("button", { name: contact.submit.en });

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Maria Lopez");
  await user.type(screen.getByLabelText("Email"), "maria@example.com");
  await user.type(screen.getByLabelText("Tell us about it"), "Quinceañera in June, about 120 guests.");
}

const testPhone = { display: "832-555-0100", tel: "+18325550100" };

/** Renders with a phone number in content/site.ts, whatever it holds today. */
function withPhone(run: () => Promise<void> | void) {
  return async () => {
    const saved = site.phone;
    site.phone = testPhone;
    try {
      await run();
    } finally {
      site.phone = saved;
    }
  };
}

describe("phone links (CONTACT_LINKS)", () => {
  it(
    "offers call (tel:) and text (sms:) links when there's a phone number",
    withPhone(() => {
      render(<ContactSection locale="en" />);
      expect(screen.getByRole("link", { name: `Call ${testPhone.display}` }).getAttribute("href")).toBe(`tel:${testPhone.tel}`);
      expect(screen.getByRole("link", { name: `Text ${testPhone.display}` }).getAttribute("href")).toBe(`sms:${testPhone.tel}`);
    }),
  );

  it("leaves both out when there's no phone number", () => {
    const saved = site.phone;
    site.phone = undefined;
    try {
      render(<ContactSection locale="en" />);
      expect(document.querySelector('a[href^="tel:"], a[href^="sms:"]')).toBeNull();
    } finally {
      site.phone = saved;
    }
  });

  it(
    "puts the phone number in the failure message",
    withPhone(async () => {
      vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("Not found", { status: 404 }))));
      const user = userEvent.setup();
      render(<ContactForm locale="en" />);
      await fillRequired(user);
      await user.click(submit());

      const alert = await screen.findByRole("alert");
      expect(alert.textContent).toContain(`${contact.failurePhone.en} ${testPhone.display}.`);
      expect(screen.getByRole("link", { name: testPhone.display }).getAttribute("href")).toBe(`tel:${testPhone.tel}`);
    }),
  );
});

describe("ContactForm (FORM_UI)", () => {
  it("blocks an empty submit with an inline message and sends nothing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);

    await user.click(submit());
    expect(screen.getByRole("alert").textContent).toContain(contact.invalid.en);
    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "maria-at-example");

    await user.click(submit());
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");
  });

  it("catches an address the server would reject (maria@email) before sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "maria@email");

    await user.click(submit());
    expect(screen.getByRole("alert").textContent).toContain(contact.invalid.en);
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(screen.getByLabelText("Email"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a field the server rejected as a field to fix, not a failed send, keeping what was typed", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response('{"ok":false,"reason":"invalid","fields":["email"]}', { status: 400 }))));
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);

    await user.click(submit());
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(contact.invalid.en);
    expect(alert.textContent).not.toContain(contact.failure.en);
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(screen.getByLabelText("Email"));
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Maria Lopez");
  });

  it("limits each field to what the server accepts", () => {
    render(<ContactForm locale="en" />);
    expect((screen.getByLabelText("Name") as HTMLInputElement).maxLength).toBe(contactLimits.name);
    expect((screen.getByLabelText("Email") as HTMLInputElement).maxLength).toBe(contactLimits.email);
    expect((screen.getByLabelText(/Phone/) as HTMLInputElement).maxLength).toBe(contactLimits.phone);
    expect((screen.getByLabelText("Tell us about it") as HTMLTextAreaElement).maxLength).toBe(contactLimits.details);
  });

  it("shows a pending state while sending", async () => {
    let finish: (response: Response) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((resolve) => (finish = resolve))));
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);

    await user.click(submit());
    const pending = screen.getByRole("button", { name: contact.pending.en });
    expect((pending as HTMLButtonElement).disabled).toBe(true);
    finish(new Response('{"ok":true}', { status: 200 }));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it.each([
    ["a missing route (404)", () => Promise.resolve(new Response("Not found", { status: 404 }))],
    ["a network error", () => Promise.reject(new TypeError("Failed to fetch"))],
    ["ok: false", () => Promise.resolve(new Response('{"ok":false,"error":"x"}', { status: 200 }))],
    ["a send failure (bad API key)", () => Promise.resolve(new Response('{"ok":false,"reason":"send-failed"}', { status: 502 }))],
  ])("on %s shows the email address and keeps every field filled", async (_name, reply) => {
    vi.stubGlobal("fetch", vi.fn(reply));
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);
    await user.click(screen.getByLabelText("Custom decor"));

    await user.click(submit());
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(contact.failure.en);
    expect(screen.getByRole("link", { name: site.email }).getAttribute("href")).toBe(`mailto:${site.email}`);
    expect(screen.queryByRole("status")).toBeNull();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Maria Lopez");
    expect((screen.getByLabelText("Tell us about it") as HTMLTextAreaElement).value).toContain("Quinceañera");
    expect((screen.getByLabelText("Custom decor") as HTMLInputElement).checked).toBe(true);
  });

  it("shows success only after { ok: true }, sends the payload, then clears the form", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response('{"ok":true}', { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await fillRequired(user);
    await user.click(screen.getByLabelText("Custom gifts"));

    await user.click(submit());
    expect((await screen.findByRole("status")).textContent).toContain(contact.success.en);
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toMatchObject({ name: "Maria Lopez", email: "maria@example.com", services: ["gifts"], locale: "en", website: "" });
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Custom gifts") as HTMLInputElement).checked).toBe(false);
  });

  it("preselects the service named in ?service= on first load, then drops it from the URL", () => {
    window.history.replaceState(null, "", "/?service=apparel#contact");
    render(<ContactForm locale="en" />);
    expect((screen.getByLabelText("Custom apparel") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Event planning") as HTMLInputElement).checked).toBe(false);
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#contact");
  });
});

describe("service CTAs on the home page", () => {
  function renderHome() {
    render(
      <>
        <ServicesSection locale="en" />
        <ContactSection locale="en" />
      </>,
    );
  }

  it("check the service without a reload, keeping everything already typed", async () => {
    const user = userEvent.setup();
    renderHome();
    await fillRequired(user);
    await user.type(screen.getByLabelText(/Phone/), "281 555 0100");
    await user.click(screen.getByLabelText("Event planning"));

    const cta = screen.getByRole("link", { name: /Design your decor/ });
    expect(cta.getAttribute("href")).toBe("/?service=decor#contact");
    await user.click(cta);

    expect((screen.getByLabelText("Custom decor") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Event planning") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Maria Lopez");
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("maria@example.com");
    expect((screen.getByLabelText(/Phone/) as HTMLInputElement).value).toBe("281 555 0100");
    expect((screen.getByLabelText("Tell us about it") as HTMLTextAreaElement).value).toContain("Quinceañera");
    // Only the hash changed: no ?service= navigation, so no reload.
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#contact");
  });

  it("never unchecks a service that's already checked, and scrolls again when already at #contact", async () => {
    // jsdom has no scrollIntoView.
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole("link", { name: /Create a gift/ }));
    await user.click(screen.getByRole("link", { name: /Create a gift/ }));
    expect((screen.getByLabelText("Custom gifts") as HTMLInputElement).checked).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });
});

describe("season chip", () => {
  const christmas: Season = {
    id: "christmas-2026",
    start: "2026-11-27",
    end: "2026-12-24",
    name: { en: "Christmas & holidays" },
    headline: { en: "Give a gift they'll remember." },
    body: { en: "Custom holiday baskets." },
    occasions: [],
    photo: { kind: "none" },
    cta: { label: { en: "Order holiday gifts" }, service: "gifts" },
  };
  const seasons = [christmas];

  it("arrives from /season as ?season= (and ?service=): shows the chip, checks the service, drops both from the URL", () => {
    window.history.replaceState(null, "", "/?service=gifts&season=christmas-2026#contact");
    render(<ContactForm locale="en" seasons={seasons} />);
    expect(screen.getByText("Christmas & holidays").parentElement?.textContent).toBe("Asking about: Christmas & holidays");
    expect((screen.getByLabelText("Custom gifts") as HTMLInputElement).checked).toBe(true);
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#contact");
  });

  it("ignores a season that isn't in content (an old link)", () => {
    window.history.replaceState(null, "", "/?season=christmas-1999#contact");
    render(<ContactForm locale="en" seasons={seasons} />);
    expect(screen.queryByText(/Asking about/)).toBeNull();
    expect(window.location.search).toBe("");
  });

  it("sends the season id with the form, and not once the chip is removed", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response('{"ok":true}', { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState(null, "", "/?season=christmas-2026#contact");
    const user = userEvent.setup();
    const { unmount } = render(<ContactForm locale="en" seasons={seasons} />);
    await fillRequired(user);
    await user.click(submit());
    await screen.findByRole("status");
    const body = (call: number) => JSON.parse((fetchMock.mock.calls[call] as unknown as [string, RequestInit])[1].body as string);
    expect(body(0).season).toBe("christmas-2026");
    expect(screen.queryByText(/Asking about/)).toBeNull(); // cleared with the rest after a confirmed send
    unmount();

    window.history.replaceState(null, "", "/?season=christmas-2026#contact");
    render(<ContactForm locale="en" seasons={seasons} />);
    await user.click(screen.getByRole("button", { name: "Remove Christmas & holidays" }));
    expect(screen.queryByText(/Asking about/)).toBeNull();
    await fillRequired(user);
    await user.click(submit());
    await screen.findByRole("status");
    expect("season" in body(1)).toBe(false);
  });

  it("This Season's button on the home page names the season and checks its service without a reload", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-12-10T18:00:00Z"));
    const user = userEvent.setup();
    render(
      <>
        <SeasonFeature locale="en" layout="band" content={{ ...seasonal, seasons }} />
        <ContactForm locale="en" seasons={seasons} />
        <section id="contact" />
      </>,
    );
    await fillRequired(user);

    const cta = screen.getByRole("link", { name: "Order holiday gifts" });
    expect(cta.getAttribute("href")).toBe("/?service=gifts&season=christmas-2026#contact");
    await user.click(cta);

    expect(screen.getByText(/Asking about/).textContent).toBe("Asking about: Christmas & holidays");
    expect((screen.getByLabelText("Custom gifts") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Maria Lopez");
    expect(window.location.search).toBe("");
    vi.useRealTimers();
  });
});
