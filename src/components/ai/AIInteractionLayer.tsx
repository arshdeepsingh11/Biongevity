"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DEPARTMENTS } from "@/data/health";

/**
 * The "AI on every touch and scroll" layer:
 *  • cursor aura — soft iridescent light following the pointer (desktop)
 *  • neural tap ripple — every tap/click emits an iridescent pulse with sparks
 *  • scroll progress — iridescent bar under the header
 *  • reveal + scan — [data-reveal] blur-in, [data-scan] AI scan sweep on enter
 *  • calm mode — muted effects on Clinic and Mental Health pages
 */
export function AIInteractionLayer() {
  const path = usePathname();

  useEffect(() => {
    const calm = path.startsWith("/clinic") || DEPARTMENTS.some((d) => d.calm && path.includes(d.id));
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

  // Cursor aura + tap ripple + scroll progress
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { root.style.setProperty("--mx", `${e.clientX}px`); root.style.setProperty("--my", `${e.clientY}px`); });
    };
    const tap = (e: PointerEvent) => {
      if (reduced || root.classList.contains("fx-calm")) return;
      const r = document.createElement("span");
      r.className = "pointer-events-none fixed z-[200] rounded-full";
      Object.assign(r.style, { left: `${e.clientX}px`, top: `${e.clientY}px`, width: "8px", height: "8px", transform: "translate(-50%,-50%)", border: "1.5px solid rgba(155,107,255,.8)", boxShadow: "0 0 18px rgba(106,92,255,.5)" });
      document.body.appendChild(r);
      r.animate([{ width: "8px", height: "8px", opacity: 1 }, { width: "84px", height: "84px", opacity: 0 }], { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = () => r.remove();
      const cols = ["#FF8A3D", "#FF4D8D", "#9B6BFF", "#3D8BFF"];
      for (let i = 0; i < 6; i++) {
        const s = document.createElement("span"), a = (i / 6) * Math.PI * 2 + Math.random();
        s.className = "pointer-events-none fixed z-[200] rounded-full";
        Object.assign(s.style, { left: `${e.clientX}px`, top: `${e.clientY}px`, width: "4px", height: "4px", background: cols[i % 4] });
        document.body.appendChild(s);
        s.animate([{ transform: "translate(-50%,-50%)", opacity: 1 }, { transform: `translate(${Math.cos(a) * 34 - 2}px,${Math.sin(a) * 34 - 2}px)`, opacity: 0 }], { duration: 560, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = () => s.remove();
      }
    };
    const bar = document.getElementById("scroll-progress");
    const scroll = () => { if (bar) bar.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`; };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", tap, { passive: true });
    addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => { removeEventListener("pointermove", move); removeEventListener("pointerdown", tap); removeEventListener("scroll", scroll); };
  }, []);

  return (
    <>
      <div aria-hidden data-ai-fx className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
        style={{ background: "radial-gradient(600px circle at var(--mx) var(--my), rgba(155,107,255,.07), transparent 60%)" }} />
    </>
  );
}
