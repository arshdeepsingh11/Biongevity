"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAI } from "@/components/ai/AIProvider";
import { useCart } from "@/components/commerce/CartProvider";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { fireConfetti } from "@/components/fx/Confetti";
import { Icon } from "@/components/ui/Icon";
import { GOALS, buildProtocol } from "@/data/drugs";
import { formatMoney } from "@/lib/utils";
import type { CatalogProduct } from "@/data/types";

const ROUTINE = [
  { key: "train" as const, label: "Training days per week", opts: ["0–1 days", "2–3 days", "4+ days"] },
  { key: "sleep" as const, label: "Sleep quality", opts: ["Poor", "Fair", "Good"] },
];

/** BioAro Drugs AI protocol builder — goals + routine → starting protocol → add all to bag. */
export function ProtocolBuilder({ preset }: { preset?: string[] }) {
  const { explain } = useAI();
  const { addMany } = useCart();
  const [text, setText] = useState("");
  const [goals, setGoals] = useState<string[]>(["energy"]);
  const [routine, setRoutine] = useState({ train: "2–3 days", sleep: "Fair" });
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ items: CatalogProduct[]; note: string; live: boolean } | null>(null);
  useEffect(() => { if (preset?.length) { setGoals(preset); setRes(null); document.getElementById("builder")?.scrollIntoView({ behavior: "smooth", block: "center" }); } }, [preset]);

  const toggle = (id: string) => setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  const run = async () => {
    // free-text → goals (simple keyword mapping)
    const t = text.toLowerCase(), g = new Set(goals);
    if (/focus|clarity|brain|concentr/.test(t)) g.add("focus");
    if (/energy|tired|fatigue/.test(t)) g.add("energy");
    if (/sleep|insomnia|rest/.test(t)) g.add("sleep");
    if (/train|gym|strength|perform/.test(t)) g.add("performance");
    if (/recover|sore/.test(t)) g.add("recovery");
    if (/age|longev|healthspan/.test(t)) g.add("longevity");
    if (!g.size) return;
    setGoals([...g]); setBusy(true);
    const items = buildProtocol([...g], routine);
    const r = await explain(`You are BioAro Drugs AI. Goals: ${[...g].join(", ")}. Routine: training ${routine.train}, sleep ${routine.sleep}. Suggested: ${items.map((i) => i.title).join(", ")}. In under 45 words explain the fit and remind them to check with a clinician. No doses.`,
      "These formulas match the goals and routine you described. Every ingredient and amount is on each product page. Check with your clinician first, especially if you take medication.");
    setRes({ items, note: r.text, live: r.live }); setBusy(false);
  };
  const total = res?.items.reduce((n, p) => n + p.price, 0) ?? 0;

  return (
    <div id="builder" className="grid gap-5 lg:grid-cols-2">
      <div data-reveal className="relative rounded-4xl bg-white p-6 shadow-lift sm:p-8">
        <ShineBorder radius={28} />
        <div className="flex items-center gap-2 text-[13px] font-semibold text-violet"><Icon name="sparkle" size={16} />BioAro Drugs AI · protocol builder</div>
        <div className="mt-2 text-[26px] font-semibold tracking-tight">What would you like to improve?</div>
        <div className="relative mt-4">
          <textarea value={text} maxLength={200} onChange={(e) => setText(e.target.value)} rows={2} placeholder="I want better focus and energy through the day"
            className="w-full resize-none rounded-2xl border border-black/10 bg-canvas p-4 text-[15px] outline-none focus:border-violet focus:bg-white" aria-label="Describe your goal" />
          <span className="absolute bottom-3 right-4 text-[11px] text-faint">{text.length}/200</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {GOALS.map((g) => { const on = goals.includes(g.id); return (
            <button key={g.id} onClick={() => toggle(g.id)} aria-pressed={on} className={`chip ${on ? "border-ink bg-ink text-white" : "border-black/10 bg-white"}`}><Icon name={g.icon} size={15} />{g.label}</button>
          ); })}
        </div>
        {ROUTINE.map((r) => (
          <div key={r.key} className="mt-5">
            <div className="text-[13px] font-semibold text-muted">{r.label}</div>
            <div role="radiogroup" className="mt-2 inline-flex rounded-full bg-canvas p-1">
              {r.opts.map((o) => <button key={o} role="radio" aria-checked={routine[r.key] === o} onClick={() => setRoutine((s) => ({ ...s, [r.key]: o }))}
                className={`rounded-full px-4 py-1.5 text-[14px] font-medium transition-all ${routine[r.key] === o ? "bg-white shadow-sm" : "text-muted"}`}>{o}</button>)}
            </div>
          </div>
        ))}
        <button onClick={run} className="btn-dark mt-6 h-12 w-full text-[16px]">{busy ? "Building…" : "Build my protocol"}</button>
        <p className="mt-3 text-[12px] leading-relaxed text-faint">About 60 seconds. The builder works from the goals and routine you describe. It does not read biomarkers or genetic data. Check with your clinician before starting supplements.</p>
      </div>
      <div data-reveal className="rounded-4xl bg-white/70 p-6 ring-1 ring-black/[0.05] sm:p-8">
        {!res ? (
          <div className="grid h-full min-h-[300px] place-items-center text-center">
            <div><Icon name="layers" size={30} className="mx-auto text-faint" /><div className="mt-3 text-[17px] font-semibold">Your starting protocol appears here</div><div className="mt-1 text-[14px] text-muted">Pick goals, describe your routine, then build.</div></div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between"><div className="text-[20px] font-semibold">Starting protocol</div><span className="rounded-full bg-canvas px-2.5 py-1 text-[11px] font-semibold text-muted">{res.live ? "Live AI" : "Rule-based"}</span></div>
            <div className="mt-4 space-y-2.5">
              {res.items.map((p) => (
                <Link key={p.handle} href={`/drugs/products/${p.handle}/`} data-scan className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-card ring-1 ring-black/[0.04]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-iri text-white"><Icon name={p.icon} size={20} /></span>
                  <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{p.title}</span><span className="text-[14px] font-semibold">{formatMoney(p.price)}</span></div><div className="truncate text-[13px] text-muted">{p.summary}</div></div>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-ink/80">{res.note}</p>
            <button onClick={() => { fireConfetti(); addMany(res.items); }} className="btn-dark mt-5 h-12 w-full">Add protocol to bag · {formatMoney(total)}</button>
            <p className="mt-2 text-[11px] text-faint">{res.live ? "Live AI explanation" : "Prepared explanation"} · products matched by rules</p>
          </div>
        )}
      </div>
    </div>
  );
}
