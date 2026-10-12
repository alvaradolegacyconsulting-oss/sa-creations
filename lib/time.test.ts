import { describe, expect, it } from "vitest";
import { centralDateKey, isDateKey, yearInCentral } from "@/lib/time";

describe("yearInCentral", () => {
  it("is still the old year at 00:30 UTC on Jan 1 (18:30 Dec 31 in Houston)", () => {
    expect(yearInCentral(new Date("2027-01-01T00:30:00Z"))).toBe(2026);
  });

  it("turns over at midnight Central", () => {
    expect(yearInCentral(new Date("2027-01-01T06:00:00Z"))).toBe(2027);
  });
});

describe("centralDateKey", () => {
  it("uses the Central date when UTC has already crossed midnight", () => {
    expect(centralDateKey(new Date("2026-12-25T03:00:00Z"))).toBe("2026-12-24");
  });

  it("turns over at midnight CST (06:00 UTC) in winter", () => {
    expect(centralDateKey(new Date("2027-02-15T05:59:59Z"))).toBe("2027-02-14");
    expect(centralDateKey(new Date("2027-02-15T06:00:00Z"))).toBe("2027-02-15");
  });

  it("turns over at midnight CDT (05:00 UTC) in summer", () => {
    expect(centralDateKey(new Date("2027-07-01T04:59:59Z"))).toBe("2027-06-30");
    expect(centralDateKey(new Date("2027-07-01T05:00:00Z"))).toBe("2027-07-01");
  });

  it("keeps the right date on the day clocks go forward (Mar 14, 2027) and back (Nov 1, 2026)", () => {
    expect(centralDateKey(new Date("2027-03-14T07:59:59Z"))).toBe("2027-03-14"); // 01:59:59 CST
    expect(centralDateKey(new Date("2027-03-14T08:00:00Z"))).toBe("2027-03-14"); // 03:00 CDT
    expect(centralDateKey(new Date("2027-03-15T04:59:59Z"))).toBe("2027-03-14");
    expect(centralDateKey(new Date("2027-03-15T05:00:00Z"))).toBe("2027-03-15");
    expect(centralDateKey(new Date("2026-11-01T06:59:59Z"))).toBe("2026-11-01"); // 01:59:59 CDT
    expect(centralDateKey(new Date("2026-11-01T07:00:00Z"))).toBe("2026-11-01"); // 01:00 CST
    expect(centralDateKey(new Date("2026-11-02T05:59:59Z"))).toBe("2026-11-01");
    expect(centralDateKey(new Date("2026-11-02T06:00:00Z"))).toBe("2026-11-02");
  });
});

describe("isDateKey", () => {
  it("accepts real dates and rejects impossible or badly written ones", () => {
    expect(isDateKey("2027-02-28")).toBe(true);
    expect(isDateKey("2028-02-29")).toBe(true);
    for (const bad of ["2027-02-29", "2027-02-30", "2027-13-01", "2027-2-3", "Feb 3", ""]) expect(isDateKey(bad)).toBe(false);
  });
});
