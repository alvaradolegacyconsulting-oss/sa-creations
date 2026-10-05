import type { NextConfig } from "next";
import { redirects } from "./content/redirects";
import { findRedirectProblems, toNextRedirects } from "./lib/redirects";
import { pagePaths } from "./lib/routes";

const nextConfig: NextConfig = {
  // Old URLs → new pages, all 301. Edit content/redirects.ts, not this file.
  async redirects() {
    const problems = findRedirectProblems(redirects, pagePaths);
    if (problems.length > 0) {
      throw new Error(`REDIRECTS invalid. Fix content/redirects.ts:\n- ${problems.join("\n- ")}`);
    }
    return toNextRedirects(redirects);
  },
};

export default nextConfig;
