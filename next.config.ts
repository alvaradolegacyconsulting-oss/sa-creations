import type { NextConfig } from "next";
import { redirects } from "./content/redirects";
import { findRedirectProblems, toNextRedirects } from "./lib/redirects";
import { pagePaths } from "./lib/routes";

const nextConfig: NextConfig = {
  experimental: {
    // Two root layouts (app/(default), app/(alternate)/[alt]) leave no shared layout for a 404; see app/global-not-found.tsx.
    globalNotFound: true,
  },
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
