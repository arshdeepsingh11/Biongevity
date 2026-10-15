import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { FamilyPlanner, FamilyViewDemo } from "@/components/family/FamilyCare";
import { AIPanel } from "@/components/ai/AIPanel";
import { AIBadge } from "@/components/ai/AIBadge";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Caring for a parent — AI family care planner",
  description: "For adult children looking after an ageing parent: an AI checklist, the right tests and specialists, virtual visits and a permissioned family view in the Biongevity app.",
  alternates: { canonical: "/family/" },
};
