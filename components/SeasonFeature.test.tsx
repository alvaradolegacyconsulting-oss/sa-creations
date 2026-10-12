// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SeasonFeature } from "@/components/SeasonFeature";
import { seasonal, type Season, type SeasonalContent } from "@/content/seasonal";

const season = (id: string, start: string, end: string, headline: string): Season => ({
  id,
  start,
  end,
  name: { en: `${id} name` },
  headline: { en: headline },
  body: { en: `${id} body` },
  occasions: [{ en: `${id} occasion` }],
  photo: { kind: "none" },
  cta: { label: { en: `${id} cta` }, service: "gifts" },
});

const content: SeasonalContent = {
  evergreenEyebrow: { en: "For every occasion" },
  page: { title: { en: "This season" }, description: { en: "d" } },
  seeMore: { en: "See this season" },
  preview: seasonal.preview,
  evergreen: { headline: { en: "Evergreen headline" }, body: { en: "Evergreen body" }, occasions: [], photo: { kind: "none" }, cta: { label: { en: "Contact us" } } },
  seasons: [season("christmas-2026", "2026-11-27", "2026-12-24", "Give a gift they'll remember.")],
};

const heading = () => screen.getByRole("heading", { level: 2 });

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SeasonFeature", () => {
  it("renders the evergreen copy on the server, whatever the date (never the build machine's season)", () => {
    vi.setSystemTime(new Date("2026-12-10T18:00:00Z")); // mid-season
    const html = renderToString(<SeasonFeature locale="en" layout="band" content={content} />);
    expect(html).toContain("Evergreen headline");
    expect(html).not.toContain("Give a gift");
  });

  it("shows the season running today in Central time once in the browser", () => {
    vi.setSystemTime(new Date("2026-12-10T18:00:00Z"));
    render(<SeasonFeature locale="en" layout="band" content={content} />);
    expect(heading().textContent).toBe("Give a gift they'll remember.");
    expect(screen.getByText("christmas-2026 name")).toBeTruthy();
    expect(screen.getByText("christmas-2026 occasion")).toBeTruthy();
  });

  it("is never empty: on a day with no season (Dec 25) it shows the evergreen copy and call to action", () => {
    vi.setSystemTime(new Date("2026-12-25T18:00:00Z"));
    render(<SeasonFeature locale="en" layout="band" content={content} />);
    expect(heading().textContent).toBe("Evergreen headline");
    expect(screen.getByText("For every occasion")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Contact us" }).getAttribute("href")).toBe("/#contact");
  });

  it("rolls over at midnight Central on a page left open", () => {
    vi.setSystemTime(new Date("2026-12-25T05:59:30Z")); // Dec 24, 23:59:30 CST
    render(<SeasonFeature locale="en" layout="band" content={content} />);
    expect(heading().textContent).toBe("Give a gift they'll remember.");

    act(() => {
      vi.advanceTimersByTime(60_000); // 00:00:30 CST, Dec 25
    });
    expect(heading().textContent).toBe("Evergreen headline");
  });

  it("links the band to /season, in the page's language", () => {
    vi.setSystemTime(new Date("2026-12-10T18:00:00Z"));
    render(<SeasonFeature locale="es" layout="band" content={content} />);
    expect(screen.getByRole("link", { name: /See this season/ }).getAttribute("href")).toBe("/es/temporada");
  });

  it("on the /season page, uses an h1 and no link to itself", () => {
    vi.setSystemTime(new Date("2026-12-10T18:00:00Z"));
    render(<SeasonFeature locale="en" layout="page" content={content} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Give a gift they'll remember.");
    expect(screen.queryByRole("link", { name: /See this season/ })).toBeNull();
  });

  it("shows a pinned season whatever the date (preview pages)", () => {
    vi.setSystemTime(new Date("2027-07-04T18:00:00Z"));
    render(<SeasonFeature locale="en" layout="page" content={content} season={content.seasons[0]} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Give a gift they'll remember.");
  });
});
