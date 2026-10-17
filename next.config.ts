import type { NextConfig } from "next";
import { redirects } from "./content/redirects";
import { findRedirectProblems, toNextRedirects } from "./lib/redirects";
import { pagePaths } from "./lib/routes";
import { securityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  // CSP and related headers on every response. See lib/security-headers.ts.
  async headers() {
    const mode = { dev: process.env.NODE_ENV === "development", preview: process.env.VERCEL_ENV === "preview" };
    return [{ source: "/(.*)", headers: securityHeaders(mode) }];
  },
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
