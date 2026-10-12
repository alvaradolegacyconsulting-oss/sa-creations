import { describe, expect, it } from "vitest";
import { contactHrefForService, interpretReply, serviceFromParam } from "@/lib/contact";

describe("service preselect", () => {
  it("links a service card to the form with that service", () => {
    expect(contactHrefForService("decor", "en")).toBe("/?service=decor#contact");
    expect(contactHrefForService("decor", "es")).toBe("/es?service=decor#contact");
  });

  it("accepts only known service ids", () => {
    expect(serviceFromParam("gifts")).toBe("gifts");
    expect(serviceFromParam("towing")).toBeNull();
    expect(serviceFromParam(null)).toBeNull();
  });
});

describe("interpretReply", () => {
  const reply = (status: number, body: string) => new Response(body, { status, headers: { "Content-Type": "application/json" } });

  it("is sent only for a 2xx with { ok: true }", async () => {
    expect(await interpretReply(reply(200, '{"ok":true}'))).toEqual({ kind: "sent" });
  });

  it("is invalid for a 400 naming known fields, keeping only those", async () => {
    expect(await interpretReply(reply(400, '{"ok":false,"reason":"invalid","fields":["email","hacked"]}'))).toEqual({
      kind: "invalid",
      fields: ["email"],
    });
  });

  it.each([
    ["a 404 (no route)", reply(404, "Not found")],
    ["a 500", reply(500, '{"ok":true}')],
    ["send-failed", reply(502, '{"ok":false,"reason":"send-failed"}')],
    ["ok: false with no reason", reply(200, '{"ok":false,"error":"send failed"}')],
    ["invalid with no known field", reply(400, '{"ok":false,"reason":"invalid","fields":["hacked"]}')],
    ["invalid on a status other than 400", reply(413, '{"ok":false,"reason":"invalid","fields":["email"]}')],
    ["an empty 200", reply(200, "")],
    ["a truthy but not true ok", reply(200, '{"ok":"yes"}')],
  ])("is failed for %s", async (_name, response) => {
    expect(await interpretReply(response)).toEqual({ kind: "failed" });
  });
});
