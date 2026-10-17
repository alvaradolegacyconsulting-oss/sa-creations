import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero } from "@/content/hero";
import { site } from "@/content/site";
import type { Locale, LocalizedText } from "@/content/types";
import { t } from "@/lib/i18n";
import { theme } from "@/theme/tokens";

export const ogSize = { width: 1200, height: 630 };

const LOGO_HEIGHT = 200;

/**
 * Generated share card built from content and theme (from alc-site), one per language: the logo over the
 * eyebrow and headline. Ivory, because the logo is for light backgrounds only (content/site.ts).
 */
export async function renderOgImage(locale: Locale) {
  const logo = await readFile(join(process.cwd(), "public", site.logo.src));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const { headline } = hero;
  // The OG renderer collapses spaces between elements, so lay the headline out word by word.
  const split = (text: LocalizedText | undefined, emphasis: boolean) =>
    (text ? t(text, locale).split(" ") : []).map((word) => ({ word, emphasis }));
  const words = [...split(headline.before, false), ...split(headline.emphasis, true), ...split(headline.after, false)].filter(
    ({ word }) => word.length > 0,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 80px",
          background: theme.color.ivory,
          color: theme.color.navy,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>, not next/image */}
        <img src={logoSrc} alt="" width={Math.round((LOGO_HEIGHT * site.logo.width) / site.logo.height)} height={LOGO_HEIGHT} />
        <div style={{ marginTop: 36, fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: theme.color.copper }}>
          {t(hero.eyebrow, locale)}
        </div>
        <div style={{ marginTop: 16, fontSize: 68, fontWeight: 600, lineHeight: 1.08, display: "flex", flexWrap: "wrap" }}>
          {words.map(({ word, emphasis }, index) => (
            <span key={index} style={{ marginRight: 18, ...(emphasis ? { fontStyle: "italic", color: theme.color.copper } : {}) }}>
              {word}
            </span>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
