/**
 * One theme: Olive. Colours live only in src/styles/themes.css; <html data-theme="olive"> is set in the root layout.
 */

/**
 * Fixed palettes — the same in every theme on purpose, because they depict something real:
 * the dark patient-app screen, the globe's sea and night sky, and phone home-screen icons.
 * Kept here (an allow-listed colour file) so no component hard-codes hex values.
 */
export const DEVICE = {
  bezel: "#05070a", bg: "#0a0e13", panel: "#121820", line: "rgba(255,255,255,.07)", track: "rgba(255,255,255,.08)",
  text: "#e9eef4", dim: "#8a96a5", good: "#4ade80", warn: "#fbbf24", warnSoft: "rgba(251,191,36,.14)",
  accent: "#38bdf8", accentSoft: "rgba(56,189,248,.10)", accentLine: "rgba(56,189,248,.25)", violet: "#a78bfa",
} as const;

export const GLOBE = {
  frame: "#03060d", skyDark: "#04060c", skySat: "#020814",
  seaSat: ["#1d5fa8", "#0b3a74", "#05214a"], seaDark: ["#111a2e", "#060a14"],
  marker: "#e9eef7", markerRing: "#9fe0ff", shadow: "#2a2a2a",
} as const;

/** Phone home-screen icon gradients (light → dark), one per app feature. */
export const APP_TINTS: [string, string][] = [["#fb7185", "#e11d48"], ["#60a5fa", "#2563eb"], ["#5eead4", "#0d9488"], ["#bef264", "#65a30d"], ["#7dd3fc", "#0284c7"], ["#fdba74", "#ea580c"]];

/** "r g b" of a theme token, read live from CSS (for canvas and libraries that cannot use CSS variables). */
export function themeRgb(name: string): [number, number, number] {
  if (typeof document === "undefined") return [0, 0, 0];
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--c-${name}`).trim().split(/\s+/).map(Number);
  return v.length === 3 && v.every((n) => !Number.isNaN(n)) ? (v as [number, number, number]) : [0, 0, 0];
}
export const themeHex = (name: string) => `#${themeRgb(name).map((n) => n.toString(16).padStart(2, "0")).join("")}`;

/** Call `fn` whenever the theme attribute changes. Returns an unsubscribe function. */
export function onThemeChange(fn: () => void) {
  if (typeof MutationObserver === "undefined") return () => {};
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
