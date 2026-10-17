import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { newTabLinkProps } from "@/lib/links";

const root = join(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("new-tab links", () => {
  it("use rel=noopener noreferrer", () => {
    expect(newTabLinkProps).toEqual({ target: "_blank", rel: "noopener noreferrer" });
  });

  it('are never written by hand: "_blank" appears only in lib/links.ts', () => {
    const offenders = ["app", "components", "lib", "content"]
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .filter((file) => !file.endsWith(join("lib", "links.ts")))
      .filter((file) => readFileSync(file, "utf8").includes("_blank"))
      .map((file) => relative(root, file));

    expect(offenders).toEqual([]);
  });
});
