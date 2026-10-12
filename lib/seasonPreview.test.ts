import { afterEach, describe, expect, it, vi } from "vitest";
import type { Season } from "@/content/seasonal";
import { formatDateKey, previewSeasonParams, showSeasonPreviews } from "@/lib/seasonPreview";

const seasons = [{ id: "fall-2026" }, { id: "thanksgiving-2026" }] as Season[];

afterEach(() => {
  vi.unstubAllEnvs();
});

// SEASON_PREVIEWS
describe("season preview pages", () => {
  it("exist for every season on preview and local builds", () => {
    expect(previewSeasonParams("preview", seasons)).toEqual([{ id: "fall-2026" }, { id: "thanksgiving-2026" }]);
    expect(previewSeasonParams(undefined, seasons)).toHaveLength(2);
    expect(showSeasonPreviews("preview")).toBe(true);
  });

  it("don't exist in production: no params, so every /season/<id> is a 404, and no list on /season", () => {
    expect(previewSeasonParams("production", seasons)).toEqual([]);
    expect(showSeasonPreviews("production")).toBe(false);
  });

  it.each([
    ["/season/[id]", () => import("@/app/(default)/season/[id]/page")],
    ["/es/temporada/[id]", () => import("@/app/(alternate)/[alt]/temporada/[id]/page")],
  ])("a production build generates no %s pages and serves only generated ones", async (_route, load) => {
    vi.stubEnv("VERCEL_ENV", "production");
    const page = await load();
    expect(page.generateStaticParams()).toEqual([]);
    expect(page.dynamicParams).toBe(false);
  });

  it("formats a season's calendar dates without shifting them a day", () => {
    expect(formatDateKey("2026-11-27", "en")).toBe("Nov 27, 2026");
    expect(formatDateKey("2026-12-24", "es")).toMatch(/24 dic 2026/);
  });
});
