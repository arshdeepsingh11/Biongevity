import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { AIBadge } from "@/components/ai/AIBadge";
import { CarePlanBuilder } from "@/components/plan/CarePlanBuilder";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "12-month care plan builder — tests, re-tests, formulas and visits in CAD",
  description: "Pick a goal and Biongevity SI assembles a 12-month plan: BioAro Labs tests and re-test dates, a BioAro Drugs formula, the right department and a total in CAD. Download it, add reminders, or send it to the clinic for approval.",
  alternates: { canonical: "/plan/" },
};

export default function PlanPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["Care plan", "/plan/"]])} />
      <PageHero eyebrow="Care plan builder" ai="Care plan builder" title={<>From one goal to <AuroraText>a 12-month plan.</AuroraText></>}
        lede="Pick what matters most. Your plan assembles on your device: baseline tests, re-test dates, the department visit, a formula and a program — with a total in CAD. A clinician approves before anything is ordered.">
        <div className="flex flex-wrap gap-2"><AIBadge label="Built on your device" /><AIBadge label="Clinician approves" /><AIBadge label="PDF · calendar · send" /></div>
      </PageHero>
      <Section ai="Care plan" className="!pt-0" chip={false}><div className="container-x"><CarePlanBuilder /></div></Section>
    </>
  );
}
