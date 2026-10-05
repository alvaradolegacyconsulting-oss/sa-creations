/**
 * True only for the production deployment. Vercel sets VERCEL_ENV to "production", "preview"
 * or "development" at build time; local builds leave it unset and behave like previews.
 */
export function isProductionBuild(vercelEnv: string | undefined = process.env.VERCEL_ENV): boolean {
  return vercelEnv === "production";
}
