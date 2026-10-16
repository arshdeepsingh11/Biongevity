import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { HealthspanScan } from "@/components/scan/HealthspanScan";
import { AIBadge } from "@/components/ai/AIBadge";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Healthspan Scan — 2 minutes, 9 health domains, your test plan",
  description: "Answer 12 one-tap questions. See a radar of 9 health domains, sourced population charts, the BioAro Labs tests that fit you and a 12-month re-test plan. Runs on your device.",
  alternates: { canonical: "/scan/" },
};

export default function ScanPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["AI Healthspan Scan", "/scan/"]])} />
      <Section ai="AI Healthspan Scan" chip={false} className="pt-[calc(96px+var(--safe-top))] sm:pt-[128px]">
        <div className="container-x">
          <div className="mx-auto mb-8 max-w-[760px] text-center">
            <div className="flex justify-center gap-2"><AIBadge label="AI Healthspan Scan" /><AIBadge label="2 minutes" /></div>
            <h1 className="h-display mt-5">Know where <span className="text-ai-grad">to start.</span></h1>
            <p className="lede mx-auto mt-4 max-w-[56ch]">Twelve one-tap questions. Your answers stay on this device; Biongevity SI explains the result only if you ask.</p>
          </div>
          <HealthspanScan />
        </div>
      </Section>
    </>
  );
}
