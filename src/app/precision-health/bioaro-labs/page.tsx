import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { LabsHub } from "@/components/bioaro/LabsHub";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "BioAro Labs — AI-connected lab tests, genomics & microbiome",
  description: "47 advanced lab tests — whole genome sequencing, microbiome, hormones, inflammation, vitamins and brain biomarkers — connected by AI and reviewed by clinicians.",
  alternates: { canonical: "/precision-health/bioaro-labs/" },
};

export default function LabsPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["Precision Health", "/precision-health/"], ["BioAro Labs", "/precision-health/bioaro-labs/"]])} />
      <PageHero eyebrow="Precision Health · BioAro Labs" title={<>Your biology, <AuroraText>read by AI.</AuroraText></>}
        lede="Genome, biomarkers and microbiome — measured in CLIA-registered labs, connected by BioAro Intelligence and explained in plain language." />
      <Section ai="BioAro Labs" className="!pt-0"><div className="container-x"><LabsHub /></div></Section>
    </>
  );
}
