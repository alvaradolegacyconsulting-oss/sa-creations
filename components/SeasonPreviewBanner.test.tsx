// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SeasonPreviewBanner } from "@/components/SeasonPreviewBanner";
import { seasonal, type Season } from "@/content/seasonal";

const christmas = { id: "christmas-2026", start: "2026-11-27", end: "2026-12-24" } as Season;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SeasonPreviewBanner", () => {
  it("says a season isn't active today, with its dates", () => {
    vi.setSystemTime(new Date("2027-07-04T18:00:00Z"));
    render(<SeasonPreviewBanner season={christmas} locale="en" seasons={[christmas]} />);
    expect(screen.getByText(/Season preview/).parentElement?.textContent).toBe(
      `Season preview: ${seasonal.preview.notActive.en} Runs Nov 27, 2026 to Dec 24, 2026.`,
    );
  });

  it("says so when the previewed season is the one showing today (Central)", () => {
    vi.setSystemTime(new Date("2026-12-25T05:30:00Z")); // Dec 24, 23:30 CST
    render(<SeasonPreviewBanner season={christmas} locale="en" seasons={[christmas]} />);
    expect(screen.getByText(/Season preview/).parentElement?.textContent).toContain(seasonal.preview.active.en);
  });
});
