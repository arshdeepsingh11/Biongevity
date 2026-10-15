"use client";
import { useMemo, useState } from "react";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { Columns, PALETTE } from "@/components/charts/Charts";
import { AIChartFrame, DoseClock, Heatmap } from "@/components/charts/AICharts";
import { BuyButton, StoreNote } from "@/components/commerce/BuyButton";

/** Key ingredients per formula (from the BioAro Drugs product descriptions) and the usual time of day. */
const KEY: Record<string, { ing: string[]; hour: number; when: string }> = {
  "longevity-plus": { ing: ["NMN", "Resveratrol", "CoQ10", "Curcumin", "Vitamin B12", "Vitamin D3"], hour: 8, when: "Breakfast, with food" },
  glutara: { ing: ["Glutathione", "Vitamin C", "Hyaluronic acid", "B vitamins", "Piperine"], hour: 9.5, when: "Morning, in water" },
  "creagen-brain-boost": { ing: ["Creatine", "Magnesium", "Vitamin B12"], hour: 12.5, when: "Midday" },
  "creagen-femme-energy": { ing: ["Creatine", "Iron", "Vitamin B12"], hour: 13, when: "Midday, with food" },
  "creagen-raw-power": { ing: ["Creatine"], hour: 17, when: "With exercise" },
  "creagen-pro-power": { ing: ["Creatine", "Beta-alanine", "Electrolytes"], hour: 17.5, when: "During or after exercise" },
  "cellomega-plus": { ing: ["Omega-3", "Antioxidants"], hour: 19, when: "Dinner, with food" },
  sleepo: { ing: ["Sleep blend"], hour: 22, when: "30 min before bed" },
};
