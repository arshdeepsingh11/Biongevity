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
