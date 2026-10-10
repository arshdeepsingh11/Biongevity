import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans Variable'", "'DM Sans'", "system-ui", "sans-serif"] },
      colors: {
        ink: "#1D1D1F",
        muted: "#6E6E73",
        faint: "#86868B",
        canvas: "#F5F5F7",
        pearl: "#FBFBFD",
        night: "#0A0A0C",
        violet: { DEFAULT: "#6A5CFF", soft: "#9B6BFF" },
        coral: "#FF8A3D",
        rose: "#FF4D8D",
        sky: "#3D8BFF",
        warn: "#C2410C",
      },
      backgroundImage: {
        iri: "linear-gradient(135deg,#FF8A3D,#FF4D8D 35%,#9B6BFF 70%,#3D8BFF)",
        "iri-x": "linear-gradient(90deg,#FF8A3D,#FF4D8D 33%,#9B6BFF 66%,#3D8BFF)",
      },
      borderRadius: { "4xl": "28px", "5xl": "36px" },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.04), 0 8px 30px rgba(0,0,0,.06)",
        lift: "0 2px 6px rgba(0,0,0,.05), 0 24px 60px rgba(0,0,0,.10)",
        glow: "0 0 0 1px rgba(106,92,255,.15), 0 12px 40px rgba(106,92,255,.25)",
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
