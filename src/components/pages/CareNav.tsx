"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const ITEMS = [["journey", "Journey"], ["anywhere", "Anywhere"], ["clinics", "Clinics"], ["app", "ELR App"]] as const;

/** Sticky in-page navigation for Care. Pill glides to the section in view. */
export function CareNav() {
  const [active, setActive] = useState<string>("journey");
  const ref = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ l: 0, w: 0 });
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    ITEMS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  useLayoutEffect(() => { const el = ref.current?.querySelector<HTMLElement>(`[data-id="${active}"]`); if (el) setPill({ l: el.offsetLeft, w: el.offsetWidth }); }, [active]);
  return (
    <div className="sticky top-[calc(70px+var(--safe-top))] z-30 flex justify-center px-4">
      <div ref={ref} className="glass relative flex rounded-full p-1 shadow-lift">
        <span aria-hidden className="absolute bottom-1 top-1 rounded-full bg-ink transition-all duration-500 [transition-timing-function:cubic-bezier(.3,1.3,.4,1)]" style={{ left: pill.l, width: pill.w }} />
        {ITEMS.map(([id, label]) => (
          <a key={id} data-id={id} href={`#${id}`} className={`relative z-10 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors sm:px-4 ${active === id ? "text-night" : "text-muted hover:text-ink"}`}>{label}</a>
        ))}
      </div>
    </div>
  );
}
