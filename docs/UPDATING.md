# Updating the site

Plain-English steps for the edits that come up after launch. Written for whoever holds the Care Plan.
You don't need to know React: every edit below is a change to one file in `content/` (or a photo in
`public/images/`).

## How every edit works

Type each command on its own line in the terminal (macOS `zsh`).

1. **Get the latest code**, then make a branch for your change:

   ```bash
   git checkout main
   git pull
   git checkout -b content/short-description
   ```

2. **Make the edit** described below in a code editor (VS Code is fine). Keep the quotes, commas and
   brackets exactly as in the examples.
3. **Check it:** `npm run build`. If something is wrong, the build stops and says what to fix. For a
   look first, run `npm run dev` and open http://localhost:3000.
4. **Commit and push** (single quotes, so `zsh` doesn't trip on a `!`):

   ```bash
   git add -A
   git commit -m 'content: add wedding photos to the gallery'
   git push -u origin HEAD
   ```

5. **Check the preview:** Vercel builds the branch and shows a preview URL (Vercel dashboard →
   Deployments, or on the GitHub commit). Open it **on a phone**.
6. **Publish:** open a pull request into `main` on GitHub and merge it. Vercel deploys production in a
   minute or two. Check the live site on a phone.

If a production deploy goes wrong: Vercel → Deployments → the previous good production deployment →
**Promote to Production**. Then fix it calmly on a branch.

Never type a fact nobody has confirmed (prices, phone numbers, emails, what's included). If you don't
know, leave the `[PLACEHOLDER: ...]` in place. Production won't deploy while one is left, which is
deliberate. `npm run gates` lists everything still open.

The site is in **English and Spanish**. Every piece of text is written as `{ en: "...", es: "..." }`:
when you change one language, change the other too (or ask S&A for it). After any text change, run
`npm run review` so `docs/REVIEW.md` matches; `npm test` fails until you do.

---

## Add photos to the gallery

File: `content/gallery.ts`. Photos: `public/images/` (the hero and service cards can reuse the same files).

**Real photos of S&A's own work only**, never stock or AI-generated images. No customer faces,
names or house numbers unless the customer has said yes; crop them out or leave the photo out.

1. Put the original in `~/Documents/Clients/sa-creations-originals/` (never in the repo), then make the
   site copy with a short lowercase name, no spaces or accents. In the VS Code terminal:

   ```
   npm run images -- photo ~/Documents/Clients/sa-creations-originals/IMG_1234.jpeg public/images/quince-gold-balloon-arch.jpg
   ```

   It resizes, turns the photo upright and strips everything hidden in the file (GPS location, camera,
   date). Add `--blur left,top,width,height` for a house number or a guest, or `--crop left,top,width,height`
   to keep part of it. Portrait or square works best (tiles are 4:5). Add a row to `docs/PHOTOS.md` with
   the command you ran.
2. Add one block per photo to the `photos` list, in the order they should appear:

   ```ts
   photos: [
     {
       tag: "balloon-arch",
       src: "/images/quince-gold-balloon-arch.jpg",
       alt: {
         en: "Gold and white balloon arch over a quinceañera head table",
         es: "Arco de globos dorados y blancos sobre la mesa principal de una quinceañera",
       },
     },
   ],
   ```

   - `tag` is one of: `"wedding"`, `"quinceanera"`, `"baby-shower"`, `"proposal"`, `"balloon-arch"`,
     `"centerpieces"`, `"event-shirts"`, `"business-merch"`, `"gift-basket"`, `"personalized-sign"`. It sets the caption
     on the photo.
   - `alt` describes what's in the photo for people who can't see it. One plain sentence, in both
     languages.

The gallery, its "Gallery" menu link and the hero's "See our work" button appear as soon as there's
one photo, and disappear again if the list is emptied.

## Swap a hero or service photo

Files: `content/hero.ts` (three hero photos) and `content/services.ts` (one per service card).
Photos: `public/images/`.

Each photo looks like this until a real one is supplied:

```ts
photo: {
  src: null,
  alt: { en: "[PLACEHOLDER: describe the custom decor photo]" },
  kind: "real",
  label: { en: "Real photo", es: "Foto real" },
},
```

1. Make the file with `npm run images -- photo ...` as in "Add photos to the gallery" step 1, for example
   `public/images/service-decor.jpg`. The boxes are tall arches, so pick a photo whose subject sits in
   the middle.
2. Set `src` to its path and replace the `alt` placeholder with a real description:

   ```ts
   photo: {
     src: "/images/service-decor.jpg",
     alt: {
       en: "Blush and gold centerpieces on a reception table",
       es: "Centros de mesa rosa palo y dorado en una mesa de recepción",
     },
     kind: "real",
     label: { en: "Real photo", es: "Foto real" },
   },
   ```

   Leave `kind` and `label` as they are (`label` is only shown while `src` is `null`). These photos
   are always S&A's own work (`kind: "real"`).

To replace a photo later, overwrite the file with the same name, or point `src` at the new file and
delete the old one.

A service with no real photo yet can go without one on purpose: set `photo: { kind: "none" }` and the
card shows text only. (The custom apparel card is like this until S&A has a real apparel photo.) Use
this rather than leaving `src: null`, which blocks production.

## Set the inquiry email, phone or social links

File: `content/site.ts`

- **Email:** replace `placeholder("inquiry email")` with the address in quotes:
  `email: "hello@example.com",`. It appears in the contact section and in the form's error message.
- **Phone:** replace `phone: undefined` with:

  ```ts
  phone: { display: "(281) 555-0123", tel: "+12815550123" },
  ```

  `display` is how it reads; `tel` is the same number with `+1` and digits only (it's what a phone
  dials). Leave `undefined` to publish no phone number.
- **Instagram / Facebook:** set the full URLs:

  ```ts
  social: { instagram: "https://www.instagram.com/example", facebook: "https://www.facebook.com/example" },
  ```

  A link left `undefined` is simply not shown. The gallery's "Follow on Instagram" link appears once
  `instagram` is set.

Then delete the matching line from `content/pending.ts`.

## Change text

Every visible sentence lives in `content/` as `{ en: "...", es: "..." }`. Find the words with VS
Code's search (Cmd+Shift+F), change what's between the quotes, and keep the quotes and the comma after
them. Change the Spanish too, then run `npm run review`.

- Service lists: `content/services.ts`, `items` (one `{ en: "...", es: "..." },` per line).
- Form labels and messages: `content/contact.ts`.
- Story and verse: `content/story.ts`.
- This Season: `content/seasonal.ts` (below).

If the text contains a straight double quote (`"`), use a curly one (`“ ”`) instead.

## Apply Sayra's corrections, then sign off the Spanish

`docs/REVIEW.md` lists every piece of text in English and Spanish, with where it lives (the first
column, e.g. `services[2].items[3]` means `content/services.ts`, the third service card's fourth item;
counting starts at 0).

1. For each correction S&A sends back, find the English words with Cmd+Shift+F in `content/` and
   change the `es` (or `en`) text next to them. One commit per batch of corrections is fine:
   `content: Spanish corrections from Sayra`.
2. Run `npm run review` and commit the regenerated `docs/REVIEW.md` with it.
3. **Once S&A has approved all of it**, in `content/site.ts` change

   ```ts
   translationsReviewed: false,
   ```

   to `true`, and commit: `content: Spanish signed off by Sayra`. That clears the
   `TRANSLATIONS_REVIEWED` gate; production can then deploy (once the other gates pass too).

If a new piece of text is added later, it needs Spanish before production deploys
(`TRANSLATIONS_COMPLETE` lists any that are missing). To take the Spanish site down entirely, set
`languages: ["en"]` in `content/site.ts`: `/es` then disappears, along with the EN | ES switch.

## This Season

File: `content/seasonal.ts`. The home page band and `/season` show the season running **today in
Houston time**; on days with no season (Dec 25, for example) they show the `evergreen` copy.

### Change a season's words

Each season looks like this. Change the `en` and `es` text; keep everything else.

```ts
{
  id: "christmas-2026",
  start: "2026-11-27",
  end: "2026-12-24",
  name: { en: "Christmas & holidays", es: "Navidad y fiestas" },
  headline: { en: "Give a gift they'll remember.", es: "Da un regalo que nunca olviden." },
  body: { en: "...", es: "..." },
  occasions: [{ en: "Gift baskets", es: "Canastas de regalo" }],
  photo: { kind: "none" },
  cta: { label: { en: "Order holiday gifts", es: "Pide tus regalos navideños" }, service: "gifts" },
},
```

- `start` and `end` are the first and last day, written `YYYY-MM-DD`. Both days count. The season
  switches on and off at **midnight Central time**.
- `service` is the box the contact form checks when someone taps the button: `"events"`, `"decor"`,
  `"apparel"` or `"gifts"`. Leave it out to check none.
- Never add a price, discount or deadline nobody has confirmed.

### Add next year's seasons

When `npm run gates` prints **SEASONS_ENDING_SOON**, the last season ends within 60 days.

1. Copy this year's season blocks and paste them after the last one.
2. In each copy, change the year in `id` (`christmas-2026` → `christmas-2027`), `start` and `end`.
   Check the dates that move each year (Thanksgiving, Mother's Day, graduation).
3. Seasons must not overlap: each `start` must be after the previous season's `end`. The build stops
   and says which ones clash if they do.
4. Old seasons can stay or be deleted; past ones never show.
5. Run `npm run review`, commit (`content: 2027–28 seasons`), push, and check `/season` on the preview
   (below).

### Preview every season

On a **preview** URL, `/season` lists every season with a link: `/season/christmas-2026`,
`/es/temporada/christmas-2026` and so on. Each shows that season whatever today's date is, under a
banner with its dates. These pages don't exist on the live site.

### Add a season photo

Seasons may use **licensed stock photos** (nowhere else on the site). Only use a photo you have a
license for: keep the receipt or license page. Never a photo copied from social media, another
business's listing or a search result, and never one generated by AI.

1. Save it as `public/images/seasonal/<season id>.jpg`, for example
   `public/images/seasonal/christmas-2026.jpg`, at least 1200 px on the long side.
2. In that season, replace `photo: { kind: "none" }` with:

   ```ts
   photo: {
     src: "/images/seasonal/christmas-2026.jpg",
     alt: {
       en: "Red and green woven gift baskets with holiday treats and plush toys",
       es: "Canastas tejidas rojas y verdes con dulces navideños y peluches",
     },
     kind: "stock",
     sourceUrl: "https://www.example-stock-site.com/photo/123456",
     label: { en: "Stock photo", es: "Foto de stock" },
   },
   ```

   - `alt` says what's in the picture. Never "our basket" or "made by S&A": it isn't S&A's work, and
     a test fails if it says so.
   - `sourceUrl` is the photo's page on the stock site, so anyone can check the license later.

3. `npm run gates` lists every stock photo under **STOCK_IN_USE**. Replace them with S&A's own photos
   when there are some (`kind: "real"`, no `sourceUrl`).

## Set the domain (once, at launch)

See "When the domain is chosen" in the [README](../README.md#deploy).
