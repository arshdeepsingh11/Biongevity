"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CATALOG, KIND_META, type Kind } from "@/lib/catalog";
import { tokens } from "@/lib/intent";
import { useCart } from "./CartProvider";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";

const KINDS: (Kind | "all")[] = ["all", "program", "package", "test", "formula"];
const SORTS = { relevance: "Relevance", low: "Price: low to high", high: "Price: high to low" } as const;
const SHORTCUTS = [
  { label: "Executive check", q: "executive stress echo carotid ambulatory" },
  { label: "Women 40+", q: "hormone estradiol progesterone bone vitamin" },
  { label: "Heart family history", q: "heart crp pai lipid cardiology" },
  { label: "Parent 65+", q: "brain memory heart bone vitamin" },
  { label: "Gut & energy", q: "gut biogut energy glutathione" },
  { label: "Genome once, for life", q: "genome sequencing pharmacogenomics" },
];

/** One searchable catalogue for programs, packages, tests and formulas — add to plan without leaving the page. */
export function Catalogue() {
  const cart = useCart();
  const [kind, setKind] = useState<Kind | "all">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<keyof typeof SORTS>("relevance");
  const [more, setMore] = useState(false);
  // the concierge and the "shop by kind" tiles at the top of the page jump here with a kind or a search
  useEffect(() => {
    const on = (e: Event) => { const d = (e as CustomEvent<{ kind: Kind | "all"; q: string }>).detail; setKind(d.kind); setQ(d.q); setMore(false); };
    window.addEventListener("shop:browse", on);
    return () => window.removeEventListener("shop:browse", on);
  }, []);

  const list = useMemo(() => {
    const t = tokens(q);
    const scored = CATALOG.filter((i) => kind === "all" || i.kind === kind).map((i) => {
      const hay = `${i.title} ${i.summary} ${i.category} ${i.tags.join(" ")} ${(i.includes ?? []).join(" ")}`.toLowerCase();
      return { i, s: t.length ? t.reduce((a, w) => a + (hay.includes(w) ? 1 : 0), 0) : 1 };
    }).filter((x) => x.s > 0);
    if (sort === "low") scored.sort((a, b) => a.i.price - b.i.price);
    else if (sort === "high") scored.sort((a, b) => b.i.price - a.i.price);
    else scored.sort((a, b) => b.s - a.s || (a.i.kind === b.i.kind ? 0 : KINDS.indexOf(a.i.kind) - KINDS.indexOf(b.i.kind)));
    return scored.map((x) => x.i);
  }, [kind, q, sort]);
  const shown = more ? list : list.slice(0, 12);
  const count = (k: Kind | "all") => (k === "all" ? CATALOG.length : CATALOG.filter((i) => i.kind === k).length);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl bg-white px-4 shadow-card ring-1 ring-ink/[0.06] focus-within:ring-accent/40">
          <Icon name="search" size={18} className="text-faint" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setMore(false); }} placeholder="Search tests, formulas, packages, programs…" aria-label="Search the store" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search"><Icon name="x" size={15} className="text-faint" /></button>}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Sort" className="h-12 rounded-2xl bg-white px-4 text-[14px] shadow-card ring-1 ring-ink/[0.06]">
          {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {KINDS.map((k) => <button key={k} onClick={() => setKind(k)} className={`chip shrink-0 ${kind === k ? "border-transparent bg-accent text-white" : "border-ink/10 bg-white text-muted hover:text-ink"}`}>{k !== "all" && <Icon name={KIND_META[k].icon} size={15} weight="duotone" />}{k === "all" ? "Everything" : KIND_META[k].plural}<span className="opacity-70">{count(k)}</span></button>)}
        <span className="mx-1 hidden w-px self-stretch bg-ink/10 sm:block" />
        {SHORTCUTS.map((s) => <button key={s.label} onClick={() => { setQ(s.q); setKind("all"); }} className="chip shrink-0 border-accent/20 bg-accent-light text-accent"><Icon name="sparkle" size={14} weight="duotone" />{s.label}</button>)}
      </div>

      <motion.div layout className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((i) => {
          const inBag = cart.has(i.id);
          return (
            <motion.div layout key={i.id} className={`group flex flex-col rounded-[22px] bg-white p-4 ring-1 transition-shadow hover:shadow-card ${i.featured ? "ring-accent/40" : "ring-ink/[0.06]"}`}>
              <button onClick={() => cart.setView(i.id)} className="text-left">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 place-items-center icon-tile transition-colors group-hover:bg-iri group-hover:text-white"><Icon name={i.icon} size={22} weight="duotone" /></span>
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">{KIND_META[i.kind].label}</span>
                </div>
                <div className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug">{i.title}</div>
                <div className="mt-1 line-clamp-2 text-[12.5px] text-muted">{i.summary}</div>
              </button>
              <div className="flex-1" />
              <div className="mt-3 flex items-center justify-between border-t border-ink/[0.05] pt-3">
                <span><span className="text-[16px] font-semibold tabular-nums">{formatMoney(i.price)}</span><span className="ml-1 text-[11px] text-faint">{i.billing === "term" ? "/ 12 mo" : "CAD"}</span></span>
                <button onClick={() => (inBag ? cart.setOpen(true) : cart.add(i.id))} aria-label={inBag ? "In plan" : `Add ${i.title}`}
                  className={`flex h-9 items-center gap-1 rounded-full px-3 text-[12.5px] font-semibold transition-colors ${inBag ? "bg-teal-light text-teal" : "bg-accent text-white hover:bg-accent-deep"}`}>
                  <Icon name={inBag ? "check" : "plus"} size={14} weight="bold" />{inBag ? "Added" : "Add"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      {!list.length && <div className="mt-6 rounded-2xl bg-canvas p-8 text-center text-[14px] text-muted">Nothing matches “{q}”. Try Plan Studio above, or ask Biongevity SI.</div>}
      {list.length > 12 && <div className="mt-6 text-center"><button onClick={() => setMore((m) => !m)} className="btn-light">{more ? "Show less" : `Show all ${list.length}`}</button></div>}
    </div>
  );
}
