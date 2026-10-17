"use client";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { TWIN_SYSTEMS, TWIN_EXAMPLE, TWIN_PATH, STATUS_WORDS } from "@/data/twin";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

/* ── Inside the app: a working replica of the Digital Twin overview (dark, like the real screen). Example values. ── */

const C = { bg: "#0a0e13", panel: "#121820", line: "rgba(255,255,255,.07)", text: "#e9eef4", dim: "#8a96a5", good: "#4ade80", warn: "#fbbf24", accent: "#38bdf8", violet: "#a78bfa" };

type Part = "score" | "recovery" | "hrv" | "monitor" | "body" | "trends";
const PARTS: Record<Part, { t: string; icon: string; what: string; from: string; use: string }> = {
  score: { t: "Health Score", icon: "gauge", what: "One 0–100 number for your overall picture right now, across sleep, heart, metabolism, labs and activity.", from: "Your lab results, clinic visits and wearable data, weighted by how recent they are.", use: "Watch the direction over weeks. Tap it in the app to see which parts pulled it up or down." },
  recovery: { t: "Recovery Score", icon: "bolt", what: "How ready your body is today — whether to push hard or take it easy.", from: "Last night's sleep, your overnight HRV and resting heart rate from your watch or ring.", use: "Plan the day: train when it is high, recover when it is low." },
  hrv: { t: "HRV status", icon: "wave", what: "Heart rate variability: the tiny gaps between heartbeats, in milliseconds. Higher usually means better recovery.", from: "Your wearable, measured overnight and compared with your own baseline.", use: "A few low days in a row is a cue to sleep, de-stress — and the care team sees it too." },
  monitor: { t: "Live Health Monitor", icon: "activity", what: "Your latest heart rate, HRV, steps and sleep, streaming in from your device.", from: "Apple Health, Health Connect, Garmin, Oura and other connected devices.", use: "Glance at today; gaps just mean the device wasn't worn." },
  body: { t: "Your body, system by system", icon: "fingerprint", what: "A model of you with each system marked Excellent, Good or Needs attention — compared with you, not with strangers.", from: "Everything above plus your BioAro lab results and clinician notes.", use: "Tap a system to see what moved and why. Biongevity SI explains; your clinician decides." },
  trends: { t: "Health Trends", icon: "chart", what: "Charts of HRV, sleep, resting heart rate and steps — daily, weekly, monthly or yearly.", from: "The same live data, stored in your BioELR record.", use: "Look for the trend, not one bad day. Share a chart with your clinician in one tap." },
};

/* body pins (viewBox 0 0 200 440) */
const PINS: Record<string, [number, number]> = { brain: [100, 26], eyes: [113, 42], lungs: [118, 118], heart: [92, 124], liver: [84, 162], gut: [104, 192], muscles: [151, 160], spine: [120, 330] };

/** Smooth a polyline into a closed bezier path (Catmull-Rom). */
function smooth(pts: [number, number][]) {
  const n = pts.length, p = (i: number) => pts[(i + n) % n];
  let d = `M${p(0)[0]},${p(0)[1]}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p(i - 1), [x1, y1] = p(i), [x2, y2] = p(i + 1), [x3, y3] = p(i + 2);
    d += ` C${x1 + (x2 - x0) / 6},${y1 + (y2 - y0) / 6} ${x2 - (x3 - x1) / 6},${y2 - (y3 - y1) / 6} ${x2},${y2}`;
  }
  return d + "Z";
}
const RIGHT: [number, number][] = [[108, 62], [111, 76], [128, 82], [146, 90], [154, 104], [157, 140], [161, 182], [166, 222], [170, 246], [165, 256], [157, 248], [151, 222], [145, 186], [139, 148], [134, 168], [131, 204], [137, 236], [137, 290], [133, 350], [129, 404], [134, 424], [114, 428], [111, 400], [109, 340], [105, 282], [100, 262]];
const BODY = smooth([...RIGHT, ...RIGHT.slice(0, -1).reverse().map(([x, y]) => [200 - x, y] as [number, number])]);

function Ring({ v, size = 92, color, label }: { v: number; size?: number; color: string; label: string }) {
  const r = size / 2 - 7, L = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={L}
          initial={{ strokeDashoffset: L }} whileInView={{ strokeDashoffset: L * (1 - v / 100) }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut" }} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div className="absolute text-center"><div className="text-[24px] font-semibold leading-none" style={{ color: C.text }}>{v}</div><div className="mt-1 text-[9.5px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>{label}</div></div>
    </div>
  );
}
