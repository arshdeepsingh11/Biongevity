import { TEST_INTEL, goalMatch, type GoalId, type TestIntel } from "./testIntel";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { PACKAGES } from "@/data/health";
import { DEPARTMENTS } from "@/data/departments";
import { LIFE_EXPECTANCY, STEPS_RISK } from "@/data/intelligence";
import type { CatalogProduct } from "@/data/types";

/**
 * AI Healthspan Scan — answers → an educational, on-device profile.
 * Transparent rules only (no AI call). Every number is either a published population figure (with source)
 * or a lifestyle estimate clearly labelled "Educational estimate". Xevyo explains the result on request.
 */
export type Opt = { v: string; label: string; sub?: string };
export interface Question { id: keyof Answers; q: string; help?: string; multi?: boolean; options: Opt[] }
