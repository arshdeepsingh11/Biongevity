import type { Config } from "tailwindcss";

/** Champagne — ivory surfaces, warm charcoal ink, champagne-bronze accent, sage secondary. Light only. */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans Variable'", "'DM Sans'", "sans-serif"] },
      colors: {
        pearl: "#FFFDF9",
        canvas: "#FAF6EF",
        surface: "#FFFFFF",
        ink: "#221D16",
        muted: "#6B6155",
        faint: "#A39889",
        // "navy" = feature surface (warm champagne panel). Name kept for component stability.
        navy: { DEFAULT: "#F4ECDF", 2: "#EDE2CF", 3: "#8A6A3A" },
        teal: { DEFAULT: "#5E7F62", soft: "#7FA083", light: "#EDF2EA" },   // sage
        gold: { DEFAULT: "#C2A16A", soft: "#F1E6D1", deep: "#8A6A3A" },   // champagne gold
        accent: { DEFAULT: "#97703F", soft: "#B8925C", light: "#F7EFE3" }, // champagne bronze
        violet: { DEFAULT: "#97703F", soft: "#B8925C" },
        sky: "#B8925C",
        aqua: "#6B5232",
        cyan: "#7FA083",
        amber: "#C2A16A",
        tangerine: "#C9895B",
        warn: "#B4691F",
      },
      backgroundImage: {
        iri: "linear-gradient(135deg,#D9BE8E,#B08A55 52%,#8A6A3A)",
        "iri-x": "linear-gradient(90deg,#D9BE8E,#B08A55 55%,#7FA083)",
        navy: "radial-gradient(120% 120% at 0% 0%,#FBF6EC 0%,#F4ECDF 55%,#EDE2CF 100%)",
      },
      borderRadius: { "4xl": "28px", "5xl": "32px" },
      boxShadow: {
        card: "0 1px 2px rgba(60,44,20,.04), 0 10px 30px rgba(60,44,20,.06)",
        lift: "0 2px 6px rgba(60,44,20,.05), 0 24px 60px rgba(60,44,20,.10)",
        glow: "0 0 0 1px rgba(151,112,63,.20), 0 12px 36px rgba(151,112,63,.18)",
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
