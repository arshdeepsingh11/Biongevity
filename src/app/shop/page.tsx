import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { ShopTabs } from "@/components/shop/ShopTabs";

export const metadata: Metadata = { title: "Shop", description: "Biongevity longevity programs, BioAro Labs tests and BioAro Drugs formulas — compared, charted and matched to your goals." };

export default function ShopPage() {
  return (
    <>
      <PageHero eyebrow="Shop · Biongevity × BioAro" title={<>Measure. Support. <AuroraText>Track.</AuroraText></>}
        lede="Longevity programs, clinical-grade lab tests and transparent formulas in one place — with a 2-minute quiz that ranks what fits you. Checkout happens on the official store." />
      <Section ai="Shop" className="!pt-0"><div className="container-x"><ShopTabs /></div></Section>
    </>
  );
}
