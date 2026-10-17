// Prepares S&A's photos and logo files for public/images/ (docs/UPDATING.md has the steps). Ported from Sampayo.
//
//   npm run images -- photo <original.jpg> <public/images/name.jpg> [options]
//     Long edge resized to 2400px, rotated upright, and every bit of metadata (GPS, camera, date)
//     stripped. Never enlarged unless --min-width asks for it. Options (pixels of the original):
//       --blur left,top,width,height   blur a region (house numbers, plates, a customer's name); repeatable
//       --crop left,top,width,height   keep only this box (applied after --blur)
//       --min-width N                  enlarge to N px wide with plain Lanczos + a mild sharpen.
//                                      No AI or generative upscaling: it adds no detail, only size.
//       --quality N                    JPEG quality (default 82); lower it for a photo over ~500 KB
//
//   npm run images -- logo <original logo.png> <public/images/logo/name.png> --crop l,t,w,h [--width N]
//     Cuts a transparent PNG from a logo on a plain white background, keeps only the --crop box, and
//     shrinks it to N px wide (never enlarged).
//
//   npm run images -- icon <original logo.png> <public/name.png> --crop l,t,w,h --size N [--background white]
//     The same cut, centered in an N x N square with a little margin: favicons and the home-screen icon.
//     --background fills the square with a theme color (theme/tokens.ts); without it the square is transparent.
//
// docs/PHOTOS.md records the command used for every file. Originals never go in the repo: they live in
// ~/Documents/Clients/sa-creations-originals/.
// Relative imports only: runs under tsx, which doesn't resolve the "@/" alias.
import { mkdirSync, statSync } from "node:fs";
import { dirname } from "node:path";
import sharp, { type Sharp } from "sharp";
import { theme } from "../theme/tokens";

const PHOTO_LONG_EDGE = 2400;
const JPEG = { quality: 82, mozjpeg: true } as const;

// The logo's paper is flat white, but its ink includes a pale yellow gold, so the key measures how far a
// pixel is from white in its darkest channel (255 minus the lowest of R, G, B), not how dark it is: pale
// yellow sits far from white in blue and stays solid. Within KEY_START of white reads as paper
// (transparent); beyond KEY_START + KEY_RANGE, solid ink. In between is the anti-aliased edge.
const KEY_START = 8;
const KEY_RANGE = 40;
// Space left around the logo inside an icon square, as a share of the side.
const ICON_MARGIN = 0.08;

function ensureDir(file: string) {
  mkdirSync(dirname(file), { recursive: true });
}

async function report(file: string) {
  const meta = await sharp(file).metadata();
  const leftovers = ["exif", "xmp", "iptc"].filter((key) => key in meta && meta[key as keyof typeof meta]);
  const kb = Math.round(statSync(file).size / 1024);
  console.log(`${file}: ${meta.width}x${meta.height}, ${kb} KB, metadata ${leftovers.length ? `LEFT: ${leftovers.join(", ")}` : "stripped"}`);
  if (leftovers.length) process.exitCode = 1;
}

type Box = { left: number; top: number; width: number; height: number };
type PhotoOptions = { blur: Box[]; crop: Box | null; minWidth: number | null; quality: number };
type LogoOptions = { crop: Box | null; width: number | null; size: number | null; background: keyof typeof theme.color | null };

const SHARPEN_AFTER_ENLARGE = { sigma: 0.7 } as const; // mild: softens the Lanczos blur, no halos

function parseBox(flag: string, value: string | undefined): Box {
  const numbers = (value ?? "").split(",").map(Number);
  if (numbers.length !== 4 || numbers.some((n) => !Number.isInteger(n) || n < 0)) {
    throw new Error(`${flag} needs left,top,width,height in whole pixels, got "${value}"`);
  }
  const [left, top, width, height] = numbers;
  return { left, top, width, height };
}

const positiveInteger = (value: string | undefined) => Number.isInteger(Number(value)) && Number(value) > 0;

function parsePhotoOptions(args: string[]): PhotoOptions {
  const options: PhotoOptions = { blur: [], crop: null, minWidth: null, quality: JPEG.quality };
  for (let i = 0; i < args.length; i += 2) {
    const [flag, value] = [args[i], args[i + 1]];
    if (flag === "--blur") options.blur.push(parseBox(flag, value));
    else if (flag === "--crop") options.crop = parseBox(flag, value);
    else if (flag === "--min-width" && positiveInteger(value)) options.minWidth = Number(value);
    else if (flag === "--quality" && Number.isInteger(Number(value)) && Number(value) >= 50 && Number(value) <= 95) {
      options.quality = Number(value);
    }
    else throw new Error(`Unknown or incomplete option "${flag} ${value ?? ""}"`);
  }
  return options;
}

