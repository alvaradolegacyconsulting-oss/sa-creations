import type { CSSProperties, ReactNode } from "react";
import { bodyFont, displayFont } from "@/theme/fonts";
import { themeCssVariables } from "@/theme/tokens";
import "./globals.css";

const themeVariables = themeCssVariables as CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} style={themeVariables}>
      <body>{children}</body>
    </html>
  );
}
