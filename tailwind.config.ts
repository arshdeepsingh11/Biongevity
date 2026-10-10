import type { Config } from "tailwindcss";

/** Aurora Glass — light, airy, medical-grade blue. Zero pink. */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans Variable'", "'DM Sans'", "sans-serif"] },
      colors: {
        pearl: "#FFFFFF",      // --bg
        canvas: "#F5F7FA",     // --bg-subtle
        surface: "#FFFFFF",    // --surface-solid
        ink: "#0F172A",        // --text
        muted: "#64748B",      // --text-secondary
        faint: "#94A3B8",      // --text-muted
        accent: { DEFAULT: "#2563EB", soft: "#3B82F6", light: "#EFF6FF" },
        violet: { DEFAULT: "#2563EB", soft: "#3B82F6" }, // legacy alias → accent
        sky: "#3B82F6",
        aqua: "#0369A1",       // readable cyan-blue for labels
        cyan: "#06B6D4",
        amber: "#F59E0B",      // --warm-1 (tiny use)
        tangerine: "#FB923C",  // --warm-2 (tinier use)
        warn: "#D97706",
      },
      backgroundImage: {
        iri: "linear-gradient(135deg,#1D4ED8,#2563EB 40%,#3B82F6 70%,#22D3EE)",
        "iri-x": "linear-gradient(90deg,#2563EB,#3B82F6 60%,#22D3EE)",
      },
      borderRadius: { "4xl": "28px", "5xl": "32px" },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,.04), 0 8px 28px rgba(15,23,42,.06)",
        lift: "0 2px 6px rgba(15,23,42,.05), 0 24px 60px rgba(15,23,42,.10)",
        glow: "0 0 0 1px rgba(37,99,235,.18), 0 12px 36px rgba(37,99,235,.22)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shine: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        scan: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(220%)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
        aurora: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
      },
      animation: {
        marquee: "marquee var(--dur,40s) linear infinite",
        shine: "shine 6s linear infinite",
        float: "float 5s ease-in-out infinite",
        scan: "scan 1.4s cubic-bezier(.4,0,.2,1) 1",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        aurora: "aurora 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
