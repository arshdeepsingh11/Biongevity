"use client";
import { TEST_INTEL, goalMatch, RETEST_LABEL, type GoalId } from "@/lib/testIntel";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { BuyButton, StoreNote } from "@/components/commerce/BuyButton";
import { EvidencePill } from "./EvidencePill";

/** Department → the goals its patients usually bring (drives the on-device test match). */
const DEPT_GOALS: Record<string, GoalId[]> = {
  cardiology: ["heart"], "heart-failure": ["heart"], "internal-medicine": ["ageing", "metabolic"], endocrinology: ["metabolic", "hormones"],
  "respiratory-medicine": ["sleep"], "geriatric-medicine": ["brain", "ageing"], nutrition: ["metabolic", "ageing"], "skin-health": ["gut"],
  "womens-health": ["hormones"], "mens-health": ["hormones"], "gut-health": ["gut"], dental: ["gut"], "mental-health": ["sleep"],
};
const SKIN = /bioskin/i, DENTAL = /biodental/i;
