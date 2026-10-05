import { describe, expect, it } from "vitest";
import { redirects } from "@/content/redirects";
import { findRedirectProblems, toNextRedirects } from "@/lib/redirects";
import { pagePaths } from "@/lib/routes";

describe("content/redirects.ts", () => {
  it("is valid: unique paths, real targets, no chains", () => {
    expect(findRedirectProblems(redirects, pagePaths)).toEqual([]);
  });

  it("becomes 301 redirects in next.config", () => {
    expect(toNextRedirects([{ from: "/old", to: "/" }])).toEqual([{ source: "/old", destination: "/", statusCode: 301 }]);
  });
});

describe("findRedirectProblems", () => {
  const pages = ["/", "/about"];

  it.each([
    ["a target that isn't a page", [{ from: "/old", to: "/nope" }], "is not a page"],
    ["a duplicate source", [{ from: "/old", to: "/" }, { from: "/old", to: "/" }], "more than once"],
    ["a source that is a live page", [{ from: "/about", to: "/" }], "would be hidden"],
    ["a chain", [{ from: "/a", to: "/b" }, { from: "/b", to: "/" }], "chains"],
    ["a relative source", [{ from: "old", to: "/" }], "must be a path"],
    ["a trailing slash", [{ from: "/old/", to: "/" }], "must not end"],
  ])("rejects %s", (_name, list, message) => {
    expect(findRedirectProblems(list, pages).join("\n")).toContain(message);
  });

  it("allows an anchor on a real page", () => {
    expect(findRedirectProblems([{ from: "/services", to: "/#services" }], pages)).toEqual([]);
  });
});
