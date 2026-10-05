import { describe, expect, it } from "vitest";
import { contactHrefForService, isConfirmedSent, serviceFromParam } from "@/lib/contact";

describe("service preselect", () => {
  it("links a service card to the form with that service", () => {
    expect(contactHrefForService("decor")).toBe("/?service=decor#contact");
  });

  it("accepts only known service ids", () => {
    expect(serviceFromParam("gifts")).toBe("gifts");
    expect(serviceFromParam("towing")).toBeNull();
    expect(serviceFromParam(null)).toBeNull();
  });
});

describe("isConfirmedSent", () => {
  const reply = (status: number, body: string) => new Response(body, { status, headers: { "Content-Type": "application/json" } });

  it("is true only for a 2xx with { ok: true }", async () => {
    expect(await isConfirmedSent(reply(200, '{"ok":true}'))).toBe(true);
  });

  it.each([
    ["a 404 (no route yet)", reply(404, "Not found")],
    ["a 500", reply(500, '{"ok":true}')],
    ["ok: false", reply(200, '{"ok":false,"error":"send failed"}')],
    ["an empty 200", reply(200, "")],
    ["a truthy but not true ok", reply(200, '{"ok":"yes"}')],
  ])("is false for %s", async (_name, response) => {
    expect(await isConfirmedSent(response)).toBe(false);
  });
});
