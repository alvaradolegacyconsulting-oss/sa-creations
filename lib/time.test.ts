import { describe, expect, it } from "vitest";
import { yearInCentral } from "@/lib/time";

describe("yearInCentral", () => {
  it("is still the old year at 00:30 UTC on Jan 1 (18:30 Dec 31 in Houston)", () => {
    expect(yearInCentral(new Date("2027-01-01T00:30:00Z"))).toBe(2026);
  });

  it("turns over at midnight Central", () => {
    expect(yearInCentral(new Date("2027-01-01T06:00:00Z"))).toBe(2027);
  });
});
