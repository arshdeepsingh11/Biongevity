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

/** A person built from boxes: legs and arms swing with `phase` while walking. */
function person(out: Face[], x: number, z: number, face: number, phase: number, walking: boolean, cloth: number[], skin: number[], hair: number[], pants: number[], wave = 0) {
  const cy = Math.cos(face), sy = Math.sin(face);
  const place = (p: V): V => [x + p[0] * cy + p[2] * sy, p[1], z - p[0] * sy + p[2] * cy];
  const limb = (px: number, py: number, ang: number) => (p: V): V => { const dy = p[1] - py, c = Math.cos(ang), s = Math.sin(ang); return place([p[0], py + dy * c - p[2] * s, dy * s + p[2] * c]); };
  const sw = walking ? Math.sin(phase) * 0.55 : 0;
  box(out, -0.17, 0, -0.08, -0.02, 0.82, 0.08, pants, 1, limb(0, 0.82, sw));
  box(out, 0.02, 0, -0.08, 0.17, 0.82, 0.08, pants, 1, limb(0, 0.82, -sw));
  box(out, -0.22, 0.8, -0.13, 0.22, 1.42, 0.13, cloth, 1, place);
  box(out, -0.32, 0.86, -0.07, -0.22, 1.4, 0.07, cloth, 1, limb(0, 1.38, -sw * 0.8 - wave));
  box(out, 0.22, 0.86, -0.07, 0.32, 1.4, 0.07, cloth, 1, limb(0, 1.38, sw * 0.8));
  box(out, -0.06, 1.42, -0.06, 0.06, 1.5, 0.06, skin, 1, place);
  box(out, -0.13, 1.5, -0.13, 0.13, 1.78, 0.13, skin, 1, place);
  box(out, -0.14, 1.7, -0.14, 0.14, 1.82, 0.14, hair, 1, place);
}
