import type { Faq, ServiceFacts } from "../../types";

/** Arabic text for one service (same shape and list lengths as the English service). */
export interface ServiceAr { name: string; short: string; about: string; forWho: string[]; includes: string[]; facts?: ServiceFacts; faqs?: Faq[] }

/** Arabic text for one department, keyed by group id and service slug. Checked for completeness by tests. */
export interface DeptAr {
  name: string; short: string; tagline: string; intro: string; longevity: string;
  why: { t: string; d: string }[]; steps: { t: string; d: string }[]; faqs: Faq[];
  groups: Record<string, { name: string; intro?: string }>;
  services: Record<string, ServiceAr>;
}
