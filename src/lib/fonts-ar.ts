import localFont from "next/font/local";

/**
 * Arabic font, imported only by the Arabic root layout (app/(arabic)/layout.tsx), so it is preloaded on Arabic pages
 * and never downloaded on English pages. Preloading avoids several full-page relayouts as each weight arrives.
 * Weights: 400 (text), 600 (headings, buttons), 700 (bold). 500 falls back to 400.
 */
export const fontArabic = localFont({
  src: [
    { path: "../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ar",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Tahoma", "Arial", "sans-serif"],
});
