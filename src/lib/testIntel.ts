import { LAB_TESTS, LAB_COLLECTIONS } from "@/data/labs";
import type { CatalogProduct } from "@/data/types";

/**
 * Test intelligence — a transparent, on-device "test utility score" for every BioAro Labs test
 * (spec section 13: evidence, actionability, cost, redundancy). No AI call; weights are shown in the UI.
 */
export type Evidence = "Clinically validated" | "Supportive evidence" | "Exploratory";
export const EVIDENCE_SCORE: Record<Evidence, number> = { "Clinically validated": 1, "Supportive evidence": 0.65, Exploratory: 0.35 };
