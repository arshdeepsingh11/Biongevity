import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { Icon } from "@/components/ui/Icon";
import { AIBadge } from "@/components/ai/AIBadge";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIPanel } from "@/components/ai/AIPanel";
import { AI_PRINCIPLES, EVIDENCE_LEVELS, MODEL_CARDS, AI_FAQ } from "@/data/governance";
import { JsonLd, breadcrumb, faqPage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How our AI works — Biongevity SI governance, model cards and safeguards",
  description: "What Biongevity SI, Biongevity's AI, does and does not do: clinician-first design, no data stored by the website, answers grounded in our pages, evidence levels and model cards.",
  alternates: { canonical: "/ai/" },
};

const TONE = { teal: "bg-teal-light text-teal", gold: "bg-gold-soft text-gold-deep", faint: "bg-canvas text-muted" } as const;

export default function AIPage() {
  return (
    <>
      <JsonLd data={[breadcrumb([["How our AI works", "/ai/"]]), faqPage(AI_FAQ)]} />
      <PageHero eyebrow="How our AI works" ai="AI governance" title={<>AI you can <span className="text-ai-grad">see through.</span></>}
        lede="Xevyo is Biongevity's in-house AI. Here is exactly what it does on this website, what it never does, and how each model is described.">
        <div className="flex flex-wrap items-center gap-3"><XevyoOrb size={44} live halo /><AIBadge /><AIBadge label="Clinician-first" /><AIBadge label="Nothing stored" /></div>
      </PageHero>

      <Section ai="AI principles" className="!pt-0">
        <div className="container-x grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AI_PRINCIPLES.map((p) => (
            <div key={p.t} className="card p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ai-soft text-ai"><Icon name={p.icon} size={19} weight="duotone" /></span><div className="mt-3 text-[16.5px] font-semibold">{p.t}</div><p className="mt-1 text-[14px] leading-relaxed text-muted">{p.d}</p></div>
          ))}
        </div>
      </Section>

      <Section ai="Evidence levels" className="bg-canvas/50">
        <div className="container-x">
          <Head n="01" label="Evidence" title="Validated, supportive or exploratory." lede="Every biomarker and model is labelled by strength of evidence, so exploratory longevity science is never presented as a verdict." />
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {EVIDENCE_LEVELS.map((e) => <div key={e.k} className="rounded-[24px] bg-white p-5 ring-1 ring-ink/[0.06]"><span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${TONE[e.tone]}`}>{e.k}</span><p className="mt-3 text-[14px] leading-relaxed text-muted">{e.d}</p></div>)}
          </div>
        </div>
      </Section>

      <Section ai="Model cards">
        <div className="container-x">
          <Head n="02" label="Model cards" title="Every model, described." lede="Intended use, inputs, outputs and limits — for the AI and for the simple on-device models that support it." />
          <div className="mt-8 grid gap-3 lg:grid-cols-2">
            {MODEL_CARDS.map((m) => (
              <div key={m.name} className={`rounded-[24px] bg-white p-5 ${m.kind === "Xevyo" ? "ai-ring" : "ring-1 ring-ink/[0.07]"}`}>
                <div className="flex items-center gap-2.5">{m.kind === "Xevyo" ? <XevyoOrb size={28} /> : <span className="grid h-7 w-7 place-items-center rounded-lg bg-canvas text-accent"><Icon name="cpu" size={15} /></span>}
                  <div className="flex-1 text-[16px] font-semibold">{m.name}</div><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${m.kind === "Xevyo" ? "bg-ai-soft text-ai" : "bg-canvas text-muted"}`}>{m.kind === "Xevyo" ? "✦ Xevyo AI" : "On your device"}</span></div>
                <dl className="mt-3 grid grid-cols-[86px_1fr] gap-x-3 gap-y-1.5 text-[13.5px]">
                  <dt className="font-semibold text-muted">Use</dt><dd>{m.use}</dd>
                  <dt className="font-semibold text-muted">Inputs</dt><dd>{m.inputs}</dd>
                  <dt className="font-semibold text-muted">Outputs</dt><dd>{m.outputs}</dd>
                  <dt className="font-semibold text-muted">Limits</dt><dd className="text-muted">{m.limits}</dd>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section ai="AI questions" className="bg-canvas/50" chip={false}>
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            {AI_FAQ.map((f) => <details key={f.q} className="group rounded-2xl bg-white p-4 ring-1 ring-ink/[0.06]"><summary className="cursor-pointer list-none text-[15.5px] font-semibold">{f.q}</summary><p className="mt-2 text-[14px] leading-relaxed text-muted">{f.a}</p></details>)}
          </div>
          <AIPanel title="Ask how our AI works" context="Biongevity AI governance" prompts={["Does Xevyo store my data?", "Can Xevyo diagnose me?", "How do answers cite your pages?"]} />
        </div>
      </Section>
    </>
  );
}
