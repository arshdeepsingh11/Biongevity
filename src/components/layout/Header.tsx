"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

/** Scroll direction: hidden while the reader scrolls down, back as soon as they scroll up (or reach the top). */
function useHideOnScroll(lock: boolean) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY, d = y - last.current;
        if (y < 90) setHidden(false);
        else if (d > 6) setHidden(true);
        else if (d < -6) setHidden(false);
        last.current = y;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return hidden && !lock;
}

/** Expandable search: an icon that grows into a field with a spring, focuses itself, and gives focus back on close. */
function ExpandSearch({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const { openCmd, ask } = useAI();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLFormElement>(null);

  useEffect(() => { if (open) { const t = setTimeout(() => input.current?.focus(), 60); return () => clearTimeout(t); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node) && !q) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open, q, setOpen]);

  const close = () => { setOpen(false); setQ(""); requestAnimationFrame(() => trigger.current?.focus()); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!q.trim()) return; openCmd(q.trim()); setOpen(false); setQ(""); };

  return (
    <motion.form ref={wrap} role="search" onSubmit={submit} layout transition={SPRING}
      onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); close(); } }}
      className="relative flex h-9 items-center overflow-hidden rounded-full bg-white/80 ring-1 ring-ai/20 hover:ring-ai/40"
      animate={{ width: open ? "min(360px, calc(100vw - 110px))" : 36 }} initial={false}>
      <button ref={trigger} type={open ? "submit" : "button"} onClick={() => !open && setOpen(true)} aria-label={open ? "Search" : "Open search (Ctrl X)"} aria-expanded={open} aria-controls="site-search"
        className="grid h-9 w-9 shrink-0 place-items-center text-ai">
        <motion.span animate={{ rotate: open ? 90 : 0, scale: open ? 0.9 : 1 }} transition={SPRING}><Icon name="search" size={17} weight="bold" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="f" className="flex min-w-0 flex-1 items-center gap-1 pr-1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.16 }}>
            <input id="site-search" ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tests, care, pages…" aria-label="Search Biongevity"
              className="h-9 min-w-0 flex-1 !border-0 !bg-transparent text-[13.5px] !shadow-none outline-none !ring-0 placeholder:text-faint" />
            {q && <button type="button" onClick={() => { ask(q); setQ(""); setOpen(false); }} className="hidden h-7 shrink-0 items-center gap-1 rounded-full bg-ai-soft px-2 text-[11.5px] font-semibold text-ai sm:flex"><XevyoOrb size={14} />Ask SI</button>}
            <button type="button" onClick={close} aria-label="Close search" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint hover:bg-canvas hover:text-ink"><Icon name="x" size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
