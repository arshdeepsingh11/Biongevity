import { LAB_TESTS, LAB_COLLECTIONS } from "@/data/labs";
import type { CatalogProduct } from "@/data/types";

/**
 * Test intelligence — a transparent, on-device "test utility score" for every BioAro Labs test
 * (spec section 13: evidence, actionability, cost, redundancy). No AI call; weights are shown in the UI.
 */
export type Evidence = "Clinically validated" | "Supportive evidence" | "Exploratory";
export const EVIDENCE_SCORE: Record<Evidence, number> = { "Clinically validated": 1, "Supportive evidence": 0.65, Exploratory: 0.35 };

export const GOAL_TAGS = [
  { id: "heart", label: "Heart", icon: "heart" },
  { id: "metabolic", label: "Energy & weight", icon: "bolt" },
  { id: "brain", label: "Brain & memory", icon: "brain" },
  { id: "ageing", label: "Ageing well", icon: "hourglass" },
  { id: "gut", label: "Gut", icon: "gut" },
  { id: "hormones", label: "Hormones", icon: "test-tube" },
  { id: "sleep", label: "Sleep & stress", icon: "moon" },
  { id: "strength", label: "Strength & mobility", icon: "walk" },
  { id: "genes", label: "Genes & medicines", icon: "dna" },
] as const;
export type GoalId = (typeof GOAL_TAGS)[number]["id"];
