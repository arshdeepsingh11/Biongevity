import type { ReactNode } from "react";

/** Aurora Text — text filled with slowly drifting navy, blue and teal light with a brand-gold glint. */
export function AuroraText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block animate-aurora bg-clip-text text-transparent ${className ?? ""}`}
      style={{ backgroundImage: "linear-gradient(110deg,#8A6A3A 0%,#97703F 25%,#5E7F62 48%,#97703F 66%,#C2A16A 82%,#8A6A3A 100%)", backgroundSize: "260% 100%", WebkitBackgroundClip: "text" }}>
      {children}
    </span>
  );
}
