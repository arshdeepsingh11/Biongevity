import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { JournalList } from "@/components/pages/JournalList";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <>
      <PageHero eyebrow="Journal" title="Learn with us." lede="Longevity, genomics, the microbiome and AI — explained plainly, with key points you can scan in seconds." />
      <Section ai="Articles" className="!pt-0"><div className="container-x"><JournalList /></div></Section>
    </>
  );
}