function parseLogoOptions(args: string[]): LogoOptions {
  const options: LogoOptions = { crop: null, width: null, size: null, background: null };
  for (let i = 0; i < args.length; i += 2) {
    const [flag, value] = [args[i], args[i + 1]];
    if (flag === "--crop") options.crop = parseBox(flag, value);
    else if (flag === "--width" && positiveInteger(value)) options.width = Number(value);
    else if (flag === "--size" && positiveInteger(value)) options.size = Number(value);
    else if (flag === "--background" && value && value in theme.color) options.background = value as keyof typeof theme.color;
    else throw new Error(`Unknown or incomplete option "${flag} ${value ?? ""}"`);
  }
  if (!options.crop) throw new Error("--crop is required: measure the box around the logo on the original");
  return options;
}

// Strong enough that numbers and letters can't be read back, scaled to the region.
const blurSigma = (box: Box) => Math.max(6, Math.round(Math.min(box.width, box.height) / 3));

async function photo(input: string, output: string, options: PhotoOptions) {
  ensureDir(output);
  // Steps in between stay lossless (PNG) so the JPEG is compressed once, at the end.
  const lossless = (step: Sharp) => step.png({ compressionLevel: 0 }).toBuffer();
  // rotate() bakes in the EXIF orientation, so --blur and --crop boxes match the picture as seen.
  let image = await lossless(sharp(input).rotate());

  if (options.blur.length > 0) {
    const patches = await Promise.all(
      options.blur.map(async (box) => ({
        input: await lossless(sharp(image).extract(box).blur(blurSigma(box))),
        left: box.left,
        top: box.top,
      })),
    );
    image = await lossless(sharp(image).composite(patches));
  }
  if (options.crop) image = await lossless(sharp(image).extract(options.crop));

  const { width = 0 } = await sharp(image).metadata();
  const enlarge = options.minWidth !== null && width < options.minWidth;
  let pipeline = enlarge
    ? sharp(image).resize({ width: options.minWidth ?? undefined, kernel: "lanczos3" }).sharpen(SHARPEN_AFTER_ENLARGE)
    : sharp(image).resize({
        width: PHOTO_LONG_EDGE,
        height: PHOTO_LONG_EDGE,
        fit: "inside",
        withoutEnlargement: true,
        kernel: "lanczos3",
      });
  // sharp drops all metadata unless asked to keep it.
  pipeline = pipeline.jpeg({ ...JPEG, quality: options.quality });
  await pipeline.toFile(output);
  if (enlarge) console.log(`Enlarged from ${width}px wide (Lanczos + mild sharpen; no added detail).`);
  await report(output);
}

/**
 * The logo on a transparent background, cropped. The ink color is un-mixed from the white paper
 * (C = a·F + (1 − a)·255, solved for F) so the edges carry no white halo on any background.
 */
async function keyOutWhite(input: string, crop: Box): Promise<Buffer> {
  const { data, info } = await sharp(input).removeAlpha().extract(crop).raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const rgb = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const alpha = Math.max(0, Math.min(1, (255 - Math.min(...rgb) - KEY_START) / KEY_RANGE));
    rgb.forEach((value, c) => {
      out[i * 4 + c] = alpha > 0 ? Math.round(Math.max(0, Math.min(255, (value - (1 - alpha) * 255) / alpha))) : 0;
    });
    out[i * 4 + 3] = Math.round(alpha * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

const PNG = { compressionLevel: 9, palette: false } as const;

async function logo(input: string, output: string, options: LogoOptions) {
  ensureDir(output);
  const cut = await keyOutWhite(input, options.crop!);
  // Never enlarged: the site shows the logo smaller than the original.
  const resized = options.width ? sharp(cut).resize({ width: options.width, withoutEnlargement: true, kernel: "lanczos3" }) : sharp(cut);
  await resized.png(PNG).toFile(output);
  await report(output);
}

async function icon(input: string, output: string, options: LogoOptions) {
  if (!options.size) throw new Error("icon needs --size N (the square's side in pixels)");
  ensureDir(output);
  const size = options.size;
  const inner = Math.round(size * (1 - 2 * ICON_MARGIN));
  const mark = await sharp(await keyOutWhite(input, options.crop!))
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: "lanczos3" })
    .png()
    .toBuffer();
  const background = options.background ? theme.color[options.background] : { r: 0, g: 0, b: 0, alpha: 0 };
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: "center" }])
    .png(PNG)
    .toFile(output);
  await report(output);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "photo" && args.length >= 2) return photo(args[0], args[1], parsePhotoOptions(args.slice(2)));
  if (command === "logo" && args.length >= 2) return logo(args[0], args[1], parseLogoOptions(args.slice(2)));
  if (command === "icon" && args.length >= 2) return icon(args[0], args[1], parseLogoOptions(args.slice(2)));
  console.error(
    [
      "Usage:",
      "  npm run images -- photo <original> <public/images/name.jpg> [--blur l,t,w,h]... [--crop l,t,w,h] [--min-width N] [--quality N]",
      "  npm run images -- logo <original logo> <public/images/logo/name.png> --crop l,t,w,h [--width N]",
      "  npm run images -- icon <original logo> <public/name.png> --crop l,t,w,h --size N [--background white]",
    ].join("\n"),
  );
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
