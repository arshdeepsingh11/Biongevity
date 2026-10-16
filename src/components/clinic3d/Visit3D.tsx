"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Prop, Staff, Tone, Visit } from "@/data/visits";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";

/*
 * Visit3D — a walk-through of an in-person visit in real 3D (perspective camera, lit polygons, painter's sort).
 * A patient walks the route — entrance → reception → formalities → tests → consultation → plan — while staff
 * wait at their stations. Follow the patient or orbit the floor; tick the formalities to move on. Canvas only.
 */

type V = [number, number, number];
type Face = { pts: V[]; col: number[]; a: number; d: number; n: V };
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (v: V): V => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

/** 8 corners of a box in local space, mapped through `tf` to world space → 6 quads. */
function box(out: Face[], x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, col: number[], a = 1, tf?: (p: V) => V) {
  const c: V[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map((p) => (tf ? tf(p as V) : (p as V)));
  for (const f of [[0, 3, 2, 1], [4, 5, 6, 7], [0, 4, 7, 3], [1, 2, 6, 5], [3, 7, 6, 2], [0, 1, 5, 4]]) {
    const pts = f.map((i) => c[i]); out.push({ pts, col, a, d: 0, n: nrm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))) });
  }
}
