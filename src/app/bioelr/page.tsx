import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { Icon } from "@/components/ui/Icon";
import { AIBadge } from "@/components/ai/AIBadge";
import { AIPanel } from "@/components/ai/AIPanel";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Configurator } from "@/components/bioelr/Configurator";
import { BIOELR_AI, BIOELR_INTEROP, BIOELR_SCALE } from "@/data/bioelr";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "BioELR — longevity health record system for clinics",
  description: "BioELR is Biongevity's longevity-focused health record system: AI clinical support, voice notes, scheduling, billing, inventory, cardiac, derma and dental modules, HL7 interoperability and wearables — for clinics, resorts and communities.",
  alternates: { canonical: "/bioelr/" },
};

export default function BioELRPage() {
  return (
    <>
      <JsonLd data={[breadcrumb([["BioELR", "/bioelr/"]]), { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "BioELR", applicationCategory: "BusinessApplication", applicationSubCategory: "Electronic health record", description: "Longevity-focused health record system for clinics and institutions.", publisher: { "@type": "Organization", name: "BioAro Inc." } }]} />
      <PageHero eyebrow="BioELR · for clinics & institutions" ai="BioELR" title={<>The longevity record, <span className="text-ai-grad">with AI built in.</span></>}
        lede="One system for longitudinal care: multi-omic and wearable data, AI that drafts and flags for clinicians, and the operations a modern clinic runs on — from one site to a whole community.">
        <div className="flex flex-wrap gap-3">
          <Link href="#configure" className="btn-dark h-12 px-6"><Icon name="layers" size={17} />Configure BioELR</Link>
          <Link href={`/contact/?interest=${encodeURIComponent("BioELR demo")}`} className="btn-light h-12 px-6">Book a demo</Link>
        </div>
      </PageHero>

      <Section ai="BioELR AI" className="!pt-0">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[32px] bg-white p-6 ai-ring sm:p-8">
            <div aria-hidden className="ai-glow -left-16 -top-20 h-64 w-64" />
            <div className="relative flex flex-wrap items-center gap-3"><XevyoOrb size={44} live halo /><div className="min-w-[220px] flex-1"><div className="text-[24px] font-semibold tracking-tight">AI that works for the care team</div><div className="text-[14px] text-muted">Biongevity SI drafts, flags and answers. Clinicians review and decide.</div></div><AIBadge /></div>
            <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BIOELR_AI.map((a) => (
                <div key={a.t} className="rounded-2xl bg-canvas p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ai-soft text-ai"><Icon name={a.icon} size={19} weight="duotone" /></span>
                  <div className="mt-3 text-[15.5px] font-semibold">{a.t}</div>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section ai="BioELR configurator" id="configure" className="scroll-mt-20 bg-canvas/50" chip={false}>
        <div className="container-x">
          <Head n="01" label="Modules" title="Pick what your clinic needs." lede="Sixteen modules across operations, specialties and patient experience. Choose specialties and Biongevity SI suggests matching modules — on your device." />
          <div className="mt-10"><Configurator /></div>
        </div>
      </Section>

      <Section ai="Interoperability and security">
        <div className="container-x">
          <Head n="02" label="Connected" title="Speaks the language of healthcare." lede="Standards-based exchange with labs, pharmacies and other systems, plus devices and multi-omic data in the same record." />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BIOELR_INTEROP.map((x) => (
              <div key={x.t} className="card p-5"><Icon name={x.icon} size={22} weight="duotone" className="text-accent" /><div className="mt-3 text-[16px] font-semibold">{x.t}</div><p className="mt-1 text-[13.5px] leading-relaxed text-muted">{x.d}</p></div>
            ))}
          </div>
        </div>
      </Section>

      <Section ai="Longevity communities" className="bg-canvas/50">
        <div className="container-x">
          <Head n="03" label="Scale" title="From one clinic to a longevity city." lede="Centralised, consented health data for individuals, providers and researchers — to see population trends and test what works." />
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {BIOELR_SCALE.map((x) => (
              <div key={x.t} className="rounded-[24px] bg-white p-6 ring-1 ring-ink/[0.06]"><span className="grid h-12 w-12 place-items-center icon-tile"><Icon name={x.icon} size={22} /></span><div className="mt-4 text-[18px] font-semibold">{x.t}</div><p className="mt-1 text-[14px] text-muted">{x.d}</p></div>
            ))}
          </div>
        </div>
      </Section>

      <Section ai="Ask about BioELR" chip={false}>
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="h-section">Questions before a demo?</h2>
            <p className="lede mt-4">Ask Xevyo about modules, integration or rollout. For pricing and contracts, request a proposal.</p>
            <Link href={`/contact/?interest=${encodeURIComponent("BioELR proposal")}`} className="btn-dark mt-6 h-12 px-6">Request a proposal<Icon name="arrow-right" size={15} /></Link>
          </div>
          <AIPanel title="Ask about BioELR" context="BioELR health record system for clinics" prompts={["What modules does BioELR include?", "How does BioELR connect to labs and devices?", "Can BioELR run several clinics?"]} />
        </div>
      </Section>
    </>
  );
}
