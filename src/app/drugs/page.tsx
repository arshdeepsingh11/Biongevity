import Link from "next/link";
import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { BeamFlow } from "@/components/fx/BeamFlow";
import { DecodeText } from "@/components/fx/DecodeText";
import { BuilderAndPersonas, ProductRange, ExampleProtocol } from "@/components/pages/DrugsSections";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Icon } from "@/components/ui/Icon";
import { PRINCIPLES, SACHET_POINTS, DRUG_PRODUCTS } from "@/data/drugs";
import { ARTICLES } from "@/data/journal";
import { FOUNDER } from "@/data/site";

export const metadata: Metadata = { title: "BioAro Drugs — AI-Guided Bioactive Protocols", description: "Tell BioAro Drugs AI what you want to improve. Every ingredient and dose shown." };

export default function DrugsPage() {
  const longevity = DRUG_PRODUCTS[0];
  return (
    <>
      <section data-ai="BioAro Drugs" className="relative z-[1] overflow-hidden pb-12 pt-[calc(100px+var(--safe-top))] sm:pt-[140px]">
        <div className="absolute inset-0 opacity-70"><BeamFlow /></div>
        <div className="container-x relative">
          <div className="eyebrow"><DecodeText text="BioAro Drugs · BioAro Intelligence" /></div>
          <h1 data-reveal className="h-display mt-4">Your goals.<br />Your routine.<br /><span className="text-iri">Your protocol.</span></h1>
          <p data-reveal className="lede mt-5 max-w-[52ch]">AI-guided personalization meets evidence-informed bioactive formulations, with every ingredient and amount shown.</p>
          <div data-reveal className="mt-6 flex flex-wrap gap-2 text-[12px] font-semibold tracking-wider text-muted">{["AI-GUIDED", "EVIDENCE-INFORMED", "TRANSPARENT", "PERSONALIZED"].map((t) => <span key={t} className="rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-black/5">{t}</span>)}</div>
        </div>
      </section>

      <BuilderAndPersonas />
      <ProductRange />

      <Section ai="Why BioAro Drugs">
        <div className="container-x">
          <Eyebrow>Why BioAro Drugs</Eyebrow>
          <h2 data-reveal className="h-section mt-3">Built by health experts. Guided by science.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PRINCIPLES.map((p) => <div key={p.n} data-reveal data-scan className="card p-6"><span className="text-[13px] font-semibold text-violet">{p.n}</span><div className="mt-4 text-[17px] font-semibold">{p.t}</div><div className="mt-2 text-[14px] text-muted">{p.d}</div></div>)}
          </div>
        </div>
      </Section>

      <Section ai="Transparency" className="!pt-0">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div data-reveal>
            <Eyebrow>Know what you're taking</Eyebrow>
            <h2 className="h-section mt-3">Know what you&apos;re taking. Know why.</h2>
            <p className="lede mt-3">Most supplement labels ask for trust. This is the full formulation of LONgevity+, at the doses it ships with — the same disclosure sits on every product page.</p>
            <Link href="/drugs/products/longevity-plus/" className="btn-dark mt-6">See the full label</Link>
          </div>
          <div data-reveal className="card overflow-hidden">
            <div className="border-b border-black/[0.06] p-5"><div className="text-[18px] font-semibold">LONgevity+</div><div className="text-[13px] text-muted">6 actives · {longevity.format}</div></div>
            {longevity.ingredients!.map((i) => <div key={i.name} data-scan className="flex justify-between gap-4 border-b border-black/[0.04] px-5 py-3.5 last:border-0"><div><div className="font-semibold">{i.name}</div><div className="text-[13px] text-muted">{i.why}</div></div><div className="shrink-0 font-semibold">{i.amount}</div></div>)}
            <div className="bg-canvas px-5 py-3 text-[12px] text-faint">Other ingredients: Microcrystalline Cellulose, Silicon Dioxide, Maize Starch, Hypromellose capsule.</div>
          </div>
        </div>
      </Section>

      <ExampleProtocol />

      <Section ai="Sachets" className="!pt-0">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <MediaSlot id="drugsVideo" className="aspect-[4/3]" />
          <div data-reveal>
            <Eyebrow>One sachet</Eyebrow>
            <h2 className="h-section mt-3">Wherever the day goes.</h2>
            <p className="lede mt-3">Single-serve sachets made for real routines. Tear, pour, go. The difference between a routine you keep and one that quietly stops in week two.</p>
            <ul className="mt-6 space-y-2.5">{SACHET_POINTS.map((s) => <li key={s} className="flex items-center gap-3 text-[16px]"><span className="grid h-6 w-6 place-items-center rounded-full bg-iri text-white"><Icon name="check" size={13} strokeWidth={2.4} /></span>{s}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section ai="Founder" className="!pt-0">
        <div className="container-x">
          <div className="grid gap-6 rounded-5xl bg-white p-6 shadow-card ring-1 ring-black/[0.05] sm:p-10 lg:grid-cols-3">
            <MediaSlot id="founder" className="aspect-square" rounded="rounded-3xl" />
            <div className="lg:col-span-2">
              <Eyebrow>From the founder</Eyebrow>
              <div className="mt-3 text-[28px] font-semibold tracking-tight">Built around precision health.</div>
              <blockquote className="mt-4 text-[18px] leading-relaxed text-ink/80">&ldquo;{FOUNDER.quote}&rdquo;</blockquote>
              <div className="mt-5 font-semibold">{FOUNDER.name}</div><div className="text-[14px] text-muted">{FOUNDER.role}</div>
              <a href={FOUNDER.linkedin} target="_blank" rel="noopener" className="btn-light mt-5">Meet Dr. Kapoor<Icon name="external" size={13} /></a>
            </div>
          </div>
        </div>
      </Section>

      <Section ai="Science" className="!pt-0">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-[30px] font-semibold tracking-tight">The science, written to be understood.</h2><Link href="/journal/" className="btn-light">Journal</Link></div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ARTICLES.filter((a) => a.source === "BioAro Drugs Science").map((a) => (
              <a key={a.slug} href={a.url} target="_blank" rel="noopener" data-scan className="card p-6 hover:shadow-lift">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-violet">{a.cat} · {a.min} min read</div>
                <div className="mt-3 text-[19px] font-semibold">{a.t}</div><div className="mt-2 text-[14px] text-muted">{a.sum[0]}</div>
              </a>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
