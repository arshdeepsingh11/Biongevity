import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { AIBadge } from "@/components/ai/AIBadge";
import { EvidenceEngine } from "@/components/evidence/EvidenceEngine";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Evidence engine — the studies behind every number",
  description: "Every figure on Biongevity, auditable: study design, number of studies and people, effect size with confidence interval and a GRADE certainty rating — explained by Biongevity SI.",
  alternates: { canonical: "/evidence/" },
};
