"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATALOG, KIND_META, type Kind, type ShopItem } from "@/lib/catalog";
import { tokens } from "@/lib/intent";
import { useCart } from "./CartProvider";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn, formatMoney } from "@/lib/utils";

/** Goal chips — each expands into the words the on-device matcher looks for. */
const GOALS = [
  { label: "Heart", icon: "heart", q: "heart crp lipid cardiology cholesterol" },
  { label: "Energy", icon: "bolt", q: "energy fatigue thyroid vitamin cortisol nad glutathione" },
  { label: "Ageing well", icon: "hourglass", q: "aging longevity telomere epigenetic" },
  { label: "Hormones", icon: "flask", q: "hormone testosterone estradiol thyroid" },
  { label: "Gut", icon: "gut", q: "gut microbiome biogut digestion" },
  { label: "Sleep & stress", icon: "moon", q: "sleep stress cortisol calm" },
  { label: "Brain", icon: "brain", q: "brain memory cognitive focus" },
  { label: "My DNA", icon: "dna", q: "genome genetic sequencing pharmacogenomics" },
];

/** Tells the catalogue further down to show a kind (or a search) and scrolls to it. */
export const browse = (kind: Kind | "all", q = "") => {
  window.dispatchEvent(new CustomEvent("shop:browse", { detail: { kind, q } }));
  document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Everyday words → the goal they usually mean, so "I'm always tired" finds energy, not random text matches. */
const MEANS: [RegExp, string][] = [
  [/tired|fatigu|exhaust|energy|sluggish|drained/, "Energy"], [/sleep|insomnia|stress|anxi|burnout|calm/, "Sleep & stress"],
  [/heart|cholesterol|blood pressure|cardio|chest/, "Heart"], [/memory|focus|brain|fog|forget|concentrat/, "Brain"],
  [/gut|bloat|digest|stomach|ibs|constipat/, "Gut"], [/hormon|menopaus|testosterone|libido|thyroid|period/, "Hormones"],
  [/aging|ageing|older|longevity|wrinkle|age well|live longer/, "Ageing well"], [/dna|gene|genetic|family history|inherit/, "My DNA"],
];
const FILLER = new Set(["feel", "feeling", "time", "always", "want", "more", "better", "really", "like", "make", "need", "help", "very", "much", "lot", "lately", "every", "days"]);
const expand = (q: string) => {
  const lower = q.toLowerCase(), extra = MEANS.filter(([r]) => r.test(lower)).map(([, g]) => GOALS.find((x) => x.label === g)!.q);
  return [...lower.split(/\s+/).filter((w) => !FILLER.has(w)), ...extra].join(" ");
};

const hay = (i: ShopItem) => `${i.title} ${i.summary} ${i.category} ${i.tags.join(" ")} ${(i.includes ?? []).join(" ")}`.toLowerCase();

/** One pick per kind first (test → formula → package → program), so the answer reads like a plan, not a list. */
function pick(q: string) {
  const t = tokens(expand(q));
  if (!t.length) return { t, items: CATALOG.filter((i) => i.featured || i.kind === "package").slice(0, 4), hits: new Map<string, string[]>() };
  const hits = new Map<string, string[]>();
  const ranked = CATALOG.map((i) => {
    const h = hay(i), w = t.filter((x) => new RegExp(`\\b${x.replace(/[^a-z0-9-]/g, "")}`).test(h));
    hits.set(i.id, w);
    return { i, s: w.reduce((a, x) => a + (x.length > 5 ? 2 : 1), 0) };
  }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s || a.i.price - b.i.price);
  const out: ShopItem[] = [];
  for (const k of ["test", "formula", "package", "program"] as Kind[]) { const r = ranked.find((x) => x.i.kind === k); if (r) out.push(r.i); }
  for (const r of ranked) if (out.length < 3 && !out.includes(r.i)) out.push(r.i);
  return { t, items: out.slice(0, 4), hits };
}

/**
 * Shop concierge — the first thing on the shop page. Say a goal (or tap one); the matcher on this device picks a
 * test, a formula, a package and a program from the real catalogue, with the words that matched. Add in one tap,
 * or send them to Biongevity SI to explain. Nothing here is invented: every card is a real product and price.
 */
export function ShopConcierge() {
  const cart = useCart();
  const { ask } = useAI();
  const [q, setQ] = useState("");
  const [goal, setGoal] = useState<string | null>(null);
  const query = goal ? GOALS.find((g) => g.label === goal)!.q : q;
  const { t, items, hits } = useMemo(() => pick(query), [query]);
  const active = t.length > 0;

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white/70 p-4 shadow-[0_30px_80px_-40px_rgb(var(--c-ink)/.35)] ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ai/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <form onSubmit={(e) => { e.preventDefault(); setGoal(null); }} className="relative flex h-14 items-center gap-3 rounded-2xl bg-white px-3 shadow-card ring-1 ring-ink/[0.06] focus-within:ring-2 focus-within:ring-ai/40">
        <XevyoOrb size={30} />
        <input value={goal ? "" : q} onChange={(e) => { setQ(e.target.value); setGoal(null); }} placeholder={goal ? `Showing: ${goal}` : "What do you want to improve?"} aria-label="What do you want to improve"
          className="h-full min-w-0 flex-1 !border-0 !bg-transparent text-[16px] !shadow-none outline-none !ring-0 placeholder:text-faint focus-visible:!outline-none" />
        {(q || goal) && <button type="button" onClick={() => { setQ(""); setGoal(null); }} aria-label="Clear" className="grid h-8 w-8 place-items-center rounded-full text-faint hover:bg-canvas hover:text-ink"><Icon name="x" size={14} /></button>}
      </form>

      <div className="no-scrollbar relative -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {GOALS.map((g) => (
          <button key={g.label} onClick={() => { setGoal(goal === g.label ? null : g.label); setQ(""); }} aria-pressed={goal === g.label}
            className={cn("flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ring-1 transition", goal === g.label ? "bg-ai text-on-ai ring-ai" : "bg-white/80 text-ink/80 ring-ink/[0.07] hover:ring-ai/40")}>
            <Icon name={g.icon} size={14} />{g.label}
          </button>
        ))}
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ai">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-ai" /></span>
          {active ? `${items.length} picks for “${goal ?? q}”` : "Popular starting points"}
        </div>
        {active && items.length > 0 && <button onClick={() => browse("all", query)} className="text-[12.5px] font-semibold text-ai hover:underline">See all matches →</button>}
      </div>

      <div className="no-scrollbar relative -mx-4 mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((i, k) => {
            const inBag = cart.has(i.id), why = hits.get(i.id) ?? [];
            return (
              <motion.div key={i.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.28, delay: k * 0.05 }}
                className="flex w-[78%] shrink-0 snap-start flex-col rounded-[22px] bg-white/90 p-4 ring-1 sm:w-auto ring-ink/[0.06] backdrop-blur">
                <button onClick={() => cart.setView(i.id)} className="text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="icon-tile h-10 w-10"><Icon name={i.icon} size={19} weight="duotone" /></span>
                    <span className="rounded-full bg-ai-soft px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-ai">{KIND_META[i.kind].label}</span>
                  </div>
                  <div className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug">{i.title}</div>
                  <div className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">{i.summary}</div>
                </button>
                {why.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{why.slice(0, 3).map((w) => <span key={w} className="rounded-full bg-canvas px-1.5 py-px text-[10.5px] font-medium text-muted">matches “{w}”</span>)}</div>}
                <div className="flex-1" />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[16px] font-semibold tabular-nums">{formatMoney(i.price)}<span className="ml-1 text-[11px] font-normal text-faint">{i.billing === "term" ? "/ 12 mo" : "CAD"}</span></span>
                  <button onClick={() => (inBag ? cart.setOpen(true) : cart.add(i.id))} className={cn("flex h-9 items-center gap-1 rounded-full px-3.5 text-[12.5px] font-semibold transition", inBag ? "bg-ai-soft text-ai" : "bg-accent text-on-accent hover:brightness-110")}>
                    <Icon name={inBag ? "check" : "plus"} size={13} weight="bold" />{inBag ? "In plan" : "Add"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {active && !items.length && <div className="col-span-full rounded-2xl bg-white/80 p-5 text-center text-[14px] text-muted">Nothing in the catalogue matches that yet — ask Biongevity SI, or try a goal above.</div>}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.06] pt-4">
        <p className="text-[12px] text-faint">Matched on your device from our real catalogue. Not a diagnosis — a clinician confirms every plan.</p>
        <button onClick={() => ask(active ? `I want to work on: ${goal ?? q}. You suggested ${items.map((i) => `${i.title} (${KIND_META[i.kind].label}, ${formatMoney(i.price)} CAD)`).join("; ")}. Explain in plain words what each does and which to start with.` : "Help me choose where to start in the Biongevity shop: a single test, a package or a full program?", { label: "✦ Shop help" })}
          className="btn-ai h-10 px-4 text-[13px]"><XevyoOrb size={18} />{active ? "Ask SI to explain these" : "Not sure? Ask SI"}</button>
      </div>
    </div>
  );
}

/** Four doors into the store — tap one to see just that kind below. */
export function ShopKinds() {
  const kinds: Kind[] = ["test", "formula", "package", "program"];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kinds.map((k) => {
        const list = CATALOG.filter((i) => i.kind === k), lo = Math.min(...list.map((i) => i.price));
        return (
          <button key={k} onClick={() => browse(k)} className="group relative overflow-hidden rounded-[26px] bg-white/75 p-4 text-left ring-1 ring-ink/[0.06] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-card hover:ring-ai/30 sm:p-5">
            <span aria-hidden className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-ai/10 blur-2xl transition-opacity group-hover:opacity-100 sm:opacity-60" />
            <span className="icon-tile relative h-11 w-11"><Icon name={KIND_META[k].icon} size={21} weight="duotone" /></span>
            <div className="relative mt-4 text-[16px] font-semibold leading-tight sm:text-[18px]">{KIND_META[k].plural}</div>
            <p className="relative mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">{KIND_META[k].blurb}</p>
            <div className="relative mt-3 flex items-center justify-between text-[12px]">
              <span className="text-muted"><b className="font-semibold text-ink">{list.length}</b> · from {formatMoney(lo)}</span>
              <Icon name="arrow-right" size={15} className="text-ai transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
