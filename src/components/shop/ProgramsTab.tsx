"use client";
import { PACKAGES } from "@/data/health";
import { buyUrl } from "@/lib/commerce";
import { Icon } from "@/components/ui/Icon";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { BorderBeam } from "@/components/fx/BorderBeam";
import { BarList, Columns } from "@/components/charts/Charts";

const GROUPS = [
  { k: "diagnostics", t: "Integrated diagnostics", icon: "test-tubes" },
  { k: "ai", t: "AI longevity coach", icon: "bot" },
  { k: "app", t: "App & integrations", icon: "phone" },
] as const;

/** Rows for the comparison matrix: which program includes what (from biongevity.com package pages). */
const MATRIX: { t: string; has: [boolean, boolean, boolean] }[] = [
  { t: "Longevity genomics panel", has: [true, true, true] },
  { t: "Gut microbiome analysis", has: [true, true, true] },
  { t: "Epigenetic ageing", has: [true, true, true] },
  { t: "Whole Genome Sequencing", has: [false, true, true] },
  { t: "Telomere length", has: [false, true, true] },
  { t: "Pharmacogenomics", has: [false, true, true] },
  { t: "Inflammation panel (IL-6, IL-10, TNF-α, CRP)", has: [false, true, true] },
  { t: "Multi-omics · metabolomics · proteomics", has: [false, false, true] },
  { t: "Brain markers (p-Tau217, Aβ 40/42)", has: [false, false, true] },
  { t: "Assigned longevity physician", has: [false, false, true] },
  { t: "Re-testing every 3–6 months", has: [false, false, true] },
];

export function ProgramsTab({ onMatch }: { onMatch: () => void }) {
  const counts = PACKAGES.map((p, i) => ({ label: p.name.replace("Biongevity ", ""), value: MATRIX.filter((m) => m.has[i]).length }));
  return (
    <div className="space-y-10">
      <div className="grid gap-5 lg:grid-cols-3">
        {PACKAGES.map((p) => (
          <div key={p.handle} className={`relative flex flex-col overflow-hidden rounded-[28px] p-6 sm:p-7 ${p.featured ? "bg-navy text-white shadow-lift" : "bg-white shadow-card ring-1 ring-ink/[0.06]"}`}>
            {p.featured && <><BorderBeam duration={7} /><span className="absolute right-5 top-5 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-white">Most chosen</span></>}
            <div className={`text-[12px] font-semibold uppercase tracking-[0.12em] ${p.featured ? "text-teal-soft" : "text-faint"}`}>{p.cadence}</div>
            <div className="mt-2 text-[26px] font-semibold tracking-tight">{p.name}</div>
            <div className="mt-3 flex items-baseline gap-1.5"><span className={`text-[14px] ${p.featured ? "text-white/60" : "text-muted"}`}>USD</span><span className="text-[48px] font-semibold leading-none tracking-tight"><NumberTicker value={p.price} /></span></div>
            {GROUPS.map((g) => (
              <div key={g.k} className="mt-5">
                <div className="flex items-center gap-2 text-[13px] font-semibold"><Icon name={g.icon} size={15} className={p.featured ? "text-teal-soft" : "text-accent"} />{g.t}</div>
                <ul className="mt-2 space-y-1.5">{p[g.k].slice(0, 4).map((t) => <li key={t} className={`flex gap-2 text-[13.5px] leading-snug ${p.featured ? "text-white/80" : "text-ink/80"}`}><Icon name="check" size={14} className="mt-0.5 shrink-0 text-teal-soft" />{t}</li>)}</ul>
              </div>
            ))}
            <div className={`mt-5 rounded-2xl px-4 py-3 text-[13px] ${p.featured ? "bg-white/10" : "bg-canvas"}`}><span className="opacity-70">Bioactives · </span><b>{p.bioactives}</b></div>
            <div className="flex-1" />
            <a href={buyUrl(p)} target="_blank" rel="noopener" className={`mt-6 w-full ${p.featured ? "btn-light" : "btn-dark"}`}>Choose {p.name.split(" ")[1]}<Icon name="arrow-up-right" size={14} /></a>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-ink/[0.06]">
          <div className="border-b border-ink/[0.06] p-5"><div className="text-[18px] font-semibold">Compare what's included</div></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[14px]">
              <thead><tr className="text-left text-[12px] uppercase tracking-[0.1em] text-faint"><th className="p-4 font-semibold">Feature</th>{PACKAGES.map((p) => <th key={p.handle} className="p-4 text-center font-semibold">{p.name.replace("Biongevity ", "")}</th>)}</tr></thead>
              <tbody>{MATRIX.map((m) => (
                <tr key={m.t} className="border-t border-ink/[0.05] hover:bg-canvas">
                  <td className="p-4">{m.t}</td>
                  {m.has.map((h, i) => <td key={i} className="p-4 text-center">{h ? <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-teal-light text-teal"><Icon name="check" size={14} /></span> : <span className="text-faint">—</span>}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-3 text-[14px] font-semibold">Price per program (USD)</div><Columns data={PACKAGES.map((p) => ({ label: p.name.replace("Biongevity ", ""), value: p.price }))} unit="" highlight="Precision" height={150} /></div>
          <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-3 text-[14px] font-semibold">Features included (of {MATRIX.length})</div><BarList data={counts} max={MATRIX.length} /></div>
          <button onClick={onMatch} className="flex w-full items-center gap-3 rounded-[28px] bg-accent-light p-5 text-left transition-colors hover:bg-accent/15">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-white"><Icon name="target" size={20} /></span>
            <span className="flex-1"><b className="block text-[15px]">Not sure which one?</b><span className="text-[13px] text-muted">Take the 2-minute match quiz.</span></span><Icon name="arrow-right" size={16} className="text-accent" />
          </button>
        </div>
      </div>
      <p className="text-[12px] text-faint">Prices and inclusions as listed on biongevity.com. Programs are purchased on the official Biongevity store.</p>
    </div>
  );
}
