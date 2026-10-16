"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EVIDENCE, type EvidenceCard, type Grade, type Topic } from "@/data/evidence";
import { LAB_TESTS } from "@/data/labs";
import { deptById } from "@/data/departments";
import { Icon } from "@/components/ui/Icon";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";

const GRADES: Grade[] = ["High", "Moderate", "Low", "Very low"];
const G_N: Record<Grade, number> = { High: 4, Moderate: 3, Low: 2, "Very low": 1 };
const TOPICS: ("All" | Topic)[] = ["All", "Heart", "Lifestyle", "Biomarkers", "Supplements"];
const fmtN = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(n));

/** Forest-plot strip on a log scale (0.25× → 6×). Left of 1 = lower risk. */
function Forest({ r }: { r: NonNullable<EvidenceCard["ratio"]> }) {
  const x = (v: number) => ((Math.log(v) - Math.log(0.25)) / (Math.log(6) - Math.log(0.25))) * 100;
  const better = r.hi < 1, worse = r.lo > 1;
  return (
    <div className="mt-3">
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
        <div className="absolute top-1 h-6 w-px bg-ink/30" style={{ left: `${x(1)}%` }} />
        <div className={cn("absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full", better ? "bg-teal" : worse ? "bg-warn" : "bg-muted")} style={{ left: `${x(r.lo)}%`, width: `${Math.max(1, x(r.hi) - x(r.lo))}%` }} />
        <div className={cn("absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[3px] shadow-card", better ? "bg-teal" : worse ? "bg-warn" : "bg-muted")} style={{ left: `${x(r.v)}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-faint"><span>0.25×</span><span>lower risk ← 1 → higher risk</span><span>6×</span></div>
      <div className="mt-1 text-[12px]"><span className="font-semibold tabular-nums">{r.v.toFixed(2)}</span> <span className="text-muted">(95% CI {r.lo.toFixed(2)}–{r.hi.toFixed(2)}) · {r.label}</span></div>
    </div>
  );
}
