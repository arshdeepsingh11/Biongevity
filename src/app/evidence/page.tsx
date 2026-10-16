import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { AIBadge } from "@/components/ai/AIBadge";
import { EvidenceEngine } from "@/components/evidence/EvidenceEngine";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Evidence engine — the studies behind every number",
  description: "Every figure on Biongevity, auditable: study design, number of studies and people, effect size with confidence interval and a GRADE certainty rating — explained by Biongevity SI.",
  alternates: { canonical: "/evidence/" },
};

export default function EvidencePage() {
  return (
    <>
      <JsonLd data={breadcrumb([["Evidence engine", "/evidence/"]])} />
      <PageHero eyebrow="Evidence engine" ai="Evidence engine" title={<>Every number, <AuroraText>with its proof.</AuroraText></>}
        lede="The research behind our charts and tools: what was studied, in how many people, how big the effect was and how certain we can be. Filter it, sort it, and ask Biongevity SI to explain any card.">
        <div className="flex flex-wrap gap-2"><AIBadge label="GRADE-rated" /><AIBadge label="Sources linked" /><AIBadge label="Updated as trials publish" /></div>
      </PageHero>
      <Section ai="Evidence cards" className="!pt-0" chip={false}><div className="container-x"><EvidenceEngine /></div></Section>
    </>
  );
}
