"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATALOG, KIND_META, type Kind, type ShopItem } from "@/lib/catalog";
import { tokens } from "@/lib/intent";
import { useCart } from "./CartProvider";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn, formatMoney } from "@/lib/utils";

/** Goal chips — each expands into the words the on-device matcher looks for. */
const GOALS = [
  { label: "Heart", icon: "heart", q: "heart crp lipid cardiology cholesterol" },
  { label: "Energy", icon: "bolt", q: "energy fatigue thyroid vitamin cortisol nad glutathione" },
  { label: "Ageing well", icon: "hourglass", q: "aging longevity telomere epigenetic" },
  { label: "Hormones", icon: "flask", q: "hormone testosterone estradiol thyroid" },
  { label: "Gut", icon: "gut", q: "gut microbiome biogut digestion" },
  { label: "Sleep & stress", icon: "moon", q: "sleep stress cortisol calm" },
  { label: "Brain", icon: "brain", q: "brain memory cognitive focus" },
  { label: "My DNA", icon: "dna", q: "genome genetic sequencing pharmacogenomics" },
];

/** Tells the catalogue further down to show a kind (or a search) and scrolls to it. */
export const browse = (kind: Kind | "all", q = "") => {
  window.dispatchEvent(new CustomEvent("shop:browse", { detail: { kind, q } }));
  document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Everyday words → the goal they usually mean, so "I'm always tired" finds energy, not random text matches. */
const MEANS: [RegExp, string][] = [
  [/tired|fatigu|exhaust|energy|sluggish|drained/, "Energy"], [/sleep|insomnia|stress|anxi|burnout|calm/, "Sleep & stress"],
  [/heart|cholesterol|blood pressure|cardio|chest/, "Heart"], [/memory|focus|brain|fog|forget|concentrat/, "Brain"],
  [/gut|bloat|digest|stomach|ibs|constipat/, "Gut"], [/hormon|menopaus|testosterone|libido|thyroid|period/, "Hormones"],
  [/aging|ageing|older|longevity|wrinkle|age well|live longer/, "Ageing well"], [/dna|gene|genetic|family history|inherit/, "My DNA"],
];
const FILLER = new Set(["feel", "feeling", "time", "always", "want", "more", "better", "really", "like", "make", "need", "help", "very", "much", "lot", "lately", "every", "days"]);
const expand = (q: string) => {
  const lower = q.toLowerCase(), extra = MEANS.filter(([r]) => r.test(lower)).map(([, g]) => GOALS.find((x) => x.label === g)!.q);
  return [...lower.split(/\s+/).filter((w) => !FILLER.has(w)), ...extra].join(" ");
};

const hay = (i: ShopItem) => `${i.title} ${i.summary} ${i.category} ${i.tags.join(" ")} ${(i.includes ?? []).join(" ")}`.toLowerCase();

/** One pick per kind first (test → formula → package → program), so the answer reads like a plan, not a list. */
function pick(q: string) {
  const t = tokens(expand(q));
  if (!t.length) return { t, items: CATALOG.filter((i) => i.featured || i.kind === "package").slice(0, 4), hits: new Map<string, string[]>() };
  const hits = new Map<string, string[]>();
  const ranked = CATALOG.map((i) => {
    const h = hay(i), w = t.filter((x) => new RegExp(`\\b${x.replace(/[^a-z0-9-]/g, "")}`).test(h));
    hits.set(i.id, w);
    return { i, s: w.reduce((a, x) => a + (x.length > 5 ? 2 : 1), 0) };
  }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s || a.i.price - b.i.price);
  const out: ShopItem[] = [];
  for (const k of ["test", "formula", "package", "program"] as Kind[]) { const r = ranked.find((x) => x.i.kind === k); if (r) out.push(r.i); }
  for (const r of ranked) if (out.length < 3 && !out.includes(r.i)) out.push(r.i);
  return { t, items: out.slice(0, 4), hits };
}
