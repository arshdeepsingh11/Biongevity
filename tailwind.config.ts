import type { Config } from "tailwindcss";

/** Theme colour from src/styles/themes.css, with Tailwind alpha support (bg-ink/10 etc.). */
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** Four switchable themes (Champagne · Midnight · Mono · Aurora). Colours live in CSS variables only. */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans Variable'", "'DM Sans'", "sans-serif"] },
      colors: {
        // Every colour reads a CSS variable from src/styles/themes.css (4 themes). Names kept for component stability.
        pearl: v("pearl"),
        canvas: v("canvas"),
        surface: v("surface"),
        white: v("surface"),           // "white" = the card surface of the active theme
        snow: "#ffffff",               // true white — only for text over photos and video
        ink: v("ink"),
        muted: v("muted"),
        faint: v("faint"),
        // "navy" = feature surface. Name kept for component stability.
        navy: { DEFAULT: v("feature"), 2: v("feature-2"), 3: v("gold-deep") },
        feature: { DEFAULT: v("feature"), 2: v("feature-2") },
        teal: { DEFAULT: v("teal"), soft: v("teal-soft"), light: v("teal-light") },
        gold: { DEFAULT: v("gold"), soft: v("gold-soft"), deep: v("gold-deep") },
        accent: { DEFAULT: v("accent"), soft: v("accent-soft"), light: v("accent-light"), deep: v("accent-deep") },
        "on-accent": v("on-accent"),
        "on-ai": v("on-ai"),
        ai: { DEFAULT: v("ai"), 2: v("ai-2"), hi: v("ai-hi"), soft: v("ai-soft") },
        violet: { DEFAULT: v("accent"), soft: v("accent-soft") },
        sky: v("accent-soft"),
        aqua: v("accent-deep"),
        cyan: v("teal-soft"),
        amber: v("gold"),
        tangerine: v("tangerine"),
        warn: v("warn"),
        danger: v("danger"),
        scrim: v("scrim"),
      },
      backgroundImage: {
        iri: "var(--g-iri)",
        "iri-x": "var(--g-iri-x)",
        navy: "var(--g-feature)",
        "ai-grad": "var(--g-ai)",
        "btn-grad": "var(--g-btn)",
      },
      borderRadius: { "4xl": "28px", "5xl": "32px" },
      boxShadow: {
        card: "0 1px 2px rgb(var(--c-shadow) / .04), 0 10px 30px rgb(var(--c-shadow) / .06)",
        lift: "0 2px 6px rgb(var(--c-shadow) / .05), 0 24px 60px rgb(var(--c-shadow) / .10)",
        glow: "0 0 0 1px rgb(var(--c-accent) / .20), 0 12px 36px rgb(var(--c-accent) / .18)",
        ai: "0 0 0 1px rgb(var(--c-ai) / .22), 0 14px 40px rgb(var(--c-ai) / .18)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shine: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        scan: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(220%)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
        orbSpin: { to: { transform: "rotate(360deg)" } },
        breathe: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.04)" } },
        aurora: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        dash: { to: { strokeDashoffset: "-200" } },
        orbit: { from: { transform: "rotate(0deg) translateX(var(--r)) rotate(0deg)" }, to: { transform: "rotate(360deg) translateX(var(--r)) rotate(-360deg)" } },
      },
      animation: {
        marquee: "marquee var(--dur,40s) linear infinite",
        shine: "shine 6s linear infinite",
        float: "float 5s ease-in-out infinite",
        scan: "scan 1.4s cubic-bezier(.4,0,.2,1) 1",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        aurora: "aurora 8s ease-in-out infinite",
        orbSpin: "orbSpin 9s linear infinite",
        breathe: "breathe 4.5s ease-in-out infinite",
        spinSlow: "spinSlow 18s linear infinite",
        dash: "dash 3s linear infinite",
        orbit: "orbit var(--dur,20s) linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
