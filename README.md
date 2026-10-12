# S&A Creations — website

Marketing site for S&A Creations (a DBA of Alvarado Legacy Consulting, LLC): event planning, custom
decor, custom apparel and custom gifts. A home page (hero, values, This Season, the four services, a
photo gallery, our story and an inquiry form for a free consultation) and a `/season` page, in English
and Spanish. Next.js (App Router), TypeScript, Tailwind CSS. No database, no CMS, no logins, no store.

> **Status (build/v1):** every section is built, in both languages. The inquiry form sends email
> through `/api/contact` (Resend) once the three environment variables below are set. The Spanish is
> drafted and waiting for Sayra's review (`docs/REVIEW.md`). There is no domain yet: the site lives on
> Vercel preview URLs, and production is blocked on purpose until the open questions are answered and
> the Spanish is signed off (see [Build-time gates](#build-time-gates-prebuild)).

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
form's email sending needs them (below).

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

Only `/api/contact` reads them. Without them the form shows its "couldn't send" message (with the
inquiry email) and nothing is lost; the route logs which variable is missing. `.env.local` is git-ignored;
never commit real values. On Vercel, set all three under **Project Settings → Environment Variables**
for **Preview** and **Production**, then redeploy.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server on http://localhost:3000 |
| `npm test` | Unit and component tests (Vitest): contact route and form states, season picker and midnight-Central boundaries, language switch, phone menu, gallery empty state, gates, SEO, redirects, color contrast, token drift |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run build` | Production build. Runs the production gates first (below). |
| `npm run gates` | Prints each gate as PASS/FAIL with everything still open, plus the two warnings, on any machine |
| `npm run review` | Regenerates `docs/REVIEW.md` (every text, English and Spanish) from `content/`. Run it after any text change; a test fails if it's out of date. |
| `npm start` | Serve the output of `npm run build` locally |

Before every push, `npm run lint`, `npm test` and `npm run build` should all pass (`BUILD_CLEAN`).

### Build-time gates (`prebuild`)

`scripts/check-production-gates.ts` runs before every build but only blocks **production**
(`VERCEL_ENV=production`). Preview and local builds pass with placeholders so work can continue.

- **PLACEHOLDERS_RESOLVED:** fails while any text in `content/` contains `[PLACEHOLDER` (including
  the open questions in `content/pending.ts`) or any photo's `src` is still `null`. A photo set to
  `{ kind: "none" }` (no photo, on purpose) passes.
- **TRANSLATIONS_COMPLETE** (once `site.languages` includes `"es"`): every text in `content/` needs
  Spanish that isn't missing, empty or marked `[TRANSLATE`. Previews show a missing one as
  `[TRANSLATE] <English>`.
- **TRANSLATIONS_REVIEWED** (once Spanish is on): fails while `translationsReviewed` in
  `content/site.ts` is `false`. Jose sets it to `true` after S&A signs off `docs/REVIEW.md`.
- An **empty gallery is not a failure**: the gallery section, its menu link and the hero's
  "See our work" button simply don't appear until there's at least one photo.

Two warnings print with the gates but never block:

- **STOCK_IN_USE:** every licensed stock photo on the site (seasons only), with its source.
- **SEASONS_ENDING_SOON:** the last season in `content/seasonal.ts` ends within 60 days, has
  ended, or there are none. Add next year's seasons (`docs/UPDATING.md`).

**SEASONS_VALID** fails **every** build, previews included: a season with a bad id, an impossible date,
an end before its start, a duplicate id or an overlap with another season.

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
grep -rniE 'alvarado|S&A|quincea|wedding|colossians|instagram\.com|facebook\.com|@[a-z]+\.(com|net)|\$[0-9]|tel:\+' app components --include='*.ts' --include='*.tsx' --exclude='*.test.ts' --exclude='*.test.tsx'
```

## Pages and languages

| English | Spanish | What |
|---|---|---|
| `/` | `/es` | The home page |
| `/season` | `/es/temporada` | This Season: the season running today, or the evergreen copy |
| `/season/<id>` | `/es/temporada/<id>` | **Previews only:** one season whatever the date, with a banner. 404 in production, never in the sitemap. `/season` lists them on previews. |

- `lib/routes.ts` is the route table. English is served at `/` (`app/(default)`), Spanish under
  `/es` (`app/(alternate)/[alt]`). Spanish pages exist only while `languages` in `content/site.ts`
  includes `"es"`; with `["en"]`, `/es` is a 404 and the EN | ES switch, hreflang and Spanish sitemap
  entries disappear.
- Each page lists its translation (hreflang, with English as `x-default`), and `sitemap.xml` lists
  every page in each language. Share images: `/og/en` and `/og/es`.
- Any unknown address shows `app/global-not-found.tsx` (needed because there are two root layouts).

### This Season

`content/seasonal.ts` holds dated seasons (inclusive Central dates) and an evergreen fallback. The
page is built statically, so the HTML always carries the evergreen copy; the browser works out today's
date in `America/Chicago` (`lib/time.ts`, `lib/useCentralDateKey.ts`) and swaps in the season running
today, re-checking every minute. A season's button links to the contact form with its service checked
and an "Asking about" chip; the inquiry email names the season.

### The contact form

`/api/contact` validates the form (`lib/contact-schema.ts`, shared limits in `lib/contact.ts`), drops
bot submissions (honeypot), refuses bodies over 32 KB, and sends one plain-text email through Resend
with Reply-To set to the visitor. The subject is "Website inquiry: <name>", plus "(Spanish)" and the
season name when they apply. The form shows "sent" only after Resend confirms; any failure keeps every
field filled and shows the inquiry email. Logs record the outcome only, never the message.

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
app/            (default)/ English pages, (alternate)/[alt]/ Spanish pages, api/contact, og/[locale]
                share images, global-not-found.tsx, sitemap.ts, robots.ts
lib/            Helpers: gates, SEO, contact form and email, seasons, routes, i18n, time zone, review, contrast
scripts/        Build-time gates (check-production-gates.ts) and the review page (review.ts)
public/images/  Photos (and the logo once it arrives)
docs/preflight/ Specs and approvals from the architect (latest is the source of truth)
docs/concept/   The approved design concept (PDF)
docs/UPDATING.md  Plain-English update steps
docs/REVIEW.md    Every text in English and Spanish, for S&A to review (generated: npm run review)
```

Visible text in `content/` is shaped `{ en: "...", es: "..." }`. Anything unconfirmed reads
`[PLACEHOLDER: ...]` on preview sites; photos not supplied yet show a labelled sand-colored box.

## Updating each content file

Step-by-step versions are in [docs/UPDATING.md](docs/UPDATING.md).

| File | What's in it | Notes |
|---|---|---|
| `content/site.ts` | Languages, Spanish sign-off flag, name, legal name, production URL, inquiry email, phone, Instagram/Facebook, footer note | `languages: ["en", "es"]` builds the Spanish site. `translationsReviewed` blocks production until `true`. `phone` and each social link are left out of the site while `undefined`. `phone.tel` is E.164 (`+12815550123`). |
| `content/hero.ts` | Eyebrow, headline, subhead, buttons, the three hero photos | The first photo is the tall arch (the only one on phones). |
| `content/values.ts` | Four values under the hero | |
| `content/services.ts` | Section heading, four service cards (text, list, link label, photo) | `id` is also the form's checkbox value and the `?service=` preselect. `photo: { kind: "none" }` shows a card with no photo, on purpose. |
| `content/seasonal.ts` | Seasons (dates, name, headline, body, occasions, photo, button) and the evergreen fallback; preview-page labels | Dates are inclusive Central dates. Seasons must not overlap. Stock photos are allowed here only (`kind: "stock"` with `sourceUrl`). |
| `content/gallery.ts` | Gallery heading, tag captions, photos | Empty `photos` hides the section. Real photos only. |
| `content/story.ts` | Our story text and the verse | The verse reference names the Bible version in each language (NIV, Reina-Valera 1960). |
| `content/contact.ts` | Contact heading and intro, form labels, service checkboxes, season chip, sending/success/error text | Success shows only after the email is confirmed sent. |
| `content/navigation.ts` | Header links, section ids, menu and language-switch labels, the 404 page text | |
| `content/pending.ts` | Open questions with no field yet | Delete a line once it's answered. Each line blocks production. |
| `content/redirects.ts` | Old URLs → pages on this site (301) | Empty: there's no old site. |
| `content/index.ts` | Every content export in one object | Add new content files here so the gates check them. |
| `theme/tokens.ts` | Colors, fonts, corner radii | Font changes also go in `theme/fonts.ts`. `lib/contrast.test.ts` checks every text color pair; `lib/tokens.test.ts` checks the files stay in sync. |
