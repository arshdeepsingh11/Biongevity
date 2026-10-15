"use client";
import type { ChartSpec } from "@/data/stats";
import { BarList, Columns, Donut, Waffle } from "./Charts";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";

/** Renders a data-driven ChartSpec (from src/data/stats.ts) with its title and source. */
export function EvidenceChart({ spec, compact }: { spec: ChartSpec; compact?: boolean }) {
  const fmt = "format" in spec && spec.format ? (v: number) => `${v}${spec.format}` : undefined;
  return (
    <figure>
      <figcaption className="mb-3 text-[13px] font-semibold text-ink">{spec.title}</figcaption>
      {spec.kind === "bars" && <BarList data={spec.data} unit={spec.unit} format={fmt} />}
      {spec.kind === "waffle" && <Waffle of={spec.of} hit={spec.hit} label="Each square ≈ 1 in 30 people" />}
      {spec.kind === "donut" && <Donut data={spec.data} center={spec.center} sub={spec.sub} size={compact ? 140 : 170} />}
      {spec.kind === "columns" && <Columns data={spec.data} unit={spec.unit} highlight={spec.highlight} height={compact ? 110 : 150} />}
      <div className="mt-3 text-[10.5px] text-faint">Source: {spec.src}{"illustrative" in spec && spec.illustrative ? " · illustrative" : ""}</div>
    </figure>
  );
}
