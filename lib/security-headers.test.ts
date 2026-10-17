import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, securityHeaders } from "@/lib/security-headers";

const production = { dev: false, preview: false };

const directive = (csp: string, name: string) => csp.split("; ").find((part) => part.startsWith(`${name} `));

describe("Content-Security-Policy", () => {
  it("keeps production to the site's own origin", () => {
    const csp = contentSecurityPolicy(production);

    expect(directive(csp, "default-src")).toBe("default-src 'self'");
    expect(directive(csp, "script-src")).toBe("script-src 'self' 'unsafe-inline'");
    expect(directive(csp, "connect-src")).toBe("connect-src 'self'");
    expect(directive(csp, "frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive(csp, "object-src")).toBe("object-src 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("vercel");
  });

  it("allows Vercel's toolbar on previews only", () => {
    const csp = contentSecurityPolicy({ dev: false, preview: true });

    expect(directive(csp, "script-src")).toContain("https://vercel.live");
    expect(directive(csp, "frame-src")).toBe("frame-src https://vercel.live");
    expect(directive(csp, "frame-ancestors")).toBe("frame-ancestors 'none'");
  });

  it("allows eval and the dev websocket only in development", () => {
    const csp = contentSecurityPolicy({ dev: true, preview: false });

    expect(directive(csp, "script-src")).toContain("'unsafe-eval'");
    expect(directive(csp, "connect-src")).toBe("connect-src 'self' ws:");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });
});

describe("security headers", () => {
  it("sets every header the hardening pass requires", () => {
    const headers = Object.fromEntries(securityHeaders(production).map(({ key, value }) => [key, value]));

    expect(headers["Strict-Transport-Security"]).toBe("max-age=63072000");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=()");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Content-Security-Policy"]).toBe(contentSecurityPolicy(production));
  });
});
