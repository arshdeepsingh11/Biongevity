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
