import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { LabExplainer } from "@/components/tools/LabExplainer";
import { VisitPrep } from "@/components/tools/VisitPrep";
import { SpecialistRouter } from "@/components/tools/SpecialistRouter";
import { AIBadge } from "@/components/ai/AIBadge";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI health tools — explain lab results, prepare a visit, find a specialist",
  description: "Free AI tools from Biongevity: paste lab results to see them flagged and explained by Xevyo AI, prepare a one-page visit brief, and find the right specialist. Nothing is stored.",
  alternates: { canonical: "/tools/" },
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["AI tools", "/tools/"]])} />
      <PageHero eyebrow="AI health tools" ai="AI tools" title={<>Understand more. <span className="text-ai-grad">Act earlier.</span></>}
        lede="Three free tools powered by Xevyo AI. Matching runs on your device; Xevyo is called only when you press a button, and nothing you type is stored.">
        <div className="flex flex-wrap gap-2"><AIBadge /><AIBadge label="Nothing stored" /><AIBadge label="English · 日本語" /></div>
      </PageHero>
      <Section ai="Lab-result explainer" id="labs" className="!pt-0" chip={false}><div className="container-x"><LabExplainer /></div></Section>
      <Section ai="Visit prep" id="visit" className="!pt-0" chip={false}><div className="container-x"><VisitPrep /></div></Section>
      <Section ai="Specialist router" id="router" className="!pt-0" chip={false}><div className="container-x"><SpecialistRouter /></div></Section>
    </>
  );
}
