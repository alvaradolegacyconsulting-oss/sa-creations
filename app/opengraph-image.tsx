import { ImageResponse } from "next/og";
import { hero } from "@/content/hero";
import { site } from "@/content/site";
import { theme } from "@/theme/tokens";

// Generated share card built from content and theme (from alc-site); swap for a designed image later if wanted.
export const alt = site.businessName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { headline } = hero;
  // The OG renderer collapses spaces between elements, so lay the headline out word by word.
  const words = [
    ...headline.before.en.split(" ").map((word) => ({ word, emphasis: false })),
    ...(headline.emphasis?.en.split(" ") ?? []).map((word) => ({ word, emphasis: true })),
    ...(headline.after?.en.split(" ") ?? []).map((word) => ({ word, emphasis: false })),
  ].filter(({ word }) => word.length > 0);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: theme.color.navy,
          color: theme.color.ivory,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: theme.color.gold }}>
          {hero.eyebrow.en}
        </div>
        <div style={{ marginTop: 28, fontSize: 80, fontWeight: 600, lineHeight: 1.08, display: "flex", flexWrap: "wrap" }}>
          {words.map(({ word, emphasis }, index) => (
            <span key={index} style={{ marginRight: 20, ...(emphasis ? { fontStyle: "italic", color: theme.color.gold } : {}) }}>
              {word}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", fontSize: 34 }}>
          <div style={{ width: 56, height: 4, marginRight: 24, background: theme.color.gold }} />
          {site.businessName}
        </div>
      </div>
    ),
    size,
  );
}
