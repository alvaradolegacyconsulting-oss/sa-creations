import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { theme, themeCssVariables } from "@/theme/tokens";

const root = new URL("../", import.meta.url);
const globalsCss = readFileSync(new URL("app/globals.css", root), "utf8");
const fontsTs = readFileSync(new URL("theme/fonts.ts", root), "utf8");

// The token values live in tokens.ts, but globals.css and fonts.ts must be kept in step by hand.
describe("theme tokens stay in sync", () => {
  it.each(Object.keys(themeCssVariables))("%s is mapped in app/globals.css", (variable) => {
    expect(globalsCss).toContain(`var(${variable})`);
  });

  it("globals.css maps no variable that tokens.ts doesn't define", () => {
    const used = [...globalsCss.matchAll(/var\((--theme-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(used.filter((variable) => !(variable in themeCssVariables))).toEqual([]);
  });

  it("no hex value appears in globals.css", () => {
    expect(globalsCss).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it.each([
    ["display", theme.font.display, "Cormorant_Garamond"],
    ["body", theme.font.body, "Jost"],
  ] as const)("%s font in fonts.ts matches tokens.ts", (_name, font, loader) => {
    const call = fontsTs.slice(fontsTs.indexOf(`= ${loader}({`));
    const options = call.slice(0, call.indexOf("})"));
    const weights = options.match(/weight: \[([^\]]*)\]/)?.[1].match(/\d+/g) ?? [];
    expect(weights).toEqual([...font.weights]);
    expect(options.includes('"italic"')).toBe("italicWeights" in font);
  });
});
