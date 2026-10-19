# GREENLIGHT — Next.js security upgrade (all live sites)

**Written:** October 19, 2026 · **Architect:** Claude (chat) · **Builder:** Mateo (Claude Code)
**Place in each repo:** `docs/preflight/next-upgrade-2026-10.md`. Branch: `build/v1`.
**Order:** alc-site first (pilot). Then sa-creations, a1wrecker, sampayo, casa-del-cordero in
parallel, each in its own window, after the pilot is merged.

## Why

`npm audit` on alc-site (Oct 16) listed 6 high-severity advisories in `next` 16.3.6, including
SSRF in Image Optimization (GHSA-cjq9-62q9-8jv4), which every site uses. The suggested fix is a
newer 16.x release (16.4.2 at the time). All live sites are live and in production, so this is a
security patch: small, verified, no feature changes.

## Step 0 — report before changing anything

1. Current `next`, `eslint-config-next`, `react`, `react-dom` versions (package.json + lockfile).
2. `npm audit` summary (counts by severity; list the `next` advisories by GHSA id).
3. The **lowest 16.x version that fixes all the `next` advisories** (`npm view next versions`,
   advisory "patched versions"). Target that or the latest 16.x patch, **never a new major**.
4. Release notes between current and target: anything touching features this repo uses
   (image optimization, redirects, headers/CSP, `experimental.globalNotFound`, route groups,
   metadata/OG image routes, static params). Say "nothing relevant" if so.

Proceed unless the notes show a breaking change; then stop and report.

## Change (one commit: `chore: upgrade Next.js to <version> (security)`)

- Pin `next` and `eslint-config-next` to the same exact version; update the lockfile with
  `npm install`. Don't touch React or other packages unless Next requires it (then say why).
- No code changes unless the build requires them; if it does, make them in a separate `fix:`
  commit with an explanation.

## Gates (report PASS/FAIL)

- `AUDIT_AFTER` — `npm audit`: no remaining `next` advisories. List anything left (e.g. dev-only
  `braces` via eslint tooling) and whether it ships to the site.
- `BUILD_CLEAN` — build, lint, all tests.
- `PRODUCTION_GATES` — `VERCEL_ENV=production`, same result as before the upgrade.
- `SMOKE` — local production build: home and every page in both languages return 200; images
  render through `/_next/image`; every redirect still returns its code (paste `curl -sI` lines);
  security headers present; 404 page works.
- Contact form sites only (alc-site, sa-creations): `/api/contact` still validates (400 on bad
  input) locally; Jose sends one real test from the preview.
- `PHONE_PASS` — Jose, on the preview.

Push `build/v1`. **Do not merge to `main` until Jose says go.**
