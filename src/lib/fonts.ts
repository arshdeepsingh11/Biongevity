import localFont from "next/font/local";

/**
 * Self-hosted fonts through next/font: the files are preloaded and each font gets a size-matched fallback,
 * so text does not jump when the real font arrives (no layout shift). Same files as before (@fontsource).
 */
export const fontSans = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", weight: "100 1000", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const fontDisplay = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});
