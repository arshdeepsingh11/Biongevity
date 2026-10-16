import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { LabExplainer } from "@/components/tools/LabExplainer";
import { VisitPrep } from "@/components/tools/VisitPrep";
import { SpecialistRouter } from "@/components/tools/SpecialistRouter";
import { AIBadge } from "@/components/ai/AIBadge";
import { FitnessAge, GenesVsLifestyle, InterventionRanking } from "@/components/tools/SITools";
import { Head } from "@/components/home/HomeSections";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI health tools — explain lab results, prepare a visit, find a specialist",
  description: "Free AI tools from Biongevity: paste lab results to see them flagged and explained by Biongevity SI, prepare a one-page visit brief, and find the right specialist. Nothing is stored.",
  alternates: { canonical: "/tools/" },
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["AI tools", "/tools/"]])} />
      <PageHero eyebrow="AI health tools" ai="AI tools" title={<>Understand more. <span className="text-ai-grad">Act earlier.</span></>}
        lede="Three free tools powered by Biongevity SI. Matching runs on your device; Biongevity SI is called only when you press a button, and nothing you type is stored.">
        <div className="flex flex-wrap gap-2"><AIBadge /><AIBadge label="Nothing stored" /><AIBadge label="EN · FR · AR · FA" /></div>
      </PageHero>
      <Section ai="Lab-result explainer" id="labs" className="!pt-0" chip={false}><div className="container-x"><LabExplainer /></div></Section>
      <Section ai="Visit prep" id="visit" className="!pt-0" chip={false}><div className="container-x"><VisitPrep /></div></Section>
      <Section ai="Specialist router" id="router" className="!pt-0" chip={false}><div className="container-x"><SpecialistRouter /></div></Section>
      <Section ai="Intervention ranking" id="ranking" className="scroll-mt-20">
        <div className="container-x"><Head n="04" label="Intervention ranking" title="Your three highest-value steps, ranked." lede="Every option scored on your device: expected benefit × certainty of evidence × how much it fits you, discounted by cost and effort. Transparent maths — no hidden model." /><div className="mt-10"><InterventionRanking /></div></div>
      </Section>
      <Section ai="Fitness age" id="fitness" className="scroll-mt-20">
        <div className="container-x"><Head n="05" label="Fitness age" title="How old is your fitness?" lede="VO₂max is one of the strongest predictors of lifespan. Estimate yours without a treadmill using the published HUNT model — and see the one change that moves it most." /><div className="mt-10"><FitnessAge /></div></div>
      </Section>
      <Section ai="Genes vs lifestyle" id="genes" className="scroll-mt-20">
        <div className="container-x"><Head n="06" label="Genes vs lifestyle" title="Your genes are not your fate." lede="Four habits against inherited heart risk. In a study of 55,685 people, a favourable lifestyle was linked with about half the coronary risk — even at high genetic risk." /><div className="mt-10"><GenesVsLifestyle /></div></div>
      </Section>
    </>
  );
}
