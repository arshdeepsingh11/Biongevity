"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DEPARTMENTS } from "@/data/health";

/**
 * The "AI on every touch and scroll" layer:
 *  • cursor aura — soft iridescent light following the pointer (desktop)
 *  • neural tap ripple — every tap/click emits an iridescent pulse with sparks
 *  • reveal + scan — [data-reveal] blur-in, [data-scan] AI scan sweep on enter
 *  • calm mode — muted effects on Clinic and Mental Health pages
 */
export function AIInteractionLayer() {
  const path = usePathname();

  useEffect(() => {
    const calm = DEPARTMENTS.some((d) => d.calm && path.includes(d.id));
    document.documentElement.classList.toggle("fx-calm", calm);
  }, [path]);

  // Reveal / scan observers (re-bound on route change + DOM mutations)
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in", "is-scanned");
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    const bind = () => document.querySelectorAll("[data-reveal]:not(.is-in),[data-scan]:not(.is-scanned)").forEach((el) => io.observe(el));
    bind();
    // Safety net: anything already scrolled past is shown even if IO was starved.
    const safety = setInterval(() => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in", "is-scanned");
    }), 1500);
    const mo = new MutationObserver(() => bind());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); clearInterval(safety); };
  }, [path]);

  // Cursor aura + tap ripple
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const move = (e: PointerEvent) => {
      // edge light: cursor position inside the hovered card
      const card = (e.target as Element | null)?.closest?.(".card") as HTMLElement | null;
      if (card) { const r = card.getBoundingClientRect(); card.style.setProperty("--cx", `${e.clientX - r.left}px`); card.style.setProperty("--cy", `${e.clientY - r.top}px`); }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { root.style.setProperty("--mx", `${e.clientX}px`); root.style.setProperty("--my", `${e.clientY}px`); });
    };
    const tap = (e: PointerEvent) => {
      if (reduced || root.classList.contains("fx-calm")) return;
      const r = document.createElement("span");
      r.className = "pointer-events-none fixed z-[200] rounded-full";
      Object.assign(r.style, { left: `${e.clientX}px`, top: `${e.clientY}px`, width: "8px", height: "8px", transform: "translate(-50%,-50%)", border: "1.5px solid rgb(var(--c-accent)/.7)", boxShadow: "0 0 18px rgb(var(--c-accent)/.35)" });
      document.body.appendChild(r);
      r.animate([{ width: "8px", height: "8px", opacity: 1 }, { width: "84px", height: "84px", opacity: 0 }], { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = () => r.remove();
      const cols = ["rgb(var(--c-teal-soft))", "rgb(var(--c-accent-soft))", "rgb(var(--c-accent))", "rgb(var(--c-ai-hi))"];
      for (let i = 0; i < 6; i++) {
        const s = document.createElement("span"), a = (i / 6) * Math.PI * 2 + Math.random();
        s.className = "pointer-events-none fixed z-[200] rounded-full";
        Object.assign(s.style, { left: `${e.clientX}px`, top: `${e.clientY}px`, width: "4px", height: "4px", background: cols[i % 4] });
        document.body.appendChild(s);
        s.animate([{ transform: "translate(-50%,-50%)", opacity: 1 }, { transform: `translate(${Math.cos(a) * 34 - 2}px,${Math.sin(a) * 34 - 2}px)`, opacity: 0 }], { duration: 560, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = () => s.remove();
      }
    };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", tap, { passive: true });
    return () => { removeEventListener("pointermove", move); removeEventListener("pointerdown", tap); };
  }, []);

  return (
    <div aria-hidden data-ai-fx className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      style={{ background: "radial-gradient(600px circle at var(--mx) var(--my), rgb(var(--c-accent)/.06), transparent 60%)" }} />
  );
}
