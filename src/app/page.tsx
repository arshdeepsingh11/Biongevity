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
import { Head, BrandFilm, StoriesSection, GlobalClinic, FinalCTA } from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <AIHero />
      <Section ai="Fusion engine" className="bg-canvas/50">
        <div className="container-x">
          <Head n="01" label="Data fusion engine" title={<>Five streams. <AuroraText>One intelligence.</AuroraText></>} lede="Every signal — from your genome to your blood pressure — flows into one record that AI reads as a whole, measured against your own baseline. Hover any node for the data; click it and Xevyo answers." />
          <div className="mt-10"><FusionEngine /></div>
        </div>
      </Section>
      <Section ai="Biomarker constellation" id="constellation">
        <div className="container-x">
          <Head n="02" label="Biomarker constellation" title={<>Every marker is <AuroraText>connected.</AuroraText></>} lede="Seventeen biomarkers, eight body systems, fourteen departments. Trace how one number touches the rest of your health — with reference ranges and the research behind them." />
          <div className="mt-10"><Constellation /></div>
        </div>
      </Section>
      <Section ai="Longevity simulator" className="bg-canvas/50">
        <div className="container-x">
          <Head n="03" label="Longevity simulator" title={<>Habits, measured <AuroraText>in years.</AuroraText></>} lede="Toggle the five low-risk habits and move the sliders. Built on peer-reviewed cohort studies and meta-analyses — every number is sourced." />
          <div className="mt-10"><LifespanSimulator /></div>
        </div>
      </Section>
      <Section ai="Department intelligence">
        <div className="container-x">
          <Head n="04" label="Department intelligence" title={<>Fourteen departments. <AuroraText>One record.</AuroraText></>} lede="Type a symptom or goal and AI ranks the departments live. Hover a tile for services; ask AI from any of them." />
          <div className="mt-10"><DeptIntelligence /></div>
        </div>
      </Section>
      <Section ai="Goal pipeline" className="bg-canvas/50">
        <div className="container-x">
          <Head n="05" label="From goal to plan" title={<>Measure. Support. <AuroraText>Care.</AuroraText></>} lede="Pick a goal and watch it resolve into a BioAro test, what it reveals, a matching formula, a program and the right care team." />
          <div className="mt-10"><GoalPipeline /></div>
        </div>
      </Section>
      <Section ai="Xevyo everywhere">
        <div className="container-x">
          <Head n="06" label="Xevyo everywhere" title={<>Beyond the chat. <AuroraText>AI in every step.</AuroraText></>} lede="The same AI that answers your questions also powers your digital twin, free health tools and BioELR — the record system clinics use." />
          <div className="mt-10"><AIEverywhere /></div>
        </div>
      </Section>
      <BrandFilm />
      <StoriesSection />
      <GlobalClinic />
      <FinalCTA />
    </>
  );
}
