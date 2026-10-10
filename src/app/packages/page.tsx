import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AskButton } from "@/components/pages/AskButton";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { Icon } from "@/components/ui/Icon";
import { PACKAGES } from "@/data/health";

export const metadata: Metadata = { title: "Longevity Packages" };

const ROWS: [string, string, string, string][] = [
  ["Program length", "12 months", "12 months", "12 months"],
  ["Longevity expert consultations", "Once monthly", "Twice monthly", "Unlimited"],
  ["Whole genome sequencing", "✓", "✓", "✓"],
  ["Gut microbiome test", "✓", "✓", "✓"],
  ["Telomere length analysis", "✓", "✓", "✓"],
  ["Targeted methylation analysis", "—", "✓", "✓"],
  ["Pharmacogenomics", "—", "✓", "✓"],
  ["Transcriptomics / gene expression", "—", "—", "✓"],
  ["Cell-free DNA cancer screening", "—", "—", "✓"],
];

export default function PackagesPage() {
  return (
    <>
      <PageHero eyebrow="Longevity packages" title="Core. Plus. Elite." lede="Three 12-month programs that differ in how often you see a longevity expert and in the depth of genetic testing.">
        <AskButton q="Compare Core, Plus and Elite">Ask AI to explain the differences</AskButton>
      </PageHero>
      <Section ai="Compare" className="!pt-0">
        <div className="container-x grid gap-5 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <div key={p.handle} data-reveal className={`relative flex flex-col rounded-4xl p-7 ${p.featured ? "bg-surface shadow-lift" : "bg-surface/70 shadow-card ring-1 ring-white/[0.05]"}`}>
              {p.featured && <><ShineBorder radius={28} /><span className="absolute right-6 top-6 rounded-full bg-iri px-2.5 py-1 text-[11px] font-bold text-white">Most chosen</span></>}
              <div className="text-[12px] font-semibold uppercase tracking-wider text-faint">12-month program</div>
              <div className="mt-2 text-[30px] font-semibold tracking-tight">{p.name}</div>
              <p className="mt-2 text-[15px] text-muted">{p.desc}</p>
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-canvas px-4 py-3 text-[14px]"><span className="text-muted">Expert consultations</span><span className="font-semibold">{p.consult}</span></div>
              <div className="mt-6 text-[13px] font-semibold">Genetic testing</div>
              <ul className="mt-3 space-y-2.5">{p.tests.map((t) => <li key={t} className="flex gap-2.5 text-[15px]"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-iri text-white"><Icon name="check" size={12} strokeWidth={2.4} /></span>{t}</li>)}</ul>
              <div className="mt-5 text-[13px] font-semibold">Also listed</div>
              <ul className="mt-2 space-y-1.5 text-[14px] text-muted">{p.extras.map((t) => <li key={t}>· {t}</li>)}</ul>
              <div className="flex-1" />
              <Link href={`/contact/?interest=${encodeURIComponent(p.name)}`} className={`${p.featured ? "btn-dark" : "btn-light"} mt-8 w-full`}>Enquire about {p.name.split(" ")[1]}</Link>
            </div>
          ))}
        </div>
      </Section>
      <Section ai="Comparison table" className="!pt-0">
        <div className="container-x">
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead><tr className="border-b border-white/[0.06]"><th className="p-4 font-semibold">Feature</th>{PACKAGES.map((p) => <th key={p.handle} className="p-4 font-semibold">{p.name.replace("Biongevity ", "")}</th>)}</tr></thead>
              <tbody>{ROWS.map((r) => <tr key={r[0]} className="border-b border-white/[0.04] last:border-0">{r.map((c, i) => <td key={i} className={`p-4 ${i ? (c === "✓" ? "font-semibold text-violet" : c === "—" ? "text-faint" : "font-medium") : "text-muted"}`}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="mt-5 flex gap-3 rounded-2xl bg-surface p-4 text-[13px] text-muted ring-1 ring-white/[0.05]"><Icon name="info" size={18} className="shrink-0 text-violet" />Details from the biongevity.com package table and Biongevity&apos;s February 2025 announcement. Pricing is published there in AED for the UAE program; confirm pricing and regional availability with a coordinator.</div>
        </div>
      </Section>
    </>
  );
}
