// Relative imports only: next.config.ts loads this file, and it doesn't resolve "@/".

type BuildMode = { dev: boolean; preview: boolean };

// Vercel's preview toolbar (comments, share) loads from these. Allowed on preview deployments only.
const vercelToolbar = {
  script: ["https://vercel.live"],
  connect: ["https://vercel.live", "wss://ws-us3.pusher.com"],
  img: ["https://vercel.live", "https://vercel.com"],
  frame: ["https://vercel.live"],
  style: ["https://vercel.live"],
  font: ["https://vercel.live", "https://assets.vercel.com"],
};

/**
 * Content-Security-Policy for a statically built Next.js site with no third-party scripts.
 * 'unsafe-inline' scripts: Next's inline hydration scripts on static pages (nonces would force
 * every page to render per request). 'unsafe-inline' styles: the theme variables set on <html>.
 * Everything else (JS, CSS, fonts, images, the /api/contact fetch) is same-origin.
 */
export function contentSecurityPolicy({ dev, preview }: BuildMode): string {
  const extra = (kind: keyof typeof vercelToolbar) => (preview ? vercelToolbar[kind] : []);

  const directives: [string, string[]][] = [
    ["default-src", ["'self'"]],
    ["script-src", ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : []), ...extra("script")]],
    ["style-src", ["'self'", "'unsafe-inline'", ...extra("style")]],
    ["img-src", ["'self'", "data:", "blob:", ...extra("img")]],
    ["font-src", ["'self'", ...extra("font")]],
    ["connect-src", ["'self'", ...(dev ? ["ws:"] : []), ...extra("connect")]],
    ["frame-src", preview ? extra("frame") : ["'none'"]],
    ["object-src", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    ["frame-ancestors", ["'none'"]],
  ];

  const policy = directives.map(([name, values]) => `${name} ${values.join(" ")}`);
  if (!dev) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

export function securityHeaders(mode: BuildMode): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(mode) },
    // Older browsers that ignore frame-ancestors.
    { key: "X-Frame-Options", value: "DENY" },
    // No includeSubDomains/preload: other subdomains (mail, DNS-managed services) aren't ours to force onto HTTPS.
    { key: "Strict-Transport-Security", value: "max-age=63072000" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ];
}
