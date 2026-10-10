import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { AskButton } from "@/components/pages/AskButton";
import { KeywordStream } from "@/components/fx/KeywordStream";
import { DecodeText } from "@/components/fx/DecodeText";
import { DEPARTMENTS } from "@/data/health";
import { LAB_TESTS } from "@/data/labs";
import { ProductCard } from "@/components/products/ProductCard";

type P = { params: Promise<{ dept: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return DEPARTMENTS.map((d) => ({ dept: d.id })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const k = (await params).dept;
  const d = DEPARTMENTS.find((x) => x.id === k);
  return { title: d?.name ?? "Department", description: d?.summary };
}

/** Related BioAro Labs tests per department (cross-sell, no duplicated content). */
const RELATED: Record<string, string[]> = {
  cardiology: ["hs-crp-high-sensitivity-c-reactive-protein", "pai-1-total-plasminogen-activator-inhibitor-1", "telomere-length-testing"],
  neurology: ["brain-health", "p-tau217-phosphorylated-tau-217", "beta-amyloid-40-42-ratio"],
  dermatology: ["bioskin"], dental: ["biodental"],
  "mens-womens-health": ["hormone-health", "biofemme", "total-testosterone"],
  dietology: ["biogut", "essential-vitamin-health", "core-amino-acid-balance"],
  "internal-medicine": ["whole-genome-sequencing-30x", "core-inflammation-aging", "cystatin-c"],
  "geriatric-medicine": ["telomere-length-testing", "ultra-inflammation-aging", "gdf-15-growth-differentiation-factor-15"],
  kinesiology: ["advanced-amino-acid-metabolism", "il-6-interleukin-6"],
  "mental-health": ["cortisol"],
  radiology: [],
};

export default async function DeptPage({ params }: P) {
  const { dept } = await params;
  const i = DEPARTMENTS.findIndex((x) => x.id === dept);
  if (i < 0) notFound();
  const d = DEPARTMENTS[i], prev = DEPARTMENTS[(i + 10) % 11], next = DEPARTMENTS[(i + 1) % 11];
  const tests = (RELATED[d.id] ?? []).map((h) => LAB_TESTS.find((t) => t.handle === h)).filter(Boolean);
  return (
    <>
      <section data-ai={d.name} className="relative z-[1] pb-10 pt-[calc(100px+var(--safe-top))] sm:pt-[130px]">
        <div className="container-x">
          <Link href="/precision-health/" className="inline-flex items-center gap-1 text-[14px] font-medium text-muted hover:text-ink"><Icon name="chevron-left" size={16} />Precision Health</Link>
          <div className="mt-8 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={d.icon} size={26} /></span>
            <span className="text-[13px] font-semibold text-faint"><DecodeText text={`Department ${i + 1} of 11`} /></span>
          </div>
          <h1 data-reveal className="h-display mt-6">{d.name}</h1>
          <p data-reveal className="lede mt-5 max-w-[60ch]">{d.summary}</p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact/?interest=${encodeURIComponent(d.name)}`} className="btn-dark">Enquire about {d.short}</Link>
            <AskButton q={`What happens in ${d.name}?`}>Ask AI about this</AskButton>
          </div>
        </div>
      </section>
      {!d.calm && <section className="relative z-[1]"><KeywordStream words={d.keywords.concat(d.keywords)} /></section>}
      <Section ai="Focus areas">
        <div className="container-x grid gap-4 md:grid-cols-3">
          {d.focus.map((f, k) => (
            <div key={f.t} data-reveal data-scan className="card p-7">
              <span className="text-[13px] font-semibold text-violet">0{k + 1}</span>
              <div className="mt-4 text-[21px] font-semibold tracking-tight">{f.t}</div>
              <div className="mt-2 text-[15px] text-muted">{f.d}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section ai="Clinician questions" className="!pt-0">
        <div className="container-x max-w-[820px]">
          <div data-reveal className="card p-6 sm:p-8">
            <div className="text-[19px] font-semibold">Questions to bring to your clinician</div>
            <div className="mt-4 space-y-2">{d.questions.map((q) => <AskButton key={q} q={q} variant="row">{q}</AskButton>)}</div>
            <div className="mt-4 text-[12px] text-faint">Source: {d.source}. Services may vary by location; confirm with the clinic.</div>
          </div>
        </div>
      </Section>
      {tests.length > 0 && (
        <Section ai="Related tests" className="!pt-0">
          <div className="container-x">
            <h2 className="text-[26px] font-semibold tracking-tight">Related BioAro Labs tests</h2>
            <p className="mt-1 text-[14px] text-muted">Opens the official test page on bioarolabs.com.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tests.map((t) => <ProductCard key={t!.handle} p={t!} />)}</div>
          </div>
        </Section>
      )}
      <section className="relative z-[1] pb-20">
        <div className="container-x flex justify-between gap-3">
          <Link href={`/precision-health/${prev.id}/`} className="btn-light"><Icon name="chevron-left" size={15} />{prev.short}</Link>
          <Link href={`/precision-health/${next.id}/`} className="btn-light">{next.short}<Icon name="chevron-right" size={15} /></Link>
        </div>
      </section>
    </>
  );
}
