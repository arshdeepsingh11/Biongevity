import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { LabsHub } from "@/components/bioaro/LabsHub";
import { TestNavigator } from "@/components/labs/TestNavigator";
import { TestsIn3D } from "@/components/fx3d/TestsIn3D";
import { Head } from "@/components/home/HomeSections";
import { ShopCatalog } from "@/components/labs/ShopCatalog";
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
          <Head n="01" label="Test book" title={<>Every test, <AuroraText>in one book.</AuroraText></>} lede="Pick a category and turn the pages — each test with its photo, what it measures and its CAD price. Checkout happens on bioarolabs.com; Biongevity SI explains any page." />
          <div className="mt-10"><TestsIn3D /></div>
        </div>
      </Section>
      <Section ai="Shop by category" id="shop" className="!pt-0 scroll-mt-20" chip={false}>
        <div className="container-x">
          <Head n="02" label="Shop by category" title={<>Every BioAro test, <AuroraText>by category.</AuroraText></>} lede="Each test with its icon, artwork, what it is for and its CAD price. Pick your goals and Biongevity SI lights up the best matches." />
          <div className="mt-8"><ShopCatalog /></div>
        </div>
      </Section>
      <Section ai="AI Test Navigator" id="navigator" className="!pt-0 scroll-mt-20" chip={false}><div className="container-x"><TestNavigator /></div></Section>
      <Section ai="BioAro Labs" className="!pt-0"><div className="container-x"><LabsHub /></div></Section>
    </>
  );
}
