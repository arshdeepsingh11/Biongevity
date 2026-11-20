import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { FusionEngine } from "@/components/home/FusionEngine";
import { Constellation } from "@/components/home/Constellation";
import { LifespanSimulator } from "@/components/home/LifespanSimulator";
import { DeptIntelligence } from "@/components/home/DeptIntelligence";
import { GoalPipeline } from "@/components/home/GoalPipeline";
import { AIEverywhere } from "@/components/home/AIEverywhere";
import { EvidenceBoard } from "@/components/home/EvidenceBoard";
import { Ecosystem } from "@/components/home/Ecosystem";
import { StartHere } from "@/components/home/StartHere";
import { TestsIn3D } from "@/components/fx3d/TestsIn3D";
import { Reveal } from "@/components/motion/Reveal";
import { Em, Head } from "@/components/home/HomeSections";
import { BookBand } from "@/components/ui/BookNow";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Explore the science — interactive tools",
  description: "Interactive charts, the biomarker constellation, the longevity simulator, the 3D body and the BioAro test book — every number sourced, explained by Biongevity SI.",
  alternates: { canonical: "/explore/" },
};

/** The tool inside each section eases in after its heading. */
function Body({ children }: { children: React.ReactNode }) {
  return <Reveal delay={120} className="mt-12">{children}</Reveal>;
}

/** The interactive side of Biongevity: the AI tools that used to fill the home page, in one place. */
export default function ExplorePage() {
  return (
    <>
      <JsonLd data={breadcrumb([["Explore", "/explore/"]])} />
      <PageHero eyebrow="Explore the science" title={<>See how your biology <span className="text-ai-grad">connects.</span></>}
        lede="Interactive charts, a 3D body, a longevity simulator and the BioAro test book — every number with its source, and Biongevity SI to explain it." />
      <Section ai="Start here" className="!pt-0">
        <div className="container-x">
          <Head n="01" label="Start here" title={<>Two minutes to <Em>your starting point.</Em></>} lede="Take the AI Healthspan Scan for yourself — or plan care for a parent. Both run on your device; Biongevity SI explains the result when you ask." />
          <Body><StartHere /></Body>
        </div>
      </Section>
      <Section ai="AI evidence board" className="bg-canvas/50">
        <div className="container-x">
          <Head n="02" label="AI evidence board" title={<>What the research says, <Em>in four charts.</Em></>} lede="Published findings from large studies, drawn as charts. Every chart has an AI insight and an Explain button — Biongevity SI walks you through it." />
          <Body><EvidenceBoard /></Body>
        </div>
      </Section>
      <Section ai="Fusion engine" className="bg-canvas/50">
        <div className="container-x">
          <Head n="03" label="Data fusion engine" title={<>Five streams. <Em>One intelligence.</Em></>} lede="Every signal — from your genome to your blood pressure — flows into one record that AI reads as a whole, measured against your own baseline. Hover any node for the data; click it and Biongevity SI answers." />
          <Body><FusionEngine /></Body>
        </div>
      </Section>
      <Section ai="Biomarker constellation" id="constellation">
        <div className="container-x">
          <Head n="04" label="Biomarker constellation" title={<>Every marker is <Em>connected.</Em></>} lede="Seventeen biomarkers, eight body systems, fourteen departments. Trace how one number touches the rest of your health — with reference ranges and the research behind them." />
          <Body><Constellation /></Body>
        </div>
      </Section>
      <Section ai="Longevity simulator" className="bg-canvas/50">
        <div className="container-x">
          <Head n="05" label="AI Longevity Lab" title={<>Your week, <Em>read by AI.</Em></>} lede="Describe your week in your own words or turn the dials. See the healthy years on the table, your risk from sleep, blood pressure and steps — and where each habit acts in the body. Every number is sourced." />
          <Body><LifespanSimulator /></Body>
        </div>
      </Section>
      <Section ai="Department intelligence">
        <div className="container-x">
          <Head n="06" label="Department intelligence" title={<>Fourteen departments. <Em>One body.</Em></>} lede="Turn the 3D body and tap a part — or describe a symptom. Biongevity SI finds the department, shows the evidence and the test that fits." />
          <Body><DeptIntelligence /></Body>
        </div>
      </Section>
      <Section ai="Goal pipeline" className="bg-canvas/50">
        <div className="container-x">
          <Head n="07" label="From goal to plan" title={<>Measure. Support. <Em>Care.</Em></>} lede="Pick a goal and watch it resolve into a BioAro test, what it reveals, a matching formula, a program and the right care team." />
          <Body><GoalPipeline /></Body>
        </div>
      </Section>
      <Section ai="Biongevity SI everywhere">
        <div className="container-x">
          <Head n="08" label="Biongevity SI everywhere" title={<>Beyond the chat. <Em>AI in every step.</Em></>} lede="The same AI that answers your questions also powers your digital twin, free health tools and BioELR — the record system clinics use." />
          <Body><AIEverywhere /></Body>
        </div>
      </Section>
      <Section ai="BioAro ecosystem" className="bg-canvas/50">
        <div className="container-x">
          <Head n="09" label="Ecosystem" title={<>One AI across <Em>the BioAro family.</Em></>} lede="Labs, formulas, the member app, clinic software and partner care — each with its own site, all connected by Biongevity SI here." />
          <Body><Ecosystem /></Body>
        </div>
      </Section>
      <Section ai="BioAro tests in 3D" id="tests-3d">
        <div className="container-x">
          <Head n="10" label="BioAro test book" title={<>Every test, <Em>in one book.</Em></>} lede="Pick a category and turn the pages: every BioAro Labs test with its photo, what it measures and its price in CAD — buy on bioarolabs.com, or ask Biongevity SI." />
          <Reveal delay={120} className="mt-8"><TestsIn3D compact /></Reveal>
        </div>
      </Section>
      <BookBand text="Hi Biongevity, I explored the tools and would like to book." />
    </>
  );
}
