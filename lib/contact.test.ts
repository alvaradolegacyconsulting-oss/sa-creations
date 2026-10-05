import { describe, expect, it } from "vitest";
import { contactHrefForService, serviceFromParam } from "@/lib/contact";

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
