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

---

## Add photos to the gallery

File: `content/gallery.ts`. Photos: `public/images/gallery/`.

**Real photos of S&A's own work only**, never stock or AI-generated images.

1. Save each photo as a `.jpg` with a short lowercase name, for example
   `public/images/gallery/garcia-quince-arch.jpg`. Portrait or square works best (tiles are 4:5);
   about 1200 px on the long side is plenty.
2. Add one block per photo to the `photos` list, in the order they should appear:

   ```ts
   photos: [
     {
       tag: "balloon-arch",
       src: "/images/gallery/garcia-quince-arch.jpg",
       alt: { en: "Gold and white balloon arch over a quinceañera head table" },
     },
   ],
   ```

   - `tag` is one of: `"wedding"`, `"quinceanera"`, `"balloon-arch"`, `"centerpieces"`,
     `"event-shirts"`, `"business-merch"`, `"gift-basket"`, `"personalized-sign"`. It sets the caption
     on the photo.
   - `alt` describes what's in the photo for people who can't see it. One plain sentence.

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
  label: { en: "Real photo" },
},
```

1. Save the photo in `public/images/`, for example `public/images/service-decor.jpg`.
   The boxes are tall arches, so pick a photo whose subject sits in the middle.
2. Set `src` to its path and replace the `alt` placeholder with a real description:

   ```ts
   photo: {
     src: "/images/service-decor.jpg",
     alt: { en: "Blush and gold centerpieces on a reception table" },
     label: { en: "Real photo" },
   },
   ```

   Leave `label` as it is; it's only shown while `src` is `null`.

To replace a photo later, overwrite the file with the same name, or point `src` at the new file and
delete the old one.

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

Every visible sentence lives in `content/` as `{ en: "..." }`. Find the words with VS Code's search
(Cmd+Shift+F), change what's between the quotes, and keep the quotes and the comma after them.

- Service lists: `content/services.ts`, `items` (one `{ en: "..." },` per line).
- Form labels and messages: `content/contact.ts`.
- Story and verse: `content/story.ts`.

If the text contains a straight double quote (`"`), use a curly one (`“ ”`) instead.

## Set the domain (once, at launch)

See "When the domain is chosen" in the [README](../README.md#deploy).
