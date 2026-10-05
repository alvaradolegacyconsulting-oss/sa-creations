import { describe, expect, it } from "vitest";
import { blend, contrastRatio } from "@/lib/contrast";
import { theme } from "@/theme/tokens";

const { color } = theme;

// Every text/background pair the site uses. Add a row when a component introduces a new one.
// Never used, because they fail: gold on any light background, copper on navy or ink.
const textPairs: [string, string, string][] = [
  ["ink on ivory", color.ink, color.ivory],
  ["ink on sand", color.ink, color.sand],
  ["ink on white", color.ink, color.white],
  ["navy on ivory", color.navy, color.ivory],
  ["navy on sand", color.navy, color.sand],
  ["navy on white", color.navy, color.white],
  ["copper on ivory", color.copper, color.ivory],
  ["copper on white", color.copper, color.white],
  ["ivory on navy", color.ivory, color.navy],
  ["white on navy", color.white, color.navy],
  ["gold on navy", color.gold, color.navy],
  ["ivory on ink", color.ivory, color.ink],
  ["gold on ink", color.gold, color.ink],
  ["alert on white", color.alert, color.white],
  ["alert on ivory", color.alert, color.ivory],
  // Translucent text (Tailwind's text-ink/80 etc.), blended over its background.
  ["ink/75 on sand", blend(color.ink, color.sand, 0.75), color.sand],
  ["ink/80 on ivory", blend(color.ink, color.ivory, 0.8), color.ivory],
  ["ink/80 on white", blend(color.ink, color.white, 0.8), color.white],
  ["ivory/85 on navy", blend(color.ivory, color.navy, 0.85), color.navy],
  ["ivory/80 on ink", blend(color.ivory, color.ink, 0.8), color.ink],
];

// Boundaries a user has to find (WCAG 1.4.11): input borders and checkboxes need 3:1.
const nonTextPairs: [string, string, string][] = [
  ["input border ink/55 on white", blend(color.ink, color.white, 0.55), color.white],
  ["outline button border navy on white", color.navy, color.white],
  ["focus ring copper on ivory", color.copper, color.ivory],
  ["focus ring gold on navy", color.gold, color.navy],
];

describe("theme contrast", () => {
  it("matches known WCAG values", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
    expect(blend("#000000", "#FFFFFF", 0.5)).toBe("#808080");
  });

  it.each(textPairs)("%s meets 4.5:1", (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(nonTextPairs)("%s meets 3:1", (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(3);
  });
});
