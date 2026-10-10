import type { Config } from "tailwindcss";

/** Neural Noir — 2040 AI palette. Cold, precise, luminous. Zero pink. */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans Variable'", "'DM Sans'", "sans-serif"] },
      colors: {
        night: "#05060A",     // --bg-deep
        pearl: "#0A0C12",     // --bg
        surface: "#11141C",   // --surface
        canvas: "#181C28",    // --surface-2 (inputs, chips, inner fills)
        ink: "#F2F4F8",       // --text
        muted: "#8B93A7",     // --text-secondary
        faint: "#5C6578",     // --text-muted
        violet: { DEFAULT: "#3D8BFF", soft: "#00E5C0" }, // accent / accent-2
        sky: "#3D8BFF",
        aqua: "#00E5C0",
        indigo: "#1A1F3A",
        warn: "#FFB020",
      },
      backgroundImage: {
        iri: "linear-gradient(135deg,#00E5C0,#3D8BFF 55%,#1A1F3A)",
        "iri-x": "linear-gradient(90deg,#00E5C0,#3D8BFF 60%,#1A1F3A)",
      },
      borderRadius: { "4xl": "28px", "5xl": "32px" },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,.06), 0 12px 32px rgba(0,0,0,.35)",
        lift: "0 0 0 1px rgba(255,255,255,.10), 0 24px 64px rgba(0,0,0,.55)",
        glow: "0 0 0 1px rgba(61,139,255,.35), 0 12px 40px rgba(61,139,255,.35)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shine: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        scan: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(220%)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
      },
      animation: {
        marquee: "marquee var(--dur,40s) linear infinite",
        shine: "shine 6s linear infinite",
        float: "float 5s ease-in-out infinite",
        scan: "scan 1.4s cubic-bezier(.4,0,.2,1) 1",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
