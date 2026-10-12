import { describe, expect, it, vi } from "vitest";

vi.mock("@/content/seasonal", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/seasonal")>();
  return { seasonal: { ...actual.seasonal, seasons: [{ id: "christmas-2026", name: { en: "Christmas & holidays", es: "Navidad y fiestas" } }] } };
});

const { contactSubject } = await import("@/lib/email");

describe("contactSubject", () => {
  it('is "Website inquiry: {name}", with the language when it isn\'t English', () => {
    expect(contactSubject({ name: "Maria Lopez", locale: "en" })).toBe("Website inquiry: Maria Lopez");
    expect(contactSubject({ name: "Maria Lopez", locale: "es" })).toBe("Website inquiry: Maria Lopez (Spanish)");
  });

  it("adds the season's English name", () => {
    expect(contactSubject({ name: "Maria Lopez", locale: "es", season: "christmas-2026" })).toBe("Website inquiry: Maria Lopez (Spanish, Christmas & holidays)");
  });

  it("strips CR/LF and other control characters, even if validation were bypassed", () => {
    const subject = contactSubject({ name: "Maria\r\nBcc: victim@example.com\t\u0000Lopez", locale: "en" });

    expect(subject).not.toMatch(/[\r\n\u0000-\u001f]/);
    expect(subject).toBe("Website inquiry: Maria Bcc: victim@example.com Lopez");
  });
});
