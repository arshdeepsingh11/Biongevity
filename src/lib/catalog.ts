import { PACKAGES } from "@/data/health";
import { HEALTH_PACKAGES, LAB_TESTS, LAB_COLLECTIONS } from "@/data/labs";
import { DRUG_PRODUCTS, DRUG_COLLECTIONS } from "@/data/drugs";
import type { IconName } from "@/components/ui/icons";

/** One product model for every layer of the store: programs, packages, tests and formulas. */
export type Kind = "program" | "package" | "test" | "formula";
export interface ShopItem {
  id: string; kind: Kind; title: string; price: number; icon: IconName; summary: string;
  category: string; billing: "term" | "one-time"; tags: string[];
  url?: string; handle: string; includes?: string[]; next: string[]; featured?: boolean;
}

export const KIND_META: Record<Kind, { label: string; plural: string; icon: IconName; blurb: string }> = {
  program: { label: "Program", plural: "Longevity programs", icon: "crown", blurb: "Diagnostics, AI coach, app and bioactives — 3, 6 or 12 months." },
  package: { label: "Package", plural: "Health packages", icon: "box", blurb: "Clinic visit + imaging + advanced labs in one booking." },
  test: { label: "Test", plural: "Lab tests", icon: "test-tubes", blurb: "Single BioAro Labs tests — at home or by blood draw." },
  formula: { label: "Formula", plural: "Formulas", icon: "tablets", blurb: "Transparent BioAro Drugs bioactives." },
};

const genomic = (cat: string) => cat === "genome-sequencing";

export const CATALOG: ShopItem[] = [
  ...PACKAGES.map((p): ShopItem => ({
    id: `program:${p.handle}`, kind: "program", title: p.name, price: p.price, icon: p.handle === "elite" ? "crown" : p.handle === "precision" ? "gem" : "sparkle",
    summary: p.diagnostics[0], category: "Longevity programs", billing: "term", tags: ["program", "longevity", ...p.diagnostics.join(" ").toLowerCase().split(/\W+/)],
    handle: p.handle, includes: [...p.diagnostics.slice(0, 4), p.ai[0], p.app[0], `Bioactives: ${p.bioactives}`], featured: p.featured,
    next: ["Care team confirms your start date", "Baseline sampling (home kit or clinic)", "Results reviewed by a clinician", "Plan, AI coach and app go live", "Re-test at the end of your term"],
  })),
  ...HEALTH_PACKAGES.map((p): ShopItem => ({
    id: `package:${p.id}`, kind: "package", title: p.t, price: p.price, icon: p.icon, summary: p.best, category: "Health packages", billing: "one-time",
    tags: ["package", ...p.clinic, ...p.labs].map((x) => x.toLowerCase()), handle: `pkg-${p.id}`, includes: [...p.clinic, ...p.labs.map((l) => `Lab: ${l}`), p.output],
    next: ["Care team confirms clinic time and quote", "Clinic visit and sample collection", "Lab results in 1–6 weeks depending on tests", "One connected report with your physician"],
  })),
  ...LAB_TESTS.map((t): ShopItem => ({
    id: `test:${t.handle}`, kind: "test", title: t.title, price: t.price, icon: t.icon, summary: t.bestFor ?? t.summary,
    category: LAB_COLLECTIONS.find((c) => c.handle === t.category)?.title ?? "Lab tests", billing: "one-time", tags: [t.category, (t.bestFor ?? "").toLowerCase()],
    url: t.url, handle: t.handle,
    next: genomic(t.category) ? ["Order — some genomic tests need a prescription", "Collection kit or blood draw", "Sequencing: 4–6 weeks", "Results reviewed with a clinician"] : ["Order online", "Home kit or blood draw", "Laboratory analysis", "Secure results, explained in plain language"],
  })),
  ...DRUG_PRODUCTS.map((p): ShopItem => ({
    id: `formula:${p.handle}`, kind: "formula", title: p.title, price: p.price, icon: p.icon, summary: p.summary,
    category: DRUG_COLLECTIONS.find((c) => c.handle === p.category)?.title ?? "Formulas", billing: "one-time", tags: [...(p.goals ?? []), p.tagline?.toLowerCase() ?? ""],
    url: p.url, handle: p.handle, includes: p.ingredients?.map((i) => `${i.name} ${i.amount}`), next: ["Order online", "Ships to your door", p.directions ?? "Take as directed on the label"],
  })),
];

export const itemById = (id: string) => CATALOG.find((i) => i.id === id);
