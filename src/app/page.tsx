import { Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { AIHero } from "@/components/home/AIHero";
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
import { Head, BrandFilm, StoriesSection, GlobalClinic, FinalCTA } from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <AIHero />
      <Section ai="Start here">
        <div className="container-x">
          <Head n="01" label="Start here" title={<>Two minutes to <AuroraText>your starting point.</AuroraText></>} lede="Take the AI Healthspan Scan for yourself — or plan care for a parent. Both run on your device; Biongevity SI explains the result when you ask." />
          <div className="mt-10"><StartHere /></div>
        </div>
      </Section>
      <Section ai="AI evidence board" className="bg-canvas/50">
        <div className="container-x">
          <Head n="02" label="AI evidence board" title={<>What the research says, <AuroraText>in four charts.</AuroraText></>} lede="Published findings from large studies, drawn as charts. Every chart has an AI insight and an Explain button — Xevyo walks you through it." />
          <div className="mt-10"><EvidenceBoard /></div>
        </div>
      </Section>
      <Section ai="Fusion engine" className="bg-canvas/50">
        <div className="container-x">
          <Head n="03" label="Data fusion engine" title={<>Five streams. <AuroraText>One intelligence.</AuroraText></>} lede="Every signal — from your genome to your blood pressure — flows into one record that AI reads as a whole, measured against your own baseline. Hover any node for the data; click it and Xevyo answers." />
          <div className="mt-10"><FusionEngine /></div>
        </div>
      </Section>
      <Section ai="Biomarker constellation" id="constellation">
        <div className="container-x">
          <Head n="04" label="Biomarker constellation" title={<>Every marker is <AuroraText>connected.</AuroraText></>} lede="Seventeen biomarkers, eight body systems, fourteen departments. Trace how one number touches the rest of your health — with reference ranges and the research behind them." />
          <div className="mt-10"><Constellation /></div>
        </div>
      </Section>
      <Section ai="Longevity simulator" className="bg-canvas/50">
        <div className="container-x">
          <Head n="05" label="AI Longevity Lab" title={<>Your week, <AuroraText>read by AI.</AuroraText></>} lede="Describe your week in your own words or turn the dials. See the healthy years on the table, your risk from sleep, blood pressure and steps — and where each habit acts in the body. Every number is sourced." />
          <div className="mt-10"><LifespanSimulator /></div>
        </div>
      </Section>
      <Section ai="Department intelligence">
        <div className="container-x">
          <Head n="06" label="Department intelligence" title={<>Fourteen departments. <AuroraText>One body.</AuroraText></>} lede="Turn the 3D body and tap a part — or describe a symptom. Xevyo finds the department, shows the evidence and the test that fits." />
          <div className="mt-10"><DeptIntelligence /></div>
        </div>
      </Section>
      <Section ai="Goal pipeline" className="bg-canvas/50">
        <div className="container-x">
          <Head n="07" label="From goal to plan" title={<>Measure. Support. <AuroraText>Care.</AuroraText></>} lede="Pick a goal and watch it resolve into a BioAro test, what it reveals, a matching formula, a program and the right care team." />
          <div className="mt-10"><GoalPipeline /></div>
        </div>
      </Section>
      <Section ai="Xevyo everywhere">
        <div className="container-x">
          <Head n="08" label="Xevyo everywhere" title={<>Beyond the chat. <AuroraText>AI in every step.</AuroraText></>} lede="The same AI that answers your questions also powers your digital twin, free health tools and BioELR — the record system clinics use." />
          <div className="mt-10"><AIEverywhere /></div>
        </div>
      </Section>
      <Section ai="BioAro ecosystem" className="bg-canvas/50">
        <div className="container-x">
          <Head n="09" label="Ecosystem" title={<>One AI across <AuroraText>the BioAro family.</AuroraText></>} lede="Labs, formulas, the member app, clinic software and partner care — each with its own site, all connected by Xevyo here." />
          <div className="mt-10"><Ecosystem /></div>
        </div>
      </Section>
      <BrandFilm />
      <StoriesSection />
      <GlobalClinic />
      <FinalCTA />
    </>
  );
}
