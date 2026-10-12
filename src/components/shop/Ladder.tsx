"use client";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "./CartProvider";
import { CATALOG } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

const MIN = (k: string) => Math.min(...CATALOG.filter((i) => i.kind === k).map((i) => i.price));
const MAX = (k: string) => Math.max(...CATALOG.filter((i) => i.kind === k).map((i) => i.price));

const ROWS = [
  { k: "Best for", v: ["One specific question", "A yearly check with a doctor", "Ongoing optimisation"] },
  { k: "Clinician review", v: [true, true, true] },
  { k: "Clinic visit & imaging", v: [false, true, "As indicated"] },
  { k: "Multi-omics (genome, microbiome, epigenetics)", v: ["Pick one", "Some", true] },
  { k: "AI coach & Biongevity App", v: [false, false, true] },
  { k: "Bioactives included", v: [false, false, true] },
  { k: "Re-test schedule", v: ["When you choose", "Yearly", "End of each term"] },
];

/** The value ladder: test → package → program, so visitors see where they fit. */
export function Ladder() {
  const { setView } = useCart();
  const cols = [
    { k: "test", t: "Single test", icon: "test-tube", price: `${formatMoney(MIN("test"))}–${formatMoney(MAX("test"))}`, unit: "one-time" },
    { k: "package", t: "Health package", icon: "box", price: `${formatMoney(MIN("package"))}–${formatMoney(MAX("package"))}`, unit: "labs + clinic quote" },
    { k: "program", t: "Longevity program", icon: "crown", price: `${formatMoney(MIN("program"))}–${formatMoney(MAX("program"))}`, unit: "per 12 months · 3 & 6 mo available" },
  ];
  const cell = (v: boolean | string) => v === true ? <Icon name="check" size={18} weight="bold" className="mx-auto text-teal" /> : v === false ? <span className="text-faint">—</span> : <span className="text-[12.5px]">{v}</span>;
  return (
    <div className="overflow-x-auto rounded-[28px] bg-white shadow-card ring-1 ring-ink/[0.06]">
      <table className="w-full min-w-[640px] text-[14px]">
        <thead>
          <tr>
            <th className="p-5 text-left align-bottom"><span className="hud-label">Choose your depth</span></th>
            {cols.map((c, i) => (
              <th key={c.k} className={`p-5 text-center align-bottom ${i === 2 ? "bg-navy" : ""}`}>
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-iri text-white"><Icon name={c.icon} size={22} weight="duotone" /></span>
                <div className="mt-2 text-[16px] font-semibold">{c.t}</div>
                <div className="mt-1 text-[15px] font-semibold text-accent">{c.price}</div>
                <div className="text-[11px] font-normal text-muted">CAD · {c.unit}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => <tr key={r.k} className="border-t border-ink/[0.05]"><td className="p-4 pl-5">{r.k}</td>{r.v.map((v, i) => <td key={i} className={`p-4 text-center ${i === 2 ? "bg-navy" : ""}`}>{cell(v)}</td>)}</tr>)}
          <tr className="border-t border-ink/[0.05]"><td className="p-4 pl-5 text-[12px] text-faint">Programs</td><td colSpan={2} /><td className="bg-navy p-4"><div className="flex flex-wrap justify-center gap-1.5">{CATALOG.filter((i) => i.kind === "program").map((p) => <button key={p.id} onClick={() => setView(p.id)} className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold ring-1 ring-accent/20 hover:text-accent">{p.title.replace("Biongevity ", "")}</button>)}</div></td></tr>
        </tbody>
      </table>
    </div>
  );
}
