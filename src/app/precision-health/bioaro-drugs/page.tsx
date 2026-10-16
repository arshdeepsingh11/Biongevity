import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { DrugsHub } from "@/components/bioaro/DrugsHub";
import { ProtocolStudio } from "@/components/drugs/ProtocolStudio";
import { JsonLd, breadcrumb } from "@/lib/seo";
import { FormulaCoins } from "@/components/fx3d/Showcases";
import { Head } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "BioAro Drugs — AI-guided bioactive protocols",
  description: "Transparent bioactive formulas — LONgevity+ NAD+ booster, glutathione, creatine and omega blends — matched to your goals by AI, with every ingredient and dose shown.",
  alternates: { canonical: "/precision-health/bioaro-drugs/" },
};

export default function DrugsPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["Precision Health", "/precision-health/"], ["BioAro Drugs", "/precision-health/bioaro-drugs/"]])} />
      <PageHero eyebrow="Precision Health · BioAro Drugs" title={<>Protocols built <AuroraText>by AI.</AuroraText></>}
        lede="Tell the AI your goals and routine. Get a transparent, evidence-informed protocol — every ingredient, every dose, every reason." />
      <Section ai="AI Protocol Studio" id="studio" className="!pt-0 scroll-mt-20" chip={false}><div className="container-x"><ProtocolStudio /></div></Section>
      <Section ai="Formulas in 3D" id="coins" className="!pt-0 scroll-mt-20" chip={false}>
        <div className="container-x">
          <Head n="3D" label="Formulas in 3D" title={<>Every formula, <AuroraText>in glass.</AuroraText></>} lede="The coins turn on their own and flip to show what each formula is for. Tap one to see its ingredients, price in CAD and ask Biongevity SI about it." />
          <div className="mt-8"><FormulaCoins /></div>
        </div>
      </Section>
      <Section ai="BioAro Drugs" className="!pt-0"><div className="container-x"><DrugsHub /></div></Section>
    </>
  );
}
