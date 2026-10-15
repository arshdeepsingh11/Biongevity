import type { ReactNode } from "react";

/** Aurora Text — text filled with slowly drifting navy, blue and teal light with a brand-gold glint. */
export function AuroraText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block animate-aurora bg-clip-text text-transparent ${className ?? ""}`}
      style={{ backgroundImage: "linear-gradient(110deg,rgb(var(--c-gold-deep)) 0%,rgb(var(--c-accent)) 25%,rgb(var(--c-ai-2)) 48%,rgb(var(--c-accent)) 66%,rgb(var(--c-gold)) 82%,rgb(var(--c-gold-deep)) 100%)", backgroundSize: "260% 100%", WebkitBackgroundClip: "text" }}>
      {children}
    </span>
  );
}
