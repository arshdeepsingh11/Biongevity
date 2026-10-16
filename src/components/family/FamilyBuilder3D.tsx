"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CONDS } from "./FamilyTree";
import { LAB_TESTS } from "@/data/labs";
import { deptById } from "@/data/departments";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn } from "@/lib/utils";

type RelId = "gp-p" | "gp-m" | "parent" | "aunt-p" | "aunt-m" | "sibling" | "partner" | "cousin" | "child" | "grandchild";
const RELS: { id: RelId; label: string; gen: number; degree: 1 | 2 | 3; side?: "p" | "m" }[] = [
  { id: "gp-p", label: "Grandparent (father's side)", gen: -2, degree: 2, side: "p" },
  { id: "gp-m", label: "Grandparent (mother's side)", gen: -2, degree: 2, side: "m" },
  { id: "parent", label: "Parent", gen: -1, degree: 1 },
  { id: "aunt-p", label: "Aunt / uncle (father's side)", gen: -1, degree: 2, side: "p" },
  { id: "aunt-m", label: "Aunt / uncle (mother's side)", gen: -1, degree: 2, side: "m" },
  { id: "sibling", label: "Brother / sister", gen: 0, degree: 1 },
  { id: "partner", label: "Partner", gen: 0, degree: 3 },
  { id: "cousin", label: "Cousin", gen: 0, degree: 3 },
  { id: "child", label: "Child", gen: 1, degree: 1 },
  { id: "grandchild", label: "Grandchild", gen: 2, degree: 2 },
];
const GEN_LABEL: Record<number, string> = { [-2]: "Grandparents", [-1]: "Parents & their siblings", 0: "Your generation", 1: "Children", 2: "Grandchildren" };

interface M { id: string; rel: RelId; name: string; age: number; sex: "f" | "m"; alive: boolean; conds: string[]; onset?: number }
const uid = () => Math.random().toString(36).slice(2, 8);
const blank = (rel: RelId, i: number): M => {
  const r = RELS.find((x) => x.id === rel)!;
  const age = { [-2]: 80, [-1]: 56, 0: 38, 1: 12, 2: 3 }[r.gen] ?? 40;
  return { id: uid(), rel, name: "", age: age + ((i * 3) % 7), sex: i % 2 ? "m" : "f", alive: true, conds: [] };
};
/** Sensible order when someone asks for N members: closest relatives first, then up the tree. */
const ORDER: RelId[] = ["parent", "parent", "gp-p", "gp-p", "gp-m", "gp-m", "sibling", "partner", "child", "child", "aunt-p", "aunt-m", "sibling", "cousin", "grandchild", "child"];
const avatar = (m: { age: number; sex: "f" | "m" }) => (m.age < 3 ? "baby" : m.age < 18 ? "person" : m.sex === "f" ? "venus" : "mars");
const findTest = (k: string) => LAB_TESTS.find((t) => t.title.toLowerCase().startsWith(k.toLowerCase()));

/**
 * Family builder — say how many relatives, fill them in, and the tree grows live beside the form in 3D:
 * generations stand on tilted glass tiers, connections glow, and Biongevity SI reads the pattern on your device
 * (close relatives and early diagnoses weigh more). Nothing is stored or sent unless you ask SI.
 */
