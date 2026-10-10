import type { ReactNode } from "react";

/** Aurora Text — text filled with slowly drifting blue/cyan light (with a hint of amber). */
export function AuroraText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block animate-aurora bg-clip-text text-transparent ${className ?? ""}`}
      style={{ backgroundImage: "linear-gradient(110deg,#1D4ED8 0%,#2563EB 25%,#06B6D4 45%,#3B82F6 62%,#F59E0B 78%,#1D4ED8 100%)", backgroundSize: "260% 100%", WebkitBackgroundClip: "text" }}>
      {children}
    </span>
  );
}
