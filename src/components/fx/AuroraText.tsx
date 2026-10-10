import type { ReactNode } from "react";

/** Aurora Text — text filled with slowly drifting navy, blue and teal light with a brand-gold glint. */
export function AuroraText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block animate-aurora bg-clip-text text-transparent ${className ?? ""}`}
      style={{ backgroundImage: "linear-gradient(110deg,#1E3A8A 0%,#2563EB 25%,#0F9D8F 48%,#2563EB 66%,#B8873B 82%,#1E3A8A 100%)", backgroundSize: "260% 100%", WebkitBackgroundClip: "text" }}>
      {children}
    </span>
  );
}
