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
