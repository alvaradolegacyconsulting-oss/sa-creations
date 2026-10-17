# Photo log

Every image prepared with `npm run images` and the exact command that made it from the original, so any
of them can be redone. Originals live outside the repo in `~/Documents/Clients/sa-creations-originals/`
(`$O` below). Box values are pixels of the original as seen (upright): `left,top,width,height`.

The ten photos of S&A's work that came first (hero, service cards, gallery; commit `aa3ed48`) and the
seven licensed season photos (`public/images/seasonal/`, commit `2d0f118`) were resized and re-encoded
without metadata before this script existed. Their sources are in `content/` (the season photos'
`sourceUrl`).

| Site file | Original | Kind | Command |
|---|---|---|---|
| `public/images/logo/sa-creations-logo.png` (header, 404, share images) | `logo.png` (gold/copper S&A over CREATIONS on white, 2000×2000) | logo | `npm run images -- logo $O/logo.png public/images/logo/sa-creations-logo.png --crop 487,664,985,652 --width 600` (crop: the whole lockup with ~20px of margin; transparent, for light backgrounds only) |
| `app/icon.png` (favicon) | `logo.png` | logo | `npm run images -- icon $O/logo.png app/icon.png --crop 497,674,965,449 --size 512 --background white` (crop: the S&A mark only, no CREATIONS, which can't be read at tab size) |
| `app/apple-icon.png` (iPhone home screen) | `logo.png` | logo | `npm run images -- icon $O/logo.png app/apple-icon.png --crop 497,674,965,449 --size 180 --background white` (iOS needs an opaque icon) |

Never use AI or generative upscaling or retouching. Blur or crop only what isn't S&A's to show (house
numbers, plates, guests, other people's names), never S&A's work.
