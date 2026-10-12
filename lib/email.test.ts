import { describe, expect, it } from "vitest";
import { contactSubject } from "@/lib/email";

describe("contactSubject", () => {
  it('is "Website inquiry: {name}", with the language when it isn\'t English', () => {
    expect(contactSubject({ name: "Maria Lopez", locale: "en" })).toBe("Website inquiry: Maria Lopez");
    expect(contactSubject({ name: "Maria Lopez", locale: "es" })).toBe("Website inquiry: Maria Lopez (Spanish)");
  });

  it("strips CR/LF and other control characters, even if validation were bypassed", () => {
    const subject = contactSubject({ name: "Maria\r\nBcc: victim@example.com\t\u0000Lopez", locale: "en" });

    expect(subject).not.toMatch(/[\r\n\u0000-\u001f]/);
    expect(subject).toBe("Website inquiry: Maria Bcc: victim@example.com Lopez");
  });
});
