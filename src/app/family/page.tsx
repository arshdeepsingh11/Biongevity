import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { FamilyPlanner, FamilyViewDemo } from "@/components/family/FamilyCare";
import { FamilyTree } from "@/components/family/FamilyTree";
import { AIPanel } from "@/components/ai/AIPanel";
import { AIBadge } from "@/components/ai/AIBadge";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Caring for a parent — AI family care planner",
  description: "For adult children looking after an ageing parent: an AI checklist, the right tests and specialists, virtual visits and a permissioned family view in the Biongevity app.",
  alternates: { canonical: "/family/" },
};

export default function FamilyPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["Family care", "/family/"]])} />
      <PageHero eyebrow="Family care" ai="Family care" title={<>Look after Mum and Dad, <span className="text-ai-grad">even from far away.</span></>}
        lede="Pick what worries you. Xevyo turns it into a checklist, the right specialists and tests, and — with your parent's permission — a shared view of their trends in the Biongevity app.">
        <div className="flex flex-wrap gap-2"><AIBadge /><AIBadge label="For adult children" /><AIBadge label="Parent stays in control" /></div>
      </PageHero>
      <Section ai="Family care planner" className="!pt-0" chip={false}><div className="container-x"><FamilyPlanner /></div></Section>
      <Section ai="Family view" className="bg-canvas/50">
        <div className="container-x">
          <Head n="01" label="Family view" title="See the trend, not just the worry." lede="Your parent decides which domains you can see. You get a calm weekly picture; the care team gets the alerts." />
          <div className="mt-10"><FamilyViewDemo /></div>
        </div>
      </Section>
      <Section ai="Ask about family care" chip={false}>
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div><h2 className="h-section">Not sure where to start?</h2><p className="lede mt-4">Ask Xevyo — in English or 日本語 — about memory, falls, medicines or how to start the conversation with your parent.</p></div>
          <AIPanel title="Ask about caring for a parent" context="Family care for an ageing parent" prompts={["How do I talk to my dad about memory problems?", "What should a medication review include?", "How can I help my mum from another city?"]} />
        </div>
      </Section>
    </>
  );
}
