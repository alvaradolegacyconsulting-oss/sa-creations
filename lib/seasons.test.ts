import { describe, expect, it } from "vitest";
import type { Season, SeasonalContent } from "@/content/seasonal";
import { seasonal } from "@/content/seasonal";
import { currentSeason, findSeasonProblems, seasonToShow } from "@/lib/seasons";
import { centralDateKey } from "@/lib/time";

const season = (id: string, start: string, end: string): Season => ({
  id,
  start,
  end,
  name: { en: id },
  headline: { en: `${id} headline` },
  body: { en: "body" },
  occasions: [],
  photo: { kind: "none" },
  cta: { label: { en: "Go" } },
});

// Back to back, as in the approved calendar: one in winter (CST, UTC-6), one into summer (CDT, UTC-5).
const valentines = season("new-year-valentines-2027", "2026-12-26", "2027-02-14");
const spring = season("spring-mothers-day-2027", "2027-02-15", "2027-05-09");
const graduation = season("graduation-2027", "2027-05-10", "2027-06-30");
const summer = season("summer-2027", "2027-07-01", "2027-09-14");
const seasons = [valentines, spring, graduation, summer];

/** The season showing at a real instant: the same path the browser takes (Central date, then pick). */
const showingAt = (iso: string) => currentSeason(seasons, centralDateKey(new Date(iso)))?.id ?? "evergreen";

// SEASON_BOUNDARIES
describe("season boundaries at midnight Central", () => {
  it("starts at midnight CST on its first day (06:00 UTC), not at midnight UTC", () => {
    expect(showingAt("2026-12-26T00:00:00Z")).toBe("evergreen"); // Dec 25, 18:00 CST
    expect(showingAt("2026-12-26T05:59:59Z")).toBe("evergreen"); // Dec 25, 23:59:59 CST
    expect(showingAt("2026-12-26T06:00:00Z")).toBe("new-year-valentines-2027"); // Dec 26, 00:00 CST
  });

  it("runs through the whole of its last day, then hands over to the next season at midnight CST", () => {
    expect(showingAt("2027-02-15T05:59:59Z")).toBe("new-year-valentines-2027"); // Feb 14, 23:59:59 CST
    expect(showingAt("2027-02-15T06:00:00Z")).toBe("spring-mothers-day-2027"); // Feb 15, 00:00 CST
  });

  it("hands over at midnight CDT (05:00 UTC) in summer", () => {
    expect(showingAt("2027-07-01T04:59:59Z")).toBe("graduation-2027"); // Jun 30, 23:59:59 CDT
    expect(showingAt("2027-07-01T05:00:00Z")).toBe("summer-2027"); // Jul 1, 00:00 CDT
  });

  it("falls back to evergreen at midnight CDT after the last day", () => {
    expect(showingAt("2027-09-15T04:59:59Z")).toBe("summer-2027");
    expect(showingAt("2027-09-15T05:00:00Z")).toBe("evergreen");
  });

  it("stays on the right season through both DST changes", () => {
    expect(showingAt("2027-03-14T07:59:59Z")).toBe("spring-mothers-day-2027"); // just before clocks go forward
    expect(showingAt("2027-03-14T08:00:00Z")).toBe("spring-mothers-day-2027"); // just after
    const fall = [season("fall-2026", "2026-09-15", "2026-10-31"), season("thanksgiving-2026", "2026-11-01", "2026-11-26")];
    const at = (iso: string) => currentSeason(fall, centralDateKey(new Date(iso)))?.id;
    expect(at("2026-11-01T04:59:59Z")).toBe("fall-2026"); // Oct 31, 23:59:59 CDT
    expect(at("2026-11-01T05:00:00Z")).toBe("thanksgiving-2026"); // Nov 1, 00:00 CDT
    expect(at("2026-11-01T07:30:00Z")).toBe("thanksgiving-2026"); // 01:30 CST, after clocks go back
  });

  it("shows exactly one season, or evergreen, at every hour of a year of back-to-back seasons", () => {
    for (let time = Date.parse("2026-12-20T00:00:00Z"); time < Date.parse("2027-09-20T00:00:00Z"); time += 3_600_000) {
      const today = centralDateKey(new Date(time));
      const running = seasons.filter((s) => s.start <= today && today <= s.end);
      expect(running.length).toBeLessThanOrEqual(1);
    }
  });

  it("runs a one-day season for exactly that Central day", () => {
    const oneDay = [season("mothers-day-2027", "2027-05-09", "2027-05-09")];
    expect(currentSeason(oneDay, "2027-05-08")).toBeNull();
    expect(currentSeason(oneDay, "2027-05-09")?.id).toBe("mothers-day-2027");
    expect(currentSeason(oneDay, "2027-05-10")).toBeNull();
  });
});

describe("seasonToShow", () => {
  const content: Pick<SeasonalContent, "evergreen" | "seasons"> = { evergreen: seasonal.evergreen, seasons };

  it("shows the evergreen copy before the browser knows today's date (server render, hydration)", () => {
    expect(seasonToShow(content, null)).toEqual({ season: null, copy: seasonal.evergreen });
  });

  it("shows evergreen on a day with no season (Dec 25), and when there are no seasons at all", () => {
    expect(seasonToShow(content, "2026-12-25").copy).toBe(seasonal.evergreen);
    expect(seasonToShow({ ...content, seasons: [] }, "2027-01-10").copy).toBe(seasonal.evergreen);
  });

  it("shows the running season's copy", () => {
    expect(seasonToShow(content, "2027-01-10").season?.id).toBe("new-year-valentines-2027");
  });
});

describe("SEASONS_VALID (fails every build)", () => {
  it("accepts the back-to-back calendar", () => {
    expect(findSeasonProblems(seasons)).toEqual([]);
  });

  it("explains each problem in plain English", () => {
    expect(
      findSeasonProblems([
        season("Christmas 2026", "2026-11-27", "2026-12-24"),
        season("a", "2027-02-30", "2027-03-01"),
        season("b", "2027-04-10", "2027-04-01"),
        season("c", "2027-05-01", "2027-05-20"),
        season("c", "2027-05-15", "2027-05-31"),
      ]),
    ).toEqual([
      'seasons[0] (Christmas 2026): id must be lowercase letters, numbers and hyphens, e.g. "christmas-2026"',
      'seasons[1] (a): start "2027-02-30" must be a real date written YYYY-MM-DD',
      "seasons[2] (b): ends (2027-04-01) before it starts (2027-04-10)",
      'seasons[4] (c): id "c" is used twice',
      "c (to 2027-05-20) overlaps c (from 2027-05-15)",
    ]);
  });

  it("treats seasons sharing a day as overlapping", () => {
    expect(findSeasonProblems([season("a", "2027-01-01", "2027-01-31"), season("b", "2027-01-31", "2027-02-28")])).toEqual([
      "a (to 2027-01-31) overlaps b (from 2027-01-31)",
    ]);
  });

  it("passes the real content", () => {
    expect(findSeasonProblems(seasonal.seasons)).toEqual([]);
  });
});
