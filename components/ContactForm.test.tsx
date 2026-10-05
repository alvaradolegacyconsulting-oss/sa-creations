// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/ContactForm";
import { contact } from "@/content/contact";
import { site } from "@/content/site";

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

describe("ContactForm (FORM_UI)", () => {
  it("blocks an empty submit with an inline message and sends nothing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(submit());
    expect(screen.getByRole("alert").textContent).toContain(contact.invalid.en);
    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillRequired(user);
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "maria-at-example");

    await user.click(submit());
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");
  });

  it("shows a pending state while sending", async () => {
    let finish: (response: Response) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((resolve) => (finish = resolve))));
    const user = userEvent.setup();
    render(<ContactForm />);
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
  ])("on %s shows the email address and keeps every field filled", async (_name, reply) => {
    vi.stubGlobal("fetch", vi.fn(reply));
    const user = userEvent.setup();
    render(<ContactForm />);
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
    render(<ContactForm />);
    await fillRequired(user);
    await user.click(screen.getByLabelText("Custom gifts"));

    await user.click(submit());
    expect((await screen.findByRole("status")).textContent).toContain(contact.success.en);
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toMatchObject({ name: "Maria Lopez", email: "maria@example.com", services: ["gifts"], website: "" });
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Custom gifts") as HTMLInputElement).checked).toBe(false);
  });

  it("preselects the service named in ?service=", () => {
    window.history.replaceState(null, "", "/?service=apparel#contact");
    render(<ContactForm />);
    expect((screen.getByLabelText("Custom apparel") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Event planning") as HTMLInputElement).checked).toBe(false);
  });
});
