import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn(function Resend() {
    return { emails: { send } };
  }),
}));

vi.mock("@/content/seasonal", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/seasonal")>();
  return { seasonal: { ...actual.seasonal, seasons: [{ id: "christmas-2026", name: { en: "Christmas & holidays", es: "Navidad y fiestas" } }] } };
});

const { POST } = await import("@/app/api/contact/route");

const API_KEY = "re_test_secret_key_123";
const DETAILS = "Quinceañera in June, about 120 guests, gold and white.";

const valid = {
  name: "Maria Lopez",
  email: "maria@example.com",
  phone: "281-555-0123",
  date: "2027-06-12",
  services: ["events", "decor"],
  details: DETAILS,
  locale: "en",
  website: "",
};

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

let logs: string[];

beforeEach(() => {
  send.mockReset();
  vi.stubEnv("RESEND_API_KEY", API_KEY);
  vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "S&A Creations <inquiries@sacustomcreations.com>");
  logs = [];
  for (const level of ["info", "warn", "error", "log"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
  }
});

afterEach(() => {
  // Nothing logged may contain the API key or the message itself.
  for (const line of logs) {
    expect(line).not.toContain(API_KEY);
    expect(line).not.toContain(DETAILS);
  }
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("sends the email and replies ok only after Resend confirms", async () => {
    send.mockResolvedValue({ data: { id: "email_123" }, error: null });

    const response = await post(valid);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    const email = send.mock.calls[0][0];
    expect(email).toMatchObject({
      from: "S&A Creations <inquiries@sacustomcreations.com>",
      to: ["inbox@example.com"],
      replyTo: "maria@example.com",
      subject: "Website inquiry: Maria Lopez",
    });
    for (const text of ["Maria Lopez", "maria@example.com", "281-555-0123", "2027-06-12", "Event planning, Custom decor", "Language: English", DETAILS]) {
      expect(email.text).toContain(text);
    }
    expect(email.text).not.toContain("Season:");
    expect(logs.join("\n")).toContain("contact: sent, resend id email_123");
  });

  it("marks a Spanish inquiry in the subject and body, and passes the season along", async () => {
    send.mockResolvedValue({ data: { id: "email_es" }, error: null });

    await post({ ...valid, locale: "es", season: "christmas-2026" });

    const email = send.mock.calls[0][0];
    expect(email.subject).toBe("Website inquiry: Maria Lopez (Spanish, Christmas & holidays)");
    expect(email.text).toContain("Language: Spanish");
    expect(email.text).toContain("Season: Christmas & holidays (christmas-2026)");
  });

  it("drops a season that isn't in content (an old link) and sends anyway, logging it", async () => {
    send.mockResolvedValue({ data: { id: "email_old" }, error: null });

    const response = await post({ ...valid, season: "christmas-1999" });

    expect(await response.json()).toEqual({ ok: true });
    expect(send.mock.calls[0][0].text).not.toContain("Season:");
    expect(logs.join("\n")).toContain("season id dropped");
  });

  it.each([
    ["an unknown locale", { locale: "fr" }],
    ["a missing locale", { locale: undefined }],
    ["a malformed season", { season: "Christmas\r\nBcc: x@example.com" }],
    ["a season that isn't a string", { season: 42 }],
  ])("sends anyway on %s (not the visitor's to fix), in English with no season", async (_name, change) => {
    send.mockResolvedValue({ data: { id: "email_lenient" }, error: null });

    const response = await post({ ...valid, ...change });

    expect(await response.json()).toEqual({ ok: true });
    const email = send.mock.calls[0][0];
    expect(email.text).toContain("Language: English");
    expect(email.text).not.toContain("Season:");
  });

  it("returns ok:false when Resend reports an error", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "Invalid from", statusCode: 422 } });

    const response = await post(valid);

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, reason: "send-failed" });
    expect(logs.join("\n")).toContain("NOT sent, resend-error: validation_error (422)");
  });

  it("returns ok:false when the network call throws", async () => {
    send.mockRejectedValue(new TypeError("fetch failed"));

    const response = await post(valid);

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, reason: "send-failed" });
  });

  it.each(["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"])("returns ok:false without calling Resend when %s is missing", async (name) => {
    vi.stubEnv(name, "");

    const response = await post(valid);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, reason: "send-failed" });
    expect(send).not.toHaveBeenCalled();
    expect(logs.join("\n")).toContain(`missing-env: ${name}`);
  });

  it("drops a filled honeypot without sending", async () => {
    const response = await post({ ...valid, website: "http://spam.example" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
    expect(logs.join("\n")).toContain("honeypot filled (not sent)");
  });

  it.each([
    ["an address with no top-level domain", { ...valid, email: "maria@email" }, ["email"]],
    ["a bad email", { ...valid, email: "not-an-email" }, ["email"]],
    ["missing details", { ...valid, details: "   " }, ["details"]],
    ["a missing name", { ...valid, name: undefined }, ["name"]],
    ["an unknown service", { ...valid, services: ["events", "towing"] }, ["services"]],
    ["a date that isn't yyyy-mm-dd", { ...valid, date: "June 12" }, ["date"]],
    ["a line break in the name (subject injection)", { ...valid, name: "Maria\r\nBcc: x@example.com" }, ["name"]],
    ["several bad fields, in form order", { ...valid, details: "", email: "x", name: "" }, ["name", "email", "details"]],
  ])("rejects %s with 400, naming the fields and sending nothing", async (_name, body, fields) => {
    const response = await post(body);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, reason: "invalid", fields });
    expect(send).not.toHaveBeenCalled();
  });

  it("names fields without echoing what was typed", async () => {
    const response = await post({ ...valid, email: "maria@email" });
    const text = await response.text();

    expect(text).not.toContain("maria@email");
    expect(logs.join("\n")).not.toContain("maria@email");
  });

  it("treats a body that isn't JSON as a failure, not a field error", async () => {
    const response = await post("name=Maria");

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, reason: "send-failed" });
    expect(send).not.toHaveBeenCalled();
  });

  describe("field limits (name 80, email 254, phone 30, details 5000)", () => {
    const email = (length: number) => `${"a".repeat(length - "@example.com".length)}@example.com`;

    it.each([
      ["name", { name: "M".repeat(80) }, { name: "M".repeat(81) }],
      ["email", { email: email(254) }, { email: email(255) }],
      ["phone", { phone: "1".repeat(30) }, { phone: "1".repeat(31) }],
      ["details", { details: "x".repeat(5000) }, { details: "x".repeat(5001) }],
    ])("%s: accepts the limit, rejects one over", async (field, atLimit, overLimit) => {
      send.mockResolvedValue({ data: { id: "email_limit" }, error: null });

      expect((await post({ ...valid, ...atLimit })).status).toBe(200);

      const response = await post({ ...valid, ...overLimit });
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ ok: false, reason: "invalid", fields: [field] });
      expect(send).toHaveBeenCalledTimes(1);
    });
  });

  describe("oversized request bodies", () => {
    const big = JSON.stringify({ ...valid, details: "x".repeat(40 * 1024) });

    it("rejects a declared Content-Length over 32 KB with 413 before reading", async () => {
      const response = await POST(
        new Request("http://localhost/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Content-Length": String(big.length) },
          body: big,
        }),
      );

      expect(response.status).toBe(413);
      expect(await response.json()).toEqual({ ok: false, reason: "send-failed" });
      expect(send).not.toHaveBeenCalled();
    });

    it("rejects a streamed body with no Content-Length once it passes 32 KB", async () => {
      const bytes = new TextEncoder().encode(big);
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          for (let i = 0; i < bytes.length; i += 4096) controller.enqueue(bytes.slice(i, i + 4096));
          controller.close();
        },
      });
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stream,
        duplex: "half",
      } as RequestInit);
      expect(request.headers.get("content-length")).toBeNull();

      const response = await POST(request);

      expect(response.status).toBe(413);
      expect(send).not.toHaveBeenCalled();
      expect(logs.join("\n")).toContain("body over 32768 bytes");
    });
  });

  it("accepts a submission with no phone, date or services", async () => {
    send.mockResolvedValue({ data: { id: "email_456" }, error: null });

    const response = await post({ ...valid, phone: "", date: "", services: [] });

    expect(await response.json()).toEqual({ ok: true });
    expect(send.mock.calls[0][0].text).toContain("(none selected)");
  });
});
