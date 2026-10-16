"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { buildBody, type V3 } from "@/lib/body";
import { CORONARY, VESSELS, VESSEL_INFO, lungBranches, vesselInfo, type Vessel, type VesselKind } from "@/data/vessels";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";
import { useCamera } from "@/hooks/useCamera";

const HEART: V3 = [0.028, 0.395, 0.045];
type Layer = "arteries" | "veins" | "lungs" | "body";
const KIND_LAYER: Record<VesselKind, Layer> = { artery: "arteries", coronary: "arteries", vein: "veins", portal: "veins", "pulmonary-artery": "lungs", "pulmonary-vein": "lungs" };
/** Flow direction along the traced path: +1 = from first point to last. */
const FLOW: Record<VesselKind, number> = { artery: 1, coronary: 1, vein: -1, portal: 1, "pulmonary-artery": 1, "pulmonary-vein": -1 };

/** Catmull-Rom sampling so every vessel is a smooth tube. */
function smooth(p: V3[], per = 6): V3[] {
  if (p.length < 3) return p;
  const out: V3[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)) as V3);
    }
  }
  out.push(p[p.length - 1]);
  return out;
}

/** Heart as a dense, shaded point volume: tapered ventricles (apex down-left) + two atria. */
function buildHeart() {
  let s = 3; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: number[] = [], side: number[] = [];
  const rot = (x: number, y: number, z: number): V3 => { const a = -0.55, c = Math.cos(a), sn = Math.sin(a); return [x * c - y * sn, x * sn + y * c, z]; };
  const HS = 1.35;
  for (let i = 0; i < 2200; i++) {
    const u = r() * 2 - 1, t = r() * Math.PI * 2, k = Math.cbrt(r()) * 0.55 + 0.45, q = Math.sqrt(1 - u * u);
    const y = u * 0.052 * HS, taper = 0.62 + 0.38 * ((u + 1) / 2);
    const x = Math.cos(t) * q * 0.043 * HS * taper * k, z = Math.sin(t) * q * 0.038 * HS * taper * k;
    const p = rot(x, y * k, z); pts.push(p[0], p[1], p[2]); side.push(p[0] > -0.004 ? 1 : 0);
  }
  for (const [cx, cy, cz, rr, sd] of [[-0.03, 0.054, -0.016, 0.032, 0], [0.022, 0.062, -0.03, 0.028, 1]] as const) {
    for (let i = 0; i < 380; i++) { const u = r() * 2 - 1, t = r() * Math.PI * 2, q = Math.sqrt(1 - u * u), k = Math.cbrt(r()) * 0.5 + 0.5; pts.push(cx + Math.cos(t) * q * rr * k, cy + u * rr * 0.85 * k, cz + Math.sin(t) * q * rr * k); side.push(sd); }
  }
  return { pts: new Float32Array(pts), side: new Uint8Array(side) };
}
