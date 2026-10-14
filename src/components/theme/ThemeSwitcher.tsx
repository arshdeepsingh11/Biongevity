"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { THEMES } from "@/lib/theme";
import { useTheme } from "./ThemeProvider";
import { Icon } from "@/components/ui/Icon";

/** Header palette button → four theme swatches + "Match my device". The bottom navbar is not touched. */
export function ThemeSwitcher() {
  const { choice, theme, setChoice } = useTheme();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("pointerdown", off); addEventListener("keydown", esc);
    return () => { removeEventListener("pointerdown", off); removeEventListener("keydown", esc); };
  }, [open]);

  const current = THEMES.find((t) => t.id === theme)!;
  return (
    <div ref={box} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label={`Colour theme: ${current.label}`} aria-expanded={open} aria-haspopup="dialog"
        className="grid h-9 w-9 place-items-center rounded-full bg-white/80 ring-1 ring-ink/[0.08] transition hover:ring-accent/30">
        <span aria-hidden className="relative h-[18px] w-[18px] overflow-hidden rounded-full ring-1 ring-ink/15">
          <span className="absolute inset-y-0 left-0 w-1/2" style={{ background: current.swatch[1] }} />
          <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: current.swatch[0] }} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-label="Choose a colour theme" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute right-0 top-[calc(100%+10px)] z-[90] w-[264px] rounded-[22px] bg-white p-2 shadow-lift ring-1 ring-ink/[0.08]">
            <div className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Theme</div>
            {THEMES.map((t) => {
              const on = choice === t.id;
              return (
                <button key={t.id} onClick={() => { setChoice(t.id); setOpen(false); }} aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors ${on ? "bg-accent-light" : "hover:bg-ink/[0.04]"}`}>
                  <span aria-hidden className="flex h-8 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-ink/10">
                    {t.swatch.map((c, i) => <span key={i} className={i === 0 ? "w-1/2" : "w-1/4"} style={{ background: c }} />)}
                  </span>
                  <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold">{t.label}</span><span className="block text-[12px] text-muted">{t.note}</span></span>
                  {on && <Icon name="check" size={16} className="text-accent" />}
                </button>
              );
            })}
            <button onClick={() => { setChoice("auto"); setOpen(false); }} aria-pressed={choice === "auto"}
              className={`mt-1 flex w-full items-center gap-2 rounded-2xl border-t border-ink/[0.06] px-2.5 py-2.5 text-left text-[13px] ${choice === "auto" ? "font-semibold text-accent" : "text-muted hover:text-ink"}`}>
              <Icon name="laptop" size={16} />Match my device<span className="ml-auto text-[11px] text-faint">light / dark</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
