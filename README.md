# S&A Creations — website

Marketing site for S&A Creations (a DBA of Alvarado Legacy Consulting, LLC): event planning, custom
decor, custom apparel and custom gifts. One page: hero, values, the four services, a photo gallery,
our story and an inquiry form for a free consultation. Next.js (App Router), TypeScript, Tailwind CSS.
No database, no CMS, no logins, no store.

> **Status (build/v1):** every section is built. The inquiry form's email route (`/api/contact`) is
> not built yet, so every submit currently shows the "We couldn't send your request" error (with the
> inquiry email). There is no domain yet: the site lives on Vercel preview URLs, and production is
> blocked on purpose until the open questions are answered (see [Build-time gates](#build-time-gates-prebuild)).

- **Production:** `main` branch → Vercel production (once a domain is chosen).
- **Staging:** every other branch gets a Vercel preview URL (Vercel may ask you to log in to the
  Alvarado Legacy Consulting team to view previews).

Plain-English steps for routine edits (photos, contact details, text) are in
[docs/UPDATING.md](docs/UPDATING.md).

## Prerequisites

- **Node.js 22 or newer** (pinned in `package.json` `engines`; developed on Node 24). Check with `node -v`.
- **npm** (comes with Node).
- **git**, and access to `github.com/alvaradolegacyconsulting-oss/sa-creations`.
- To deploy: membership in the Alvarado Legacy Consulting team on Vercel (Pro plan; this is paid,
  commercial work, so not Hobby).

## Run it locally

One command per line (works in macOS `zsh`):

```bash
git clone https://github.com/alvaradolegacyconsulting-oss/sa-creations.git
cd sa-creations
npm install
npm run dev
```

Open http://localhost:3000. The whole site works without environment variables; only the inquiry
form's email sending will need them (below).

> `npm run dev` may add a Next.js notes block to `AGENTS.md`. That file is meant for it; commit the
> change if it appears.

## Environment variables

```bash
cp .env.example .env.local
```

| Variable | What it is |
|---|---|
| `RESEND_API_KEY` | API key from resend.com. Server-only. |
| `CONTACT_TO_EMAIL` | Inbox that receives inquiries. |
| `CONTACT_FROM_EMAIL` | Sender. On previews, Resend's test sender `onboarding@resend.dev` (delivers only to the Resend account owner). In production, an address on the site's domain, verified in Resend. |

None are read yet: they're for `/api/contact`, the next piece of work. `.env.local` is git-ignored;
never commit real values. On Vercel, set all three under **Project Settings → Environment Variables**
for **Preview** and **Production**, then redeploy.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server on http://localhost:3000 |
| `npm test` | Unit and component tests (Vitest): form states, phone menu, gallery empty state, gates, SEO, redirects, color contrast, token drift |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run build` | Production build. Runs the production gates first (below). |
| `npm run gates` | Prints each gate as PASS/FAIL with everything still open, on any machine |
| `npm start` | Serve the output of `npm run build` locally |

Before every push, `npm run lint`, `npm test` and `npm run build` should all pass (`BUILD_CLEAN`).

### Build-time gates (`prebuild`)

`scripts/check-production-gates.ts` runs before every build but only blocks **production**
(`VERCEL_ENV=production`). Preview and local builds pass with placeholders so work can continue.

- **PLACEHOLDERS_RESOLVED:** fails while any text in `content/` contains `[PLACEHOLDER` (including
  the open questions in `content/pending.ts`) or any photo's `src` is still `null`.
- An **empty gallery is not a failure**: the gallery section, its menu link and the hero's
  "See our work" button simply don't appear until there's at least one photo.

`npm run gates` lists every item to fix. To try the real production check locally:

```bash
VERCEL_ENV=production npm run build
```

Redirects are also checked on every build: an invalid `content/redirects.ts` (duplicate, target page
that doesn't exist, a chain) fails the build with a message.

### No client facts outside `content/` and `theme/` (`CONTENT_ONLY`)

These should print nothing:

```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b' app components
grep -rniE 'alvarado|S&A|quincea|wedding|colossians|instagram\.com|facebook\.com|@[a-z]+\.(com|net)|\$[0-9]|tel:\+' app components --include='*.ts' --include='*.tsx' --exclude='*.test.tsx'
```

## Deploy

Vercel is connected to the GitHub repo; there is no deploy command.

1. **Preview:** push any branch. Vercel builds it and posts a preview URL (Vercel dashboard →
   Deployments, or on the GitHub commit). Check it **on a phone**.
2. **Production:** merge into `main` through a pull request. Vercel builds `main` as production.
   The build fails on purpose while the gates above fail.
3. **Roll back:** Vercel → Deployments → last good production deployment → **Promote to Production**.
   Then `git revert` the bad commit on `main`.

`url` in `content/site.ts` is the production domain. It drives canonical links, the share image,
`sitemap.xml`, `robots.txt` and the JSON-LD in production. Previews use their own Vercel URL
automatically (`lib/seo.ts`), and their `robots.txt` says `Disallow: /`.

**When the domain is chosen:** set `url` in `content/site.ts`, add the domain in Vercel (Project →
Settings → Domains) and follow its DNS instructions, then in the **alc-site** repo redirect the old
holding page `/s-and-a-creations` to the new domain.

## Project layout

```
content/        All client facts and copy (typed). The only files that change for routine updates.
theme/          tokens.ts (colors, fonts, radii: the only place hex values live), fonts.ts (next/font)
components/     Generic UI that reads from content/
app/            The home page, plus sitemap.ts, robots.ts, opengraph-image.tsx
lib/            Helpers: gates, SEO, contact form, gallery, redirects, routes, time zone, contrast
scripts/        Build-time production gates
public/images/  Photos (and the logo once it arrives)
docs/preflight/ Specs and approvals from the architect (latest is the source of truth)
docs/concept/   The approved design concept (PDF)
docs/UPDATING.md  Plain-English update steps
```

Visible text in `content/` is shaped `{ en: "..." }` so Spanish can be added later as `es: "..."`.
Anything unconfirmed reads `[PLACEHOLDER: ...]` on preview sites; photos not supplied yet show a
labelled sand-colored box.

## Updating each content file

Step-by-step versions are in [docs/UPDATING.md](docs/UPDATING.md).

| File | What's in it | Notes |
|---|---|---|
| `content/site.ts` | Name, legal name, production URL, inquiry email, phone, Instagram/Facebook, footer note | `phone` and each social link are left out of the site while `undefined`. `phone.tel` is E.164 (`+12815550123`). |
| `content/hero.ts` | Eyebrow, headline, subhead, buttons, the three hero photos | The first photo is the tall arch (the only one on phones). |
| `content/values.ts` | Four values under the hero | |
| `content/services.ts` | Section heading, four service cards (text, list, link label, photo) | `id` is also the form's checkbox value and the `?service=` preselect. |
| `content/gallery.ts` | Gallery heading, tag captions, photos | Empty `photos` hides the section. Real photos only. |
| `content/story.ts` | Our story text and the verse | |
| `content/contact.ts` | Contact heading and intro, form labels, service checkboxes, sending/success/error text | Success shows only after the email is confirmed sent. |
| `content/navigation.ts` | Header links, section ids, menu labels | |
| `content/pending.ts` | Open questions with no field yet | Delete a line once it's answered. Each line blocks production. |
| `content/redirects.ts` | Old URLs → pages on this site (301) | Empty: there's no old site. |
| `content/index.ts` | Every content export in one object | Add new content files here so the gates check them. |
| `theme/tokens.ts` | Colors, fonts, corner radii | Font changes also go in `theme/fonts.ts`. `lib/contrast.test.ts` checks every text color pair; `lib/tokens.test.ts` checks the files stay in sync. |
