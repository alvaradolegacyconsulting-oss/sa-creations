import { describe, expect, it } from "vitest";
import { contact } from "@/content/contact";
import { headerNav } from "@/content/navigation";
import { services } from "@/content/services";

describe("content stays consistent", () => {
  it("offers every service, in order, as a contact form checkbox", () => {
    expect(contact.serviceOptions.map((option) => option.id)).toEqual(services.map((service) => service.id));
  });

  it("links the header to every service card", () => {
    const linked = headerNav.filter((link) => link.service).map((link) => link.service);
    expect(linked).toEqual(services.map((service) => service.id));
  });
});
