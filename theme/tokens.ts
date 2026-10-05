export const theme = {
  color: {
    // Headings, primary buttons, the story band; the "Creations" half of the logo.
    navy: "#1E2A45",
    // Text-safe on ivory, sand and white: eyebrows, links, the "S&A" half of the logo on light.
    copper: "#9A5B2E",
    // On navy and ink only (fails on light backgrounds).
    gold: "#D9B77E",
    ivory: "#FBF7F0",
    // Photo tiles and placeholders (sampled from the concept).
    sand: "#F1E6D3",
    // Card and tile borders; decoration only, never an input's only boundary.
    line: "#E3D5BF",
    ink: "#231F20",
    white: "#FFFFFF",
    // Form error state only; never decoration.
    alert: "#A3321F",
  },
  // Loaded in theme/fonts.ts; next/font needs literal arguments, so keep the two in sync
  // (lib/tokens.test.ts checks it).
  font: {
    display: { family: "Cormorant Garamond", weights: ["500", "600"], italicWeights: ["500", "600"] },
    body: { family: "Jost", weights: ["400", "500", "600"] },
  },
  // Feed Tailwind's rounded-sm (inputs, chips), rounded-md (buttons fall back to full) and rounded-lg (cards).
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1.25rem",
  },
} as const;

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/**
 * Set on <html> in app/layout.tsx. app/globals.css maps each one into Tailwind's @theme,
 * so components use classes like bg-navy and text-copper, never hex values.
 * Built from `theme`, so adding a token here only needs its matching line in globals.css.
 */
export const themeCssVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(theme.color).map(([name, value]) => [`--theme-${kebab(name)}`, value])),
  ...Object.fromEntries(Object.entries(theme.radius).map(([name, value]) => [`--theme-radius-${name}`, value])),
};
