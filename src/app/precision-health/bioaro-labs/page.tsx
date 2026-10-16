import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { LabsHub } from "@/components/bioaro/LabsHub";
import { TestNavigator } from "@/components/labs/TestNavigator";
import { TestsIn3D } from "@/components/fx3d/TestsIn3D";
import { Head } from "@/components/home/HomeSections";
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
      <Section ai="Tests in 3D" id="explore-3d" className="!pt-0" chip={false}>
        <div className="container-x">
          <Head n="01" label="Explore in 3D" title={<>Every test, <AuroraText>in your hands.</AuroraText></>} lede="Spin the ring, swipe the cascade, flip the book or tap a collection on the beam circle. Biongevity SI explains any test; checkout happens on bioarolabs.com." />
          <div className="mt-10"><TestsIn3D /></div>
        </div>
      </Section>
      <Section ai="AI Test Navigator" id="navigator" className="!pt-0 scroll-mt-20" chip={false}><div className="container-x"><TestNavigator /></div></Section>
      <Section ai="BioAro Labs" className="!pt-0"><div className="container-x"><LabsHub /></div></Section>
    </>
  );
}
