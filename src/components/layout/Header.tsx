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
function ExpandSearch({ open, setOpen, floating }: { open: boolean; setOpen: (o: boolean) => void; floating?: boolean }) {
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
      className={`relative flex h-9 items-center overflow-hidden rounded-full bg-white/90 ring-1 ring-ai/25 backdrop-blur-xl focus-within:ring-2 focus-within:ring-ai/50 hover:ring-ai/45 ${floating ? "shadow-lift" : ""}`}
      animate={{ width: open ? "min(420px, calc(100vw - 170px))" : 36 }} initial={false}>
      <button ref={trigger} type={open ? "submit" : "button"} onClick={() => !open && setOpen(true)} aria-label={open ? "Search" : "Open search (Ctrl X)"} aria-expanded={open} aria-controls="site-search"
        className="grid h-9 w-9 shrink-0 place-items-center text-ai">
        <motion.span animate={{ rotate: open ? 90 : 0, scale: open ? 0.9 : 1 }} transition={SPRING}><Icon name="search" size={17} weight="bold" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="f" className="flex min-w-0 flex-1 items-center gap-1 pr-1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.16 }}>
            <input id="site-search" ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tests, care, pages…" aria-label="Search Biongevity"
              className="h-9 min-w-0 flex-1 !border-0 !bg-transparent text-[13.5px] !shadow-none outline-none !ring-0 placeholder:text-faint focus-visible:!outline-none" />
            {q && <button type="button" onClick={() => { ask(q); setQ(""); setOpen(false); }} className="hidden h-7 shrink-0 items-center gap-1 rounded-full bg-ai-soft px-2 text-[11.5px] font-semibold text-ai sm:flex"><XevyoOrb size={14} />Ask SI</button>}
            <button type="button" onClick={close} aria-label="Close search" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint hover:bg-canvas hover:text-ink"><Icon name="x" size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

/** Top bar: brand, search, Ask Biongevity SI, theme switcher, Sign in (→ member app) and Book. Hides on scroll down — only the logo stays. */
export function Header() {
  const { openCmd } = useAI();
  const [search, setSearch] = useState(false);
  const hidden = useHideOnScroll(search);
  // section tab bars read this to sit right under the header, or move up when it hides
  useEffect(() => { document.documentElement.dataset.header = hidden ? "hidden" : "shown"; }, [hidden]);

  return (
    <>
      <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-[80] pt-[var(--safe-top)]">
        <motion.div className="site-bar pointer-events-auto border-b border-ink/[0.06] backdrop-blur-[22px] backdrop-saturate-[1.6]"
          style={{ background: "rgb(var(--c-pearl) / var(--header-alpha))" }}
          animate={hidden ? { y: -96, opacity: 0 } : { y: 0, opacity: 1 }} transition={SPRING} aria-hidden={hidden || undefined} inert={hidden}>
          <div className="site-inner mx-auto flex h-[60px] max-w-[1280px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
            <Link href="/" aria-label="Biongevity home" className="shrink-0"><Logo size={24} /></Link>
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <div className={`flex items-center gap-1.5 transition-opacity sm:gap-2 ${search ? "pointer-events-none opacity-0" : ""}`}>
              <button onClick={() => openCmd()} aria-label="Ask Biongevity SI (Ctrl X)"
                className="group flex h-9 items-center gap-2 rounded-full bg-white/80 pl-1 pr-1 text-[13px] text-muted ring-1 ring-ai/20 transition hover:text-ai hover:ring-ai/40 md:pr-3">
                <XevyoOrb size={28} />
                <span className="hidden md:inline">Ask SI</span>
                <kbd className="hidden rounded-md bg-canvas px-1.5 py-0.5 font-mono text-[10.5px] text-faint lg:inline">Ctrl X</kbd>
              </button>
              <ThemeSwitcher />
              <Link href="/login/" aria-label="Sign in" className="flex h-9 items-center gap-1.5 rounded-full bg-white/80 px-2.5 text-[13px] font-semibold ring-1 ring-ink/[0.08] hover:text-accent sm:px-3.5"><Icon name="user" size={15} /><span className="hidden sm:inline">Sign in</span></Link>
              <Link href="/contact/" className="flex h-9 items-center rounded-full bg-accent bg-btn-grad px-3 text-[13px] font-semibold text-on-accent shadow-[0_6px_18px_rgb(var(--c-accent)/.26)] hover:brightness-110 sm:px-3.5">Book<span className="hidden sm:inline">&nbsp;consult</span></Link>
              </div>
              <ExpandSearch open={search} setOpen={setSearch} />
            </div>
          </div>
        </motion.div>
      </header>

      {/* While the bar is away, only the logo floats (no background) and still goes home. */}
      <AnimatePresence>
        {hidden && (
          <motion.div key="float-logo" className="pointer-events-none fixed inset-x-0 top-0 z-[81] pt-[var(--safe-top)]" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING}>
            <div className="float-logo mx-auto flex h-[60px] max-w-[1280px] items-center px-3 sm:px-6">
              <Link href="/" aria-label="Biongevity home" className="pointer-events-auto rounded-xl p-1 drop-shadow-[0_2px_10px_rgb(255_255_255/.9)] transition-transform hover:scale-[1.04]"><Logo size={24} /></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
