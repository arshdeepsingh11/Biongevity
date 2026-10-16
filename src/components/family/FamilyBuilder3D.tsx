"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CONDS } from "./FamilyTree";
import { LAB_TESTS } from "@/data/labs";
import { deptById } from "@/data/departments";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn } from "@/lib/utils";

type RelId = "gp-p" | "gp-m" | "parent" | "aunt-p" | "aunt-m" | "sibling" | "partner" | "cousin" | "child" | "grandchild";
const RELS: { id: RelId; label: string; gen: number; degree: 1 | 2 | 3; side?: "p" | "m" }[] = [
  { id: "gp-p", label: "Grandparent (father's side)", gen: -2, degree: 2, side: "p" },
  { id: "gp-m", label: "Grandparent (mother's side)", gen: -2, degree: 2, side: "m" },
  { id: "parent", label: "Parent", gen: -1, degree: 1 },
  { id: "aunt-p", label: "Aunt / uncle (father's side)", gen: -1, degree: 2, side: "p" },
  { id: "aunt-m", label: "Aunt / uncle (mother's side)", gen: -1, degree: 2, side: "m" },
  { id: "sibling", label: "Brother / sister", gen: 0, degree: 1 },
  { id: "partner", label: "Partner", gen: 0, degree: 3 },
  { id: "cousin", label: "Cousin", gen: 0, degree: 3 },
  { id: "child", label: "Child", gen: 1, degree: 1 },
  { id: "grandchild", label: "Grandchild", gen: 2, degree: 2 },
];
const GEN_LABEL: Record<number, string> = { [-2]: "Grandparents", [-1]: "Parents & their siblings", 0: "Your generation", 1: "Children", 2: "Grandchildren" };

interface M { id: string; rel: RelId; name: string; age: number; sex: "f" | "m"; alive: boolean; conds: string[]; onset?: number }
const uid = () => Math.random().toString(36).slice(2, 8);
const blank = (rel: RelId, i: number): M => {
  const r = RELS.find((x) => x.id === rel)!;
  const age = { [-2]: 80, [-1]: 56, 0: 38, 1: 12, 2: 3 }[r.gen] ?? 40;
  return { id: uid(), rel, name: "", age: age + ((i * 3) % 7), sex: i % 2 ? "m" : "f", alive: true, conds: [] };
};
/** Sensible order when someone asks for N members: closest relatives first, then up the tree. */
const ORDER: RelId[] = ["parent", "parent", "gp-p", "gp-p", "gp-m", "gp-m", "sibling", "partner", "child", "child", "aunt-p", "aunt-m", "sibling", "cousin", "grandchild", "child"];
const avatar = (m: { age: number; sex: "f" | "m" }) => (m.age < 3 ? "baby" : m.age < 18 ? "person" : m.sex === "f" ? "venus" : "mars");
