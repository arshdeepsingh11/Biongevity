"use client";
/** 3D DNA double helix — pure CSS 3D (rotating base-pair rungs). Cheap: ~24 DOM nodes, GPU transforms only. */
export function DnaHelix({ pairs = 22, height = 300, className }: { pairs?: number; height?: number; className?: string }) {
  const bases = ["#2563EB", "#0F9D8F", "#B8873B", "#1E3A8A"];
  return (
    <div className={`relative mx-auto [perspective:900px] ${className ?? ""}`} style={{ height, width: 150 }} aria-hidden>
      <div className="absolute inset-0 animate-[spinY_9s_linear_infinite] [transform-style:preserve-3d]">
        {Array.from({ length: pairs }, (_, i) => (
          <div key={i} className="absolute left-0 right-0 flex items-center justify-between [transform-style:preserve-3d]"
            style={{ top: (i / pairs) * height, transform: `rotateY(${i * 22}deg)` }}>
            <span className="h-3 w-3 rounded-full shadow-[0_0_10px_rgba(37,99,235,.5)]" style={{ background: bases[i % 4] }} />
            <span className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, ${bases[i % 4]}, ${bases[(i + 2) % 4]})`, opacity: 0.55 }} />
            <span className="h-3 w-3 rounded-full shadow-[0_0_10px_rgba(15,157,143,.5)]" style={{ background: bases[(i + 2) % 4] }} />
          </div>
        ))}
      </div>
    </div>
  );
}
