"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LAB_COLLECTIONS, LAB_TESTS } from "@/data/labs";
import type { CatalogProduct } from "@/data/types";
import { GOAL_TAGS, TEST_INTEL, goalMatch, RETEST_LABEL, type GoalId } from "@/lib/testIntel";
import { Icon } from "@/components/ui/Icon";
import { Tilt } from "@/components/fx3d/HoverGallery3D";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { BuyButton } from "@/components/commerce/BuyButton";
import { EvidencePill } from "@/components/labs/EvidencePill";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn, formatMoney } from "@/lib/utils";

/* Hero artwork per category — drawn, so it follows the theme. A real product photo (t.image) replaces it when set. */
function Motif({ cat }: { cat: string }) {
  const s = { stroke: "rgb(var(--c-ai))", fill: "none", strokeWidth: 2.2, strokeLinecap: "round" as const };
  switch (cat) {
    case "genome-sequencing":
      return <g>{Array.from({ length: 11 }, (_, i) => { const y = 18 + i * 10, a = Math.sin(i * 0.75) * 26; return <g key={i}><line x1={120 - a} y1={y} x2={120 + a} y2={y} style={{ stroke: "rgb(var(--c-ai-2) / .45)" }} strokeWidth="2" /><circle cx={120 - a} cy={y} r="4" style={{ fill: "rgb(var(--c-ai))" }} /><circle cx={120 + a} cy={y} r="4" style={{ fill: "rgb(var(--c-ai-hi))" }} /></g>; })}</g>;
    case "microbiome":
      return <g>{[[70, 50, 16], [120, 40, 22], [165, 70, 14], [95, 95, 18], [150, 112, 12], [60, 110, 10], [190, 40, 9]].map(([x, y, r], i) => <g key={i}><ellipse cx={x} cy={y} rx={r * 1.4} ry={r} transform={`rotate(${i * 37} ${x} ${y})`} style={{ fill: `rgb(var(--c-ai${i % 2 ? "-hi" : ""}) / .28)`, stroke: "rgb(var(--c-ai) / .6)" }} />{[0, 1, 2].map((k) => <circle key={k} cx={x - r / 2 + k * (r / 2)} cy={y} r="1.8" style={{ fill: "rgb(var(--c-ai))" }} />)}</g>)}</g>;
    case "brain-aging-neurodegeneration":
      return <g><path d="M120 22c-28 0-48 18-48 44 0 14 6 24 14 30 0 14 12 24 26 24h16c14 0 26-10 26-24 8-6 14-16 14-30 0-26-20-44-48-44z" {...s} /><path d="M120 22v98M96 46c10 4 14 12 12 22M144 46c-10 4-14 12-12 22M90 84c10-2 18 2 22 10M150 84c-10-2-18 2-22 10" {...s} strokeWidth="1.6" />{[[100, 60], [140, 60], [110, 98], [132, 98]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.2" style={{ fill: "rgb(var(--c-ai-hi))" }} />)}</g>;
    case "hormone-steroid-balance":
      return <g>{[[90, 50], [118, 34], [146, 50], [146, 82], [118, 98], [90, 82]].map(([x, y], i, a) => <line key={i} x1={x} y1={y} x2={a[(i + 1) % 6][0]} y2={a[(i + 1) % 6][1]} {...s} />)}{[[146, 82], [174, 66], [174, 98], [146, 114]].map(([x, y], i, a) => i < 3 && <line key={`b${i}`} x1={x} y1={y} x2={a[i + 1][0]} y2={a[i + 1][1]} {...s} />)}<circle cx="118" cy="66" r="7" style={{ fill: "rgb(var(--c-ai-hi) / .5)" }} /><text x="62" y="54" fontSize="12" style={{ fill: "rgb(var(--c-ai))" }} fontWeight="700">OH</text></g>;
    case "vitamin-nutritional-status":
      return <g>{[[80, 50, -30], [130, 40, 20], [100, 95, 60], [160, 90, -10]].map(([x, y, r], i) => <g key={i} transform={`rotate(${r} ${x} ${y})`}><rect x={x - 26} y={y - 11} width="52" height="22" rx="11" style={{ fill: "rgb(var(--c-surface))", stroke: "rgb(var(--c-ai) / .5)" }} /><rect x={x} y={y - 11} width="26" height="22" rx="11" style={{ fill: `rgb(var(--c-ai${i % 2 ? "-2" : "-hi"}) / .8)` }} /></g>)}<text x="56" y="128" fontSize="13" fontWeight="800" style={{ fill: "rgb(var(--c-ai) / .7)" }}>A · D · E · K</text></g>;
    case "inflammation-biological-aging":
      return <g><path d="M30 100 Q60 60 90 92 T150 80 T210 60" {...s} /><path d="M30 112 Q70 90 110 104 T210 90" {...s} style={{ stroke: "rgb(var(--c-ai-hi) / .7)" }} />{[50, 90, 130, 170].map((x, i) => <g key={i}><circle cx={x} cy={44 + (i % 2) * 14} r={10 - i} style={{ fill: "rgb(var(--c-warn) / .18)", stroke: "rgb(var(--c-warn) / .55)" }} /><circle cx={x} cy={44 + (i % 2) * 14} r="2.5" style={{ fill: "rgb(var(--c-warn))" }} /></g>)}</g>;
    case "vascular-organ-stress":
      return <g><path d="M40 80 C80 40 100 120 140 70 S200 60 210 90" {...s} strokeWidth="9" style={{ stroke: "rgb(var(--c-artery) / .35)" }} /><path d="M40 80 C80 40 100 120 140 70 S200 60 210 90" {...s} strokeWidth="2" />{[60, 100, 140, 180].map((x, i) => <circle key={i} cx={x} cy={i % 2 ? 84 : 66} r="4" style={{ fill: "rgb(var(--c-artery))" }} />)}<path d="M150 104c8-10 24-10 28 2 4 12-8 22-14 26-6-4-18-14-14-28z" {...s} /></g>;
    case "amino-acids-metabolism":
      return <g>{Array.from({ length: 8 }, (_, i) => { const x = 40 + i * 24, y = 70 + Math.sin(i) * 24; return <g key={i}>{i < 7 && <line x1={x} y1={y} x2={x + 24} y2={70 + Math.sin(i + 1) * 24} {...s} />}<circle cx={x} cy={y} r="9" style={{ fill: `rgb(var(--c-ai${i % 2 ? "" : "-hi"}) / .3)`, stroke: "rgb(var(--c-ai))" }} /></g>; })}</g>;
    case "biological-aging-healthspan-panels":
      return <g><path d="M96 24h48M96 116h48M100 24c0 26 40 30 40 46s-40 20-40 46M140 24c0 26-40 30-40 46s40 20 40 46" {...s} /><path d="M108 104c4-8 20-8 24 0z" style={{ fill: "rgb(var(--c-ai-hi) / .7)" }} />{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${170 + (i % 2) * 18} ${36 + i * 22})`}><rect x="-3" y="-9" width="6" height="18" rx="3" style={{ fill: "rgb(var(--c-ai) / .55)" }} /><rect x="-3" y={-9 - (4 - i) * 2} width="6" height={(4 - i) * 2} rx="2" style={{ fill: "rgb(var(--c-ai-hi))" }} /></g>)}</g>;
    default:
      return <g><circle cx="120" cy="70" r="40" {...s} /><path d="M120 30v80M80 70h80" {...s} /></g>;
  }
}

const seed = (h: string) => [...h].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
export function TestHero({ t, className }: { t: CatalogProduct; className?: string }) {
  const id = `sh-${t.handle}`, k = seed(t.handle), rot = (k % 24) - 12, dx = (k % 40) - 20, sc = 0.86 + ((k >> 3) % 20) / 100;
  if (t.image) return <img src={t.image} alt="" className={cn("h-full w-full object-cover", className)} loading="lazy" />;
  return (
    <svg viewBox="0 0 240 150" className={cn("h-full w-full", className)} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: "rgb(var(--c-surface))" }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai-soft))" }} /></linearGradient>
        <radialGradient id={`${id}-glow`} cx=".5" cy=".45" r=".55"><stop offset="0" style={{ stopColor: "rgb(var(--c-ai-hi))", stopOpacity: 0.35 }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai-hi))", stopOpacity: 0 }} /></radialGradient>
      </defs>
      <rect width="240" height="150" fill={`url(#${id}-bg)`} />
      <rect width="240" height="150" fill={`url(#${id}-glow)`} />
      <g transform={`translate(${dx} 0) rotate(${rot} 120 70) translate(120 70) scale(${sc}) translate(-120 -70)`}><g className="origin-center transition-transform duration-700 group-hover:scale-[1.06]"><Motif cat={t.category} /></g></g>
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={(k >> i) % 240} cy={((k >> (i + 2)) % 120) + 8} r={1.2 + (i % 3)} style={{ fill: "rgb(var(--c-ai-hi) / .35)" }} />)}
      <path d="M0 128 C70 112 150 146 240 120 L240 150 L0 150 Z" style={{ fill: "rgb(var(--c-ai-2) / .10)" }} />
    </svg>
  );
}
