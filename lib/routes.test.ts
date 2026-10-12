import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { defaultLocale } from "@/content/types";
import { alternateLocale, hasAlternate, otherLocale, pagePathsFor, routeKeys, routes } from "@/lib/routes";

const appDir = new URL("../app/", import.meta.url).pathname;

function pageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? pageFiles(join(dir, entry.name)) : entry.name === "page.tsx" ? [relative(appDir, join(dir, entry.name))] : [],
  );
}

describe("route table", () => {
  it("serves English at / and Spanish at /es", () => {
    expect(defaultLocale).toBe("en");
    expect(alternateLocale).toBe("es");
    expect(routes.home).toEqual({ en: "/", es: "/es" });
    expect(otherLocale("en")).toBe("es");
    expect(otherLocale("es")).toBe("en");
  });

  it("has a page file in each language's route group for every route", () => {
    const files = pageFiles(appDir);
    for (const key of routeKeys) {
      const en = routes[key].en === "/" ? "(default)/page.tsx" : `(default)${routes[key].en}/page.tsx`;
      const es = `(alternate)/[alt]${routes[key].es.replace(/^\/es/, "")}/page.tsx`.replace("//", "/");
      expect(files).toContain(en);
      expect(files).toContain(es);
    }
  });

  it("builds Spanish only when content/site.ts languages lists it", () => {
    expect(hasAlternate(["en"])).toBe(false);
    expect(hasAlternate(["en", "es"])).toBe(true);
    expect(pagePathsFor(["en"])).toEqual(["/"]);
    expect(pagePathsFor(["en", "es"])).toEqual(["/", "/es"]);
  });
});
