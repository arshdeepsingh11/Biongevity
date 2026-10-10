import type { Config } from "tailwindcss";

/** Aurora Glass · Rich — light surfaces, deep navy ink, royal blue, AI teal, brand gold. Zero pink. */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans Variable'", "'DM Sans'", "sans-serif"] },
      colors: {
        pearl: "#FFFFFF",      // --bg
        canvas: "#F5F7FA",     // --bg-subtle
        surface: "#FFFFFF",    // --surface-solid
        ink: "#0B1530",        // --text (deep navy)
        muted: "#4B5876",      // --text-secondary
        faint: "#8A94AB",      // --text-muted
        navy: { DEFAULT: "#0B1530", 2: "#13234D", 3: "#1E3A8A" },
        teal: { DEFAULT: "#0F9D8F", soft: "#14B8A6", light: "#E6F7F5" },
        gold: { DEFAULT: "#B8873B", soft: "#EBDCC0", deep: "#8A6420" },
        accent: { DEFAULT: "#2563EB", soft: "#3B82F6", light: "#EFF6FF" },
        violet: { DEFAULT: "#2563EB", soft: "#3B82F6" }, // legacy alias → accent
        sky: "#3B82F6",
        aqua: "#0369A1",       // readable cyan-blue for labels
        cyan: "#14B8A6",
        amber: "#B8873B",      // brand gold (tiny use)
        tangerine: "#FB923C",  // --warm-2 (tinier use)
        warn: "#D97706",
      },
      backgroundImage: {
        iri: "linear-gradient(135deg,#1E3A8A,#2563EB 48%,#0F9D8F)",
        "iri-x": "linear-gradient(90deg,#1E3A8A,#2563EB 55%,#0F9D8F)",
        navy: "radial-gradient(120% 120% at 0% 0%,#1E3A8A 0%,#0B1530 55%,#070D20 100%)",
      },
      borderRadius: { "4xl": "28px", "5xl": "32px" },
      boxShadow: {
        card: "0 1px 2px rgba(11,21,48,.05), 0 10px 30px rgba(11,21,48,.07)",
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
        spinSlow: "spinSlow 18s linear infinite",
        dash: "dash 3s linear infinite",
        orbit: "orbit var(--dur,20s) linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
