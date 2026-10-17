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
