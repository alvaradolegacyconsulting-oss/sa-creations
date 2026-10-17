# GREENLIGHT 004-C — sa-creations: launch readiness

**Written:** October 16, 2026 · **Architect:** Claude (chat) · **Builder:** Mateo (Claude Code)
**Place in repo:** `docs/preflight/004-C-launch.md`. Branch: `build/v1`.

## Why

Everything S&A needs to go live at **www.sacustomcreations.com** (bought Oct 16, Squarespace, Jose's
account). Sayra has reviewed both languages. This greenlight closes the open facts, adds the
security baseline, and gets the contact form delivering from the new domain.

## Decisions (Jose, Oct 16)

| Item | Decision |
|---|---|
| Domain | `https://www.sacustomcreations.com` (apex 308 → www, set in Vercel) |
| Inquiry email (shown on site + form recipient) | `sayra@alvaradolegacyconsultingllc.com` (temporary; will move to the new domain later — keep it one content value) |
| Phone | `832-363-0716` (call + text links) |
| Social links | **none for now** unless Jose says otherwise: mark intentionally none |
| Spanish | Sayra approved → `translationsReviewed: true` |
| Headlines | Option A everywhere (hero and seasons) stays as is |
| Logo | Gold/copper "S&A" with "CREATIONS" (2000px PNG on white). Transparent cut via an image script like A1's/Sampayo's |
| Apparel photo | Real S&A work: ShieldMyLot team apparel (printed polo, embroidered jacket, embroidered dress shirt). Flat-lay of three → apparel service card and hero 3 (shirt slot returns). Close-up of the polo on the hanger → gallery |

## Step 0 — report before code (short)

1. Current PRODUCTION_GATES output and the exact list of open placeholders.
2. Whether the CLAUDE.md security baseline is applied (headers, `_blank` helper + test).
3. Contact route: env var names it reads, sender/recipient/reply-to handling, and what it needs to
   send from a verified domain instead of `onboarding@resend.dev`.

Proceed unless something conflicts.

## Commits (one concern each, push after each)

1. `chore: update CLAUDE.md to current standard` (Jose copies it in).
2. `feat: security headers` + `feat: external link helper` — port from alc-site (08f1251, df8df8c)
   if missing. CSP must allow the contact API and Vercel Live on previews only.
3. `chore: image prep script` — port Sampayo's `npm run images` (plain resize, metadata/GPS
   stripped, background cut for logos, every step logged in `docs/PHOTOS.md`; no AI upscaling).
4. `content: logo` — header + share image + favicon from the S&A mark. Propose the header crop in
   the report; commit with your best default (Jose judges on the preview).
5. `content: apparel photos` — `kind: "real"`. Alt text describes them as custom team apparel made
   by S&A for ShieldMyLot. One short caption is fine ("Team apparel for ShieldMyLot"); no link
   required. Remove the apparel `{ kind: "none" }` marker; hero 3 goes back to the shirt.
6. `content: launch facts` — site.url, email, phone, socials none, translationsReviewed true.
7. `feat: contact from verified domain` — sender becomes
   `S&A Creations <inquiries@sacustomcreations.com>` (env `CONTACT_FROM_EMAIL`), recipient
   `CONTACT_TO_EMAIL` = Sayra's address, `reply_to` = the visitor's email. No code assumes the
   onboarding sender. Update `.env.example` and `docs/UPDATING.md`.

## Gates

BUILD_CLEAN · PRODUCTION_GATES (must pass with Spanish included) · CONTACT_DELIVERS (Jose, on the
preview, after the Resend domain is verified and env vars set) · PHONE_PASS, CONTACT_LINKS, CSP_CLEAN
(Jose). **Do not merge to `main`** until Jose says go; DNS follows the merge.

## Not in this greenlight

- DNS for sacustomcreations.com (Jose, per the runbook, after the merge).
- Re-pointing the printed card's `/gallery` on alc-site (separate commit in the alc-site window).
