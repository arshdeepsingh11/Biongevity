"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GOAL_PATHS } from "@/data/intelligence";
import { HEALTH_PACKAGES } from "@/data/labs";
import { CATALOG, KIND_META, type ShopItem } from "@/lib/catalog";
import { matchIntent } from "@/lib/intent";
import { useCart } from "./CartProvider";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";

type Depth = "essentials" | "complete" | "program";
const DEPTHS: { id: Depth; label: string; sub: string }[] = [
  { id: "essentials", label: "Essentials", sub: "Test + formula" },
  { id: "complete", label: "Complete", sub: "+ clinic package" },
  { id: "program", label: "Full program", sub: "+ longevity program" },
];
const byTitle = (kind: ShopItem["kind"], title: string) => CATALOG.find((i) => i.kind === kind && i.title === title);
const byHandle = (kind: ShopItem["kind"], h: string) => CATALOG.find((i) => i.kind === kind && i.handle === h);

/**
 * Plan Studio — a live plan configurator (no questionnaire).
 * Pick goals or describe them, set depth and budget; the board assembles a plan from the real catalogue.
 * Swap any slot, then add the whole plan to the bag in one tap.
 */
export function PlanStudio() {
  const cart = useCart();
  const { ask } = useAI();
  const [goals, setGoals] = useState<string[]>(["heart"]);
  const [text, setText] = useState("");
  const [depth, setDepth] = useState<Depth>("complete");
  const [budget, setBudget] = useState(1500);
  const [swap, setSwap] = useState<Record<string, number>>({});
  const [off, setOff] = useState<string[]>([]);
  const intent = useMemo(() => matchIntent(text), [text]);

  const slots = useMemo(() => {
    const gp = GOAL_PATHS.filter((g) => goals.includes(g.id));
    if (intent?.goal && !gp.some((g) => g.id === intent.goal!.id)) gp.push(intent.goal);
    const tests = [...new Map([...gp.map((g) => byTitle("test", g.test)), ...(intent?.tests ?? []).map((t) => byHandle("test", t.x.handle))].filter(Boolean).map((t) => [t!.id, t!])).values()];
    const formulas = [...new Map([...gp.map((g) => byHandle("formula", g.formula)), ...(intent?.formulas ?? []).map((f) => byHandle("formula", f.x.handle))].filter(Boolean).map((f) => [f!.id, f!])).values()];
    const pkgTitle = gp.map((g) => g.program).find((p) => HEALTH_PACKAGES.some((h) => h.t === p));
    const packages = CATALOG.filter((i) => i.kind === "package").sort((a, b) => (a.title === pkgTitle ? -1 : b.title === pkgTitle ? 1 : a.price - b.price));
    const programs = CATALOG.filter((i) => i.kind === "program").sort((a, b) => (a.price <= budget * 0.6 ? b.price - a.price : a.price - b.price));
    const pick = (key: string, list: ShopItem[]) => (list.length ? list[(swap[key] ?? 0) % list.length] : undefined);
    const out: { key: string; role: string; why: string; item?: ShopItem; alts: number }[] = [];
    tests.slice(0, 3).forEach((t, i) => out.push({ key: `t${i}`, role: "Measure", why: gp[i]?.reveals ?? "Matched to what you described.", item: pick(`t${i}`, [t, ...CATALOG.filter((x) => x.kind === "test" && x.category === t.category && x.id !== t.id)]), alts: 1 + CATALOG.filter((x) => x.kind === "test" && x.category === t.category && x.id !== t.id).length }));
    formulas.slice(0, 2).forEach((f, i) => out.push({ key: `f${i}`, role: "Support", why: "Transparent formula aligned with your goal.", item: pick(`f${i}`, [f, ...CATALOG.filter((x) => x.kind === "formula" && x.id !== f.id)]), alts: CATALOG.filter((x) => x.kind === "formula").length }));
    if (depth !== "essentials") out.push({ key: "pkg", role: "Clinic", why: "Clinic visit, imaging and advanced labs in one booking.", item: pick("pkg", packages), alts: packages.length });
    if (depth === "program") out.push({ key: "prog", role: "Program", why: "Diagnostics, AI coach, app and bioactives over 3, 6 or 12 months.", item: pick("prog", programs), alts: programs.length });
    return out;
  }, [goals, intent, depth, swap, budget]);

  const active = slots.filter((s) => s.item && !off.includes(s.key));
  const total = active.reduce((a, s) => a + s.item!.price, 0);
  const pct = Math.min(100, (total / budget) * 100);
  const toggleGoal = (id: string) => setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : g.length >= 3 ? [...g.slice(1), id] : [...g, id]));
  const addAll = () => { active.forEach((s) => cart.add(s.item!.id)); cart.setOpen(true); };

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
      {/* Controls */}
      <div className="hud space-y-5 rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
        <div>
          <div className="hud-label">1 · Your goals (up to 3)</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {GOAL_PATHS.map((g) => { const on = goals.includes(g.id); return (
              <button key={g.id} onClick={() => toggleGoal(g.id)} aria-pressed={on} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-all ${on ? "bg-accent text-white shadow-glow" : "bg-canvas text-ink hover:bg-accent-light"}`}>
                <Icon name={g.icon} size={18} weight="duotone" className={on ? "text-white" : "text-accent"} />{g.label}
              </button>
            ); })}
          </div>
        </div>
        <div>
          <div className="hud-label">2 · Or describe it</div>
          <div className="mt-2 flex h-11 items-center gap-2 rounded-xl bg-canvas px-3 ring-1 ring-ink/[0.05] focus-within:ring-accent/40">
            <Icon name="sparkle" size={17} weight="duotone" className="text-accent" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. bloating and low energy" aria-label="Describe your goal" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
          </div>
          {intent && <div className="mt-1.5 text-[11.5px] text-muted">AI read {intent.t.length} signals{intent.goal ? ` · closest goal: ${intent.goal.label}` : ""}</div>}
        </div>
        <div>
          <div className="hud-label">3 · Depth</div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-2xl bg-canvas p-1">
            {DEPTHS.map((d) => <button key={d.id} onClick={() => setDepth(d.id)} className={`rounded-xl px-2 py-2 text-center ${depth === d.id ? "bg-white shadow-card" : ""}`}><span className={`block text-[12.5px] font-semibold ${depth === d.id ? "text-accent" : "text-ink"}`}>{d.label}</span><span className="block text-[10.5px] text-muted">{d.sub}</span></button>)}
          </div>
        </div>
        <label className="block">
          <span className="flex items-baseline justify-between"><span className="hud-label">4 · Budget</span><span className="font-mono text-[13px] text-accent">{formatMoney(budget)} CAD</span></span>
          <input type="range" min={150} max={4000} step={50} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="mt-2 w-full accent-accent" aria-label="Budget" />
        </label>
      </div>

      {/* Board */}
      <div className="hud relative overflow-hidden rounded-[28px] bg-white/85 p-4 shadow-card ring-1 ring-ink/[0.06] backdrop-blur sm:p-6">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><div className="hud-label flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-teal" />Your plan · live</div><div className="mt-1 text-[22px] font-semibold tracking-tight">{active.length} items, built from our catalogue</div></div>
            <div className="text-right"><div className="text-[28px] font-semibold tabular-nums">{formatMoney(total)}</div><div className="text-[12px] text-muted">CAD · {total <= budget ? "within budget" : `${formatMoney(total - budget)} over budget`}</div></div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/[0.07]"><motion.div className={`h-full rounded-full ${total <= budget ? "bg-iri-x" : "bg-tangerine"}`} animate={{ width: `${pct}%` }} /></div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {slots.map((s) => {
                if (!s.item) return null;
                const disabled = off.includes(s.key), it = s.item;
                return (
                  <motion.div key={s.key + it.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: disabled ? 0.45 : 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                    className={`rounded-2xl bg-white p-4 ring-1 ${disabled ? "ring-ink/[0.05]" : "ring-accent/20"}`}>
                    <div className="flex items-center justify-between"><span className="hud-label">{s.role} · {KIND_META[it.kind].label}</span>
                      <button onClick={() => setOff((o) => (o.includes(s.key) ? o.filter((x) => x !== s.key) : [...o, s.key]))} aria-label={disabled ? "Include" : "Exclude"} className={`relative h-5 w-9 rounded-full ${disabled ? "bg-ink/15" : "bg-accent"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${disabled ? "left-0.5" : "left-[18px]"}`} /></button>
                    </div>
                    <button onClick={() => cart.setView(it.id)} className="mt-2 flex w-full items-start gap-3 text-left">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-iri text-white"><Icon name={it.icon} size={22} weight="duotone" /></span>
                      <span className="min-w-0 flex-1"><span className="block text-[14.5px] font-semibold leading-snug">{it.title}</span><span className="mt-0.5 line-clamp-2 block text-[12px] text-muted">{s.why}</span></span>
                      <span className="text-[14.5px] font-semibold tabular-nums">{formatMoney(it.price)}</span>
                    </button>
                    {s.alts > 1 && <button onClick={() => setSwap((w) => ({ ...w, [s.key]: (w[s.key] ?? 0) + 1 }))} className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-accent"><Icon name="reset" size={13} />Swap ({s.alts} options)</button>}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {!slots.length && <div className="mt-6 rounded-2xl bg-canvas p-8 text-center text-[14px] text-muted">Choose a goal or describe one to start your plan.</div>}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={addAll} disabled={!active.length} className="btn-dark disabled:opacity-40"><Icon name="bag" size={16} weight="duotone" />Add plan to bag</button>
            <button onClick={() => ask(`Review my plan: ${active.map((s) => s.item!.title).join(", ")}. Goals: ${goals.join(", ")}${text ? `; I said: "${text}"` : ""}. Budget ${budget} CAD. Is this the right order to start?`)} className="btn-light"><Icon name="sparkle" size={16} weight="duotone" className="text-accent" />Ask Xevyo to review</button>
            <span className="text-[11.5px] text-faint">Built on your device from our catalogue. Education, not diagnosis.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
