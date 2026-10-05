# PREFLIGHT 004 — S&A Creations website (v1)

**Written:** October 5, 2026 · **Architect:** Claude (chat) · **Builder:** Mateo (Claude Code)
**Place in repo:** `docs/preflight/004-sa-creations.md`. Read `CLAUDE.md` first.

## What we're building

A boutique, professional site for S&A Creations, a DBA of Alvarado Legacy Consulting: event planning,
custom decor, custom apparel and custom gifts. Jobs: show the work, explain the four service lines, and
turn interest into a free consultation request. No online store in v1. No domain yet; it builds and lives on
a Vercel preview until one is chosen.

Approved direction: the concept PDFs in `docs/concept/`.

## Reuse (read only)

Confirm real paths in Step 0. Port from `alc-site`: tooling, seo, gates, redirects, `Section`,
`PhotoPlaceholder`, tokens + `@theme`, header/menu/footer, contrast test, and the S&A copy already in
`alc-site/content/holding.ts`. Note sources in commit messages.

## Step 0 — report before code

File tree, content types, port list, ambiguities. Wait for a greenlight.

## Decisions already made

| Decision | Choice |
|---|---|
| Language | English at launch, text shaped `{ en, es? }` |
| Brand | Logo colors: copper-gold "S&A", navy "Creations". Tokens below |
| Footer | "S&A Creations is a DBA of Alvarado Legacy Consulting, LLC" (no "developed by" credit) |
| Contact | Inquiry form → `/api/contact` → email. **Build the UI; stop before the API/email commit** |
| Photos | Real photos only. No generated workshop scenes (the current hero and "values" images are generated) |

## Home sections

1. Hero: eyebrow "Events · Decor · Apparel · Gifts", headline "Making every moment *magical*.", the
   weddings/quinceañeras/apparel/gifts line, buttons: Plan something amazing / See our work.
2. Values: Attention to detail · Made with love · Custom craftsmanship · Small-business friendly.
3. Services: four cards, each with its list (from `holding.ts`) and a CTA to the form, preselecting that service.
4. Gallery: tagged photo grid (wedding, quinceañera, balloon arch, centerpieces, event shirts, merch, gift
   basket, sign). Section hides if no photos are set.
5. Our story + Colossians 3:23.
6. Contact: copy "Let's plan something amazing." Form: name, email, phone, event or need-by date, services
   (checkboxes), details, honeypot. Success only after the email API succeeds; failure shows the email
   address and keeps the form filled.

## Tokens

navy #1E2A45 · copper #9A5B2E (text-safe) · gold #D9B77E (on dark only) · ivory #FBF7F0 · ink #231F20.
Fonts: Cormorant Garamond (500–600, italic) display; Jost (400–600) body.

## Open questions

- [ ] Domain name (then the ALC holding page `/s-and-a-creations` redirects here)
- [ ] Real photos per service line and the logo file
- [ ] Email for inquiries; phone to publish; Instagram/Facebook links
- [ ] Any pricing or "starting at" to show? (default: none)

## Gates

`BUILD_CLEAN` · `CONTENT_ONLY` · `PLACEHOLDERS_RESOLVED` · `GALLERY_EMPTY_STATE` (no photos → section
absent) · `FORM_UI` (validation and the failure state at 390px; delivery waits for the email commit) ·
`PHONE_PASS` · `A11Y` · `SEO` (Organization JSON-LD) · `README_REPLAYS` · `UPDATING_DOC`

## Commit order

1. Scaffold + tooling (ported) · 2. Content + types · 3. Layout · 4. Hero, values, services ·
5. Gallery, story · 6. Contact UI · 7. SEO + gates · 8. README, UPDATING. **Stop before `/api/contact`.**
