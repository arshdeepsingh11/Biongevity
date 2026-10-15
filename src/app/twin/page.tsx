import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { Icon } from "@/components/ui/Icon";
import { AIBadge } from "@/components/ai/AIBadge";
import { AIPanel } from "@/components/ai/AIPanel";
import { PageSummary } from "@/components/ai/PageSummary";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { TwinTour } from "@/components/twin/TwinTour";
import { APP_MAP, TWIN_GLOSSARY, TWIN_PATH } from "@/data/twin";
import { DEVICES } from "@/data/platform";
import { env } from "@/lib/env";
import { JsonLd, breadcrumb, faqPage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Your Digital Twin, explained — 3D guided tour",
  description: "A guided 3D tour of the Biongevity Digital Twin: Health and Recovery scores, live monitor, body systems, trends, simulations and the AI coach — explained in plain words, then open your own twin.",
  alternates: { canonical: "/twin/" },
};
