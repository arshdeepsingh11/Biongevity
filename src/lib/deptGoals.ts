import type { GoalId } from "@/lib/testIntel";

/** Department → the goals its patients usually bring (drives the on-device test match). */
export const DEPT_GOALS: Record<string, GoalId[]> = {
  cardiology: ["heart"], "heart-failure": ["heart"], "internal-medicine": ["ageing", "metabolic"], endocrinology: ["metabolic", "hormones"],
  "respiratory-medicine": ["sleep"], "geriatric-medicine": ["brain", "ageing"], nutrition: ["metabolic", "ageing"], "skin-health": ["gut"],
  "womens-health": ["hormones"], "mens-health": ["hormones"], "gut-health": ["gut"], dental: ["gut"], "mental-health": ["sleep"],
};
/** Whether a department has an adult test match (pediatric departments intentionally do not). Safe to call on the server. */
export const deptHasTests = (dept: string) => Boolean(DEPT_GOALS[dept]);
