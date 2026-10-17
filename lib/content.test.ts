import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { contact } from "@/content/contact";
import { headerNav } from "@/content/navigation";
import { services } from "@/content/services";
import { site } from "@/content/site";

describe("content stays consistent", () => {
  it("offers every service, in order, as a contact form checkbox", () => {
    expect(contact.serviceOptions.map((option) => option.id)).toEqual(services.map((service) => service.id));
  });

  it("links the header to every service card", () => {
    const linked = headerNav.filter((link) => link.service).map((link) => link.service);
    expect(linked).toEqual(services.map((service) => service.id));
  });

  it("points site.logo at a file with the stated size", async () => {
    const meta = await sharp(join(__dirname, "..", "public", site.logo.src)).metadata();
    expect({ width: meta.width, height: meta.height }).toEqual({ width: site.logo.width, height: site.logo.height });
  });
});