export function FamilyBuilder3D() {
  const { ask } = useAI();
  const [me, setMe] = useState({ name: "You", age: 45, sex: "f" as "f" | "m" });
  const [count, setCount] = useState(4);
  const [people, setPeople] = useState<M[]>(() => ORDER.slice(0, 4).map((r, i) => ({ ...blank(r, i), name: ["Mum", "Dad", "Grandpa", "Grandma"][i] ?? "", sex: (["f", "m", "m", "f"] as const)[i], age: [72, 75, 94, 90][i], alive: i < 2, conds: [["diabetes"], ["heart", "bp"], ["heart"], ["bones"]][i], onset: [58, 52, 60, 78][i] })));
  const [open, setOpen] = useState<string | null>(null);
  const [rot, setRot] = useState({ x: 16, y: -8 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  const setN = (n: number) => {
    const k = Math.max(1, Math.min(16, n)); setCount(k);
    setPeople((p) => (k > p.length ? [...p, ...ORDER.slice(p.length, k).map((r, i) => blank(r, p.length + i))] : p.slice(0, k)));
  };
  const upd = (id: string, patch: Partial<M>) => setPeople((p) => p.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  // Layout: generations as tiers, siblings side by side; father's side left, mother's side right.
  const tiers = useMemo(() => {
    const all = [...people.map((m) => ({ ...m, gen: RELS.find((r) => r.id === m.rel)!.gen, side: RELS.find((r) => r.id === m.rel)!.side })), { id: "me", rel: "me" as const, name: me.name || "You", age: me.age, sex: me.sex, alive: true, conds: [] as string[], gen: 0, side: undefined }];
    const rank = (x: (typeof all)[number]) => (x.side === "p" ? 0 : x.side === "m" ? 3 : x.rel === "me" ? 1.5 : x.rel === "partner" ? 2 : x.rel === "parent" ? (x.sex === "m" ? 1 : 2) : 1.6);
    return [-2, -1, 0, 1, 2].map((g) => ({ g, list: all.filter((x) => x.gen === g).sort((a, b) => rank(a) - rank(b)) })).filter((t) => t.list.length);
  }, [people, me]);
  const pos = useMemo(() => {
    const out: Record<string, { x: number; y: number }> = {}, n = tiers.length;
    tiers.forEach((t, ti) => t.list.forEach((m, i) => { out[m.id] = { x: ((i + 1) / (t.list.length + 1)) * 100, y: n === 1 ? 50 : 12 + (ti / (n - 1)) * 76 }; }));
    return out;
  }, [tiers]);
  const links = useMemo(() => {
    const L: [string, string, boolean][] = [], by = (rel: string) => people.filter((m) => m.rel === rel);
    const parents = by("parent"), dad = parents.find((m) => m.sex === "m") ?? parents[0], mum = parents.find((m) => m.sex === "f") ?? parents[1] ?? parents[0];
    const up = (kids: string[], ups: M[], hot = false) => ups.forEach((u) => kids.forEach((k) => L.push([u.id, k, hot])));
    up(["me", ...by("sibling").map((s) => s.id)], parents, true);
    if (dad) up([dad.id, ...by("aunt-p").map((a) => a.id)], by("gp-p")); else up(["me"], by("gp-p"));
    if (mum) up([mum.id, ...by("aunt-m").map((a) => a.id)], by("gp-m")); else up(["me"], by("gp-m"));
    up(by("cousin").map((c) => c.id), [...by("aunt-p"), ...by("aunt-m")].slice(0, 1));
    up(by("child").map((c) => c.id), [{ id: "me" } as M, ...by("partner")], true);
    up(by("grandchild").map((c) => c.id), by("child").slice(0, 1));
    by("partner").forEach((p) => L.push(["me", p.id, false]));
    return L;
  }, [people]);

  // SI pattern reading (on device): first-degree ×1, second ×0.5, early onset ×1.6
  const signals = useMemo(() => {
    const sc: Record<string, { s: number; who: string[] }> = {};
    for (const m of people) {
      const r = RELS.find((x) => x.id === m.rel)!; if (r.degree === 3) continue;
      for (const c of m.conds) {
        const early = !!m.onset && ((c === "heart" && m.onset < (m.sex === "m" ? 55 : 65)) || m.onset < 50);
        const w = (r.degree === 1 ? 1 : 0.5) * (early ? 1.6 : 1);
        sc[c] = sc[c] ?? { s: 0, who: [] }; sc[c].s += w; sc[c].who.push(`${m.name || r.label.toLowerCase()}${m.onset ? ` (at ${m.onset})` : ""}`);
      }
    }
    return Object.entries(sc).map(([id, v]) => ({ c: CONDS.find((x) => x.id === id)!, ...v })).filter((x) => x.c).sort((a, b) => b.s - a.s);
  }, [people]);
  const maxS = Math.max(1, ...signals.map((s) => s.s));
  const summary = () => people.map((m) => `${RELS.find((r) => r.id === m.rel)!.label}${m.name ? ` ${m.name}` : ""}, ${m.age}${m.alive ? "" : " (deceased)"}${m.conds.length ? `: ${m.conds.map((c) => CONDS.find((x) => x.id === c)?.label).join(", ")}${m.onset ? ` from age ${m.onset}` : ""}` : ""}`).join("; ");

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
      {/* ── Form ── */}
      <div className="space-y-3">
        <div className="rounded-[24px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
          <label className="text-[13px] font-semibold">How many family members do you want to add?</label>
          <div className="mt-2 flex items-center gap-2">
            <button onClick={() => setN(count - 1)} aria-label="Fewer" className="grid h-10 w-10 place-items-center rounded-full bg-canvas hover:bg-ai-soft"><Icon name="minus" size={16} /></button>
            <motion.span key={count} initial={{ scale: 1.3, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className="w-12 text-center text-[28px] font-semibold tabular-nums">{count}</motion.span>
            <button onClick={() => setN(count + 1)} aria-label="More" className="grid h-10 w-10 place-items-center rounded-full bg-canvas hover:bg-ai-soft"><Icon name="plus" size={16} /></button>
            <input type="range" min={1} max={16} value={count} onChange={(e) => setN(Number(e.target.value))} aria-label="Number of family members" className="ml-2 min-w-0 flex-1 accent-[rgb(var(--c-ai))]" />
          </div>
          <div className="mt-3 grid grid-cols-[1fr_70px_80px] gap-2">
            <input value={me.name} onChange={(e) => setMe({ ...me, name: e.target.value })} aria-label="Your name" placeholder="Your name" className="h-9 min-w-0 rounded-xl bg-canvas px-3 text-[13px] outline-none focus:ring-2 focus:ring-ai/30" />
            <input type="number" value={me.age} min={18} max={110} onChange={(e) => setMe({ ...me, age: Number(e.target.value) })} aria-label="Your age" className="h-9 min-w-0 rounded-xl bg-canvas px-2 text-[13px] outline-none" />
            <select value={me.sex} onChange={(e) => setMe({ ...me, sex: e.target.value as "f" | "m" })} aria-label="Your sex" className="h-9 min-w-0 rounded-xl bg-canvas px-2 text-[13px] outline-none"><option value="f">Female</option><option value="m">Male</option></select>
          </div>
        </div>

        <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {people.map((m, i) => {
              const on = open === m.id;
              return (
                <motion.div key={m.id} layout initial={{ opacity: 0, x: -16, height: 0 }} animate={{ opacity: 1, x: 0, height: "auto" }} exit={{ opacity: 0, x: -16, height: 0 }} className="overflow-hidden">
                  <div className={cn("rounded-[20px] bg-white p-3 ring-1 transition", on ? "ring-ai/40 shadow-card" : "ring-ink/[0.06]")}>
                    <div className="flex items-center gap-2">
                      <span className="icon-tile h-9 w-9"><Icon name={avatar(m)} size={16} /></span>
                      <select value={m.rel} onChange={(e) => upd(m.id, { rel: e.target.value as RelId })} aria-label={`Relation ${i + 1}`} className="h-8 min-w-0 flex-1 rounded-lg bg-canvas px-2 text-[12px] font-semibold outline-none">
                        {RELS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </select>
                      <button onClick={() => setOpen(on ? null : m.id)} aria-expanded={on} className="grid h-8 w-8 place-items-center rounded-full bg-canvas"><Icon name="chevron-down" size={14} className={on ? "rotate-180 transition" : "transition"} /></button>
                    </div>
                    <div className="mt-2 grid grid-cols-[1fr_58px_68px] gap-1.5">
                      <input value={m.name} onChange={(e) => upd(m.id, { name: e.target.value })} placeholder="Name" aria-label={`Name ${i + 1}`} className="h-8 min-w-0 rounded-lg bg-canvas px-2 text-[12.5px] outline-none focus:ring-2 focus:ring-ai/30" />
                      <input type="number" value={m.age} min={0} max={115} onChange={(e) => upd(m.id, { age: Number(e.target.value) })} aria-label={`Age ${i + 1}`} className="h-8 min-w-0 rounded-lg bg-canvas px-2 text-[12.5px] outline-none" />
                      <select value={m.sex} onChange={(e) => upd(m.id, { sex: e.target.value as "f" | "m" })} aria-label={`Sex ${i + 1}`} className="h-8 min-w-0 rounded-lg bg-canvas px-1 text-[12px] outline-none"><option value="f">Female</option><option value="m">Male</option></select>
                    </div>
                    <AnimatePresence>
                      {on && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-2 flex flex-wrap gap-1">
                            {CONDS.map((c) => { const has = m.conds.includes(c.id); return <button key={c.id} onClick={() => upd(m.id, { conds: has ? m.conds.filter((x) => x !== c.id) : [...m.conds, c.id] })} aria-pressed={has} className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1", has ? "bg-ai text-on-ai ring-ai" : "bg-white text-muted ring-ink/10")}>{c.label}</button>; })}
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-[12px]">
                            <label className="flex items-center gap-1.5"><input type="checkbox" checked={!m.alive} onChange={(e) => upd(m.id, { alive: !e.target.checked })} className="accent-[rgb(var(--c-ai))]" />Passed away</label>
                            {m.conds.length > 0 && <label className="flex items-center gap-1.5">First diagnosed at <input type="number" value={m.onset ?? ""} min={1} max={110} onChange={(e) => upd(m.id, { onset: e.target.value ? Number(e.target.value) : undefined })} className="h-7 w-14 rounded-lg bg-canvas px-2 outline-none" /></label>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Live 3D tree ── */}
      <div className="space-y-3">
        <div className="relative h-[560px] select-none overflow-hidden rounded-[32px] bg-white ring-1 ring-ink/[0.07]" style={{ perspective: "1400px" }}
          onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture?.(e.pointerId); }}
          onPointerMove={(e) => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; drag.current = { x: e.clientX, y: e.clientY }; setRot((r) => ({ x: Math.max(0, Math.min(40, r.x - dy * 0.15)), y: Math.max(-35, Math.min(35, r.y + dx * 0.2)) })); }}
          onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}>
          <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 40%, rgb(var(--c-ai-hi) / .14), transparent 70%)" }} />
          <div className="absolute left-3 top-3 z-10 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ai ring-1 ring-ink/[0.06] backdrop-blur">Live family tree · drag to tilt</div>
          <div className="absolute inset-[4%] transition-transform duration-300 ease-out" style={{ transformStyle: "preserve-3d", transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
            {/* tiers */}
            {tiers.map((t, ti) => {
              const y = tiers.length === 1 ? 50 : 12 + (ti / (tiers.length - 1)) * 76;
              return (
                <div key={t.g} className="absolute inset-x-0 h-[17%] rounded-[28px] ring-1 ring-white/70 transition-[top] duration-500"
                  style={{ top: `${y}%`, transform: `translateY(-50%) translateZ(${-t.g * 40}px)`, background: "linear-gradient(180deg, rgb(255 255 255 / .55), rgb(var(--c-ai-soft) / .35))", boxShadow: "0 20px 40px -24px rgb(var(--c-ai-2) / .45)" }}>
                  <span className="absolute left-3 top-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ai/70">{GEN_LABEL[t.g]}</span>
                </div>
              );
            })}
            {/* connectors */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ transform: "translateZ(6px)" }}>
              {links.map(([a, b, hot], i) => { const A = pos[a], B = pos[b]; if (!A || !B) return null; const my = (A.y + B.y) / 2; const d = `M${A.x},${A.y} C${A.x},${my} ${B.x},${my} ${B.x},${B.y}`; return (
                <g key={`${a}-${b}-${i}`}>
                  <path d={d} fill="none" stroke={`rgb(var(--c-ai) / ${hot ? 0.35 : 0.18})`} strokeWidth={hot ? 0.5 : 0.3} vectorEffect="non-scaling-stroke" style={{ strokeWidth: hot ? 2 : 1.2 }} />
                  <path d={d} fill="none" stroke="rgb(var(--c-ai-hi))" strokeDasharray="4 30" className="beam-dash" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2, animationDelay: `${i * -0.3}s` }} />
                </g>); })}
            </svg>
            {/* people */}
            <AnimatePresence>
              {tiers.flatMap((t) => t.list).map((m) => {
                const p = pos[m.id]; if (!p) return null;
                const isMe = m.id === "me", risk = !isMe && m.conds.length > 0;
                return (
                  <div key={m.id} className="absolute transition-[left,top] duration-500 ease-out" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -50%) translateZ(${isMe ? 70 : 40}px)`, transformStyle: "preserve-3d" }}>
                  <motion.button onClick={() => !isMe && setOpen(m.id)} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="flex flex-col items-center" aria-label={`${m.name || "Relative"}, ${m.age}`}>
                    <span className={cn("relative grid place-items-center rounded-[18px] shadow-lift ring-1 backdrop-blur-xl", isMe ? "h-14 w-14 bg-ai text-on-ai ring-ai" : "h-12 w-12 bg-white/90 text-ai ring-white", !m.alive && "opacity-60 grayscale", open === m.id && "ring-2 ring-ai")}>
                      <Icon name={avatar(m)} size={isMe ? 24 : 20} />
                      {risk && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-warn px-1 text-[10px] font-bold text-white">{m.conds.length}</span>}
                      {isMe && <span className="absolute -inset-1.5 animate-ping rounded-[22px] ring-2 ring-ai/30" />}
                    </span>
                    <span className="mt-1 max-w-[110px] truncate rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold shadow-card">{m.name || RELS.find((r) => r.id === m.rel)?.label.split(" (")[0]}{!m.alive && " †"}</span>
                    <span className="text-[10px] text-muted">{m.age} yrs</span>
                  </motion.button>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* SI reading */}
        <div className="rounded-[24px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[13px] font-semibold"><XevyoOrb size={22} live />SI reads your family pattern</div>
            <button onClick={() => ask(`Here is my family health history: ${summary()}. I am ${me.age}, ${me.sex === "f" ? "female" : "male"}. What does this pattern mean for me and my children, which checks matter first, and when should they start?`, { label: "✦ My family pattern" })} className="btn-ai h-8 px-3 text-[12px]"><XevyoOrb size={14} />Ask SI to explain</button>
          </div>
          {signals.length ? (
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {signals.slice(0, 4).map(({ c, s, who }) => { const d = deptById(c.dept), t = findTest(c.tests[0]); return (
                <div key={c.id} className="rounded-2xl bg-canvas p-3">
                  <div className="flex items-center gap-2"><Icon name={c.icon} size={15} className="text-ai" /><span className="text-[13.5px] font-semibold">{c.label}</span><span className="ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-white"><motion.span className="block h-full bg-ai" animate={{ width: `${(s / maxS) * 100}%` }} /></span></div>
                  <p className="mt-1 text-[11.5px] text-muted">From {who.join(", ")}.</p>
                  <p className="mt-1 text-[12px]"><b>Ask about:</b> {c.clinic}.</p>
                  <div className="mt-1.5 flex flex-wrap gap-1"><Link href={`/precision-health/${d.id}/`} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ai ring-1 ring-ai/15">{d.short}</Link>{t && <a href={t.url} target="_blank" rel="noopener" className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold ring-1 ring-ink/10">{t.title.replace(/ \(.*\)/, "")}</a>}</div>
                </div>); })}
            </div>
          ) : <p className="mt-2 text-[12.5px] text-muted">Open a relative and tap any conditions you know about — the reading updates as you type.</p>}
          <p className="mt-2 text-[10.5px] text-faint">The starting family is an example — change or replace it. Weighed on your device: parents, siblings and children count fully, grandparents and aunts/uncles half; early diagnoses count more. Education, not a diagnosis.</p>
        </div>
      </div>
    </div>
  );
}
