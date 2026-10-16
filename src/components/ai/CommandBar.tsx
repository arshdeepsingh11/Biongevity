"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { useCart } from "@/components/shop/CartProvider";
import { CATALOG, KIND_META } from "@/lib/catalog";
import { NAV } from "@/data/site";
import { useVoice } from "@/hooks/useVoice";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "./XevyoOrb";
import { formatMoney } from "@/lib/utils";

type Row = { id: string; label: string; sub: string; icon: string; group: string; text: string; run: () => void };

/**
 * Biongevity SI Command Bar — Ctrl/⌘ + X from anywhere.
 * Finds pages, departments, tests, formulas, packages and programs as you type;
 * the last row always hands the question to Biongevity SI. Search runs on-device; answers come from Biongevity SI.
 */
export function CommandBar() {
  const { cmd, closeCmd, ask, prompts, connected } = useAI();
  const cart = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const voice = useVoice((t, final) => { setQ(t); if (final) { ask(t); closeCmd(); } });

  useEffect(() => { if (cmd.open) { setQ(cmd.seed); setIdx(0); setTimeout(() => input.current?.focus(), 30); } }, [cmd.open, cmd.seed]);

  const index = useMemo<Row[]>(() => {
    const go = (href: string) => () => { closeCmd(); router.push(href); };
    const pages: Row[] = NAV.flatMap((n) => [
      ...(n.href ? [{ id: `p:${n.href}`, label: n.label, sub: "Page", icon: n.icon, group: "Pages", text: n.label, run: go(n.href) }] : []),
      ...(n.menu ?? []).map((m) => ({ id: `p:${m.href}`, label: m.label, sub: m.desc ?? m.group ?? n.label, icon: m.icon, group: m.group === "Specialty care" || m.group === "Precision programs" ? "Departments" : "Pages", text: `${m.label} ${m.desc ?? ""} ${n.label}`, run: go(m.href) })),
    ]);
    const items: Row[] = CATALOG.map((i) => ({
      id: i.id, label: i.title, sub: `${KIND_META[i.kind].label} · ${formatMoney(i.price)} CAD`, icon: i.icon, group: KIND_META[i.kind].label,
      text: `${i.title} ${i.summary} ${i.category} ${i.tags.join(" ")}`, run: () => { closeCmd(); cart.setView(i.id); },
    }));
    return [...pages, ...items];
  }, [cart, closeCmd, router]);

  const rows = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
    if (!words.length) return [];
    return index
      .map((r) => {
        const l = r.label.toLowerCase(), t = r.text.toLowerCase();
        if (!words.every((w) => t.includes(w))) return null;
        const score = (l.startsWith(words[0]) ? 3 : 0) + words.filter((w) => l.includes(w)).length * 2 + (r.group === "Pages" || r.group === "Departments" ? 1 : 0);
        return { r, score };
      })
      .filter((x): x is { r: Row; score: number } => Boolean(x))
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map((x) => x.r);
  }, [q, index]);

  const askRow: Row | null = q.trim() ? { id: "ask", label: `Ask Biongevity SI: “${q.trim()}”`, sub: connected ? "Answer from Biongevity's AI" : "Biongevity SI · not connected yet", icon: "sparkle", group: "AI", text: q, run: () => { ask(q); closeCmd(); } } : null;
  const suggested: Row[] = q.trim() ? [] : prompts.map((p) => ({ id: `s:${p}`, label: p, sub: "Suggested for this page", icon: "sparkle", group: "Ask Biongevity SI", text: p, run: () => { ask(p); closeCmd(); } }));
  const all = [...rows, ...(askRow ? [askRow] : []), ...suggested];
  const active = Math.min(idx, Math.max(all.length - 1, 0));

  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => (i + 1) % Math.max(all.length, 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => (i - 1 + all.length) % Math.max(all.length, 1)); }
    if (e.key === "Enter") { e.preventDefault(); all[active]?.run(); }
  };

  let lastGroup = "";
  return (
    <AnimatePresence>
      {cmd.open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCmd} className="fixed inset-0 z-[120] bg-scrim/30 backdrop-blur-[3px]" />
          <motion.div role="dialog" aria-label="Search or ask Biongevity SI" initial={{ opacity: 0, y: -14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-3 top-[calc(76px+var(--safe-top))] z-[121] mx-auto max-w-[640px] overflow-hidden rounded-[24px] bg-pearl/95 shadow-lift ring-1 ring-ai/25 backdrop-blur-2xl">
            <div aria-hidden className="scanline" />
            <div className="flex items-center gap-3 border-b border-ink/[0.06] px-4">
              <XevyoOrb size={30} live />
              <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setIdx(0); }} onKeyDown={key} placeholder="Search tests, departments, pages — or ask anything"
                aria-label="Search or ask Biongevity SI" className="h-[58px] min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-faint focus-visible:outline-none" />
              {voice.supported && (
                <button onClick={voice.toggle} aria-label={voice.listening ? "Stop listening" : "Ask by voice"} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${voice.listening ? "animate-pulse bg-accent text-white" : "bg-canvas text-accent hover:bg-accent-light"}`}>
                  <Icon name={voice.listening ? "stop" : "mic"} size={17} weight="duotone" />
                </button>
              )}
              <kbd className="hidden rounded-md bg-canvas px-1.5 py-0.5 font-mono text-[11px] text-muted sm:block">Esc</kbd>
            </div>
            <div className="max-h-[min(60vh,440px)] overflow-y-auto p-2">
              {q.trim() && !rows.length && <div className="px-3 py-2 text-[12.5px] text-muted">No matching page or product — Biongevity SI can still help.</div>}
              {all.map((r, i) => {
                const head = r.group !== lastGroup ? r.group : ""; lastGroup = r.group;
                return (
                  <div key={r.id}>
                    {head && <div className="hud-label px-3 pb-1 pt-2.5">{head}</div>}
                    <button onMouseEnter={() => setIdx(i)} onClick={r.run}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${i === active ? "bg-accent-light" : ""}`}>
                      {r.group === "AI" || r.group === "Ask Xevyo" ? <XevyoOrb size={36} /> : <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-canvas text-accent"><Icon name={r.icon} size={18} weight="duotone" /></span>}
                      <span className="min-w-0 flex-1"><span className="block truncate text-[14.5px] font-semibold">{r.label}</span><span className="block truncate text-[12px] text-muted">{r.sub}</span></span>
                      {i === active && <Icon name="arrow-right" size={15} className="text-accent" />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-ink/[0.06] px-4 py-2 text-[11px] text-faint">
              <span className="hidden items-center gap-3 sm:flex"><span>↑↓ move</span><span>↵ open</span><span>Ctrl X close</span></span>
              <span><span className="text-ai">✦</span> Search runs on your device · answers from Xevyo, with sources</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
