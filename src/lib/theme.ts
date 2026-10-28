/**
 * Theme system — 3 themes: Sand (default), Mono and Olive. Colours live only in src/styles/themes.css.
 * The inline <head> script (THEME_INIT) applies the saved theme before first paint (no flash).
 */
export const THEMES = [
  { id: "sand", label: "Sand", note: "Black & white · warm sand · default", swatch: ["#FFFFFF", "#0A0A0A", "#C9A96E"], meta: "#FFFFFF" },
  { id: "olive", label: "Olive", note: "Glass · olive", swatch: ["#F3F1F0", "#A1AB54", "#1E221B"], meta: "#F3F1F0" },
  { id: "mono", label: "Mono", note: "Black & white", swatch: ["#FFFFFF", "#111111", "#8F8F8F"], meta: "#FFFFFF" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
/** What the visitor picked: a theme, or "auto" (all themes are light, so auto = Sand). */
export type ThemeChoice = ThemeId | "auto";
export const THEME_KEY = "biongevity.theme.v2";
export const DEFAULT_THEME: ThemeId = "sand";

export const resolveTheme = (c: ThemeChoice): ThemeId => (c === "auto" ? DEFAULT_THEME : c);

/** Runs in <head> before paint. Kept tiny and dependency-free. */
export const THEME_INIT = `(function(){var d=document.documentElement,t="${DEFAULT_THEME}";try{var c=localStorage.getItem("${THEME_KEY}");if(["sand","olive","mono"].indexOf(c)>-1)t=c}catch(e){}d.setAttribute("data-theme",t);d.style.colorScheme="light"})()`;

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
