import type { OrganId } from "./deptExtra";

/**
 * Procedural 3D organ models for the Organ3D viewer — simplified anatomy built from ellipsoids, tubes and slabs
 * (our own geometry, no third-party model files). Units are roughly −1…1; y is up, z faces the viewer.
 * Each part carries a plain-language note and how it is usually checked. Educational, not to scale.
 */

export type V3 = [number, number, number];
export type Shape =
  | { k: "ell"; c: V3; r: V3; n?: number; w?: number }
  | { k: "tube"; path: V3[]; r: number; n?: number; taper?: number }
  | { k: "slab"; c: V3; s: V3; n?: number };
export type Tone = "ai" | "ai-hi" | "ai-2" | "artery" | "vein" | "warn" | "teal" | "gold" | "muted";
export interface Part { id: string; label: string; tone: Tone; shapes: Shape[]; note: string; check?: string }
export interface Organ { id: OrganId; name: string; blurb: string; parts: Part[] }

const coil = (): V3[] => Array.from({ length: 70 }, (_, i) => { const t = i / 69; return [Math.sin(t * Math.PI * 7) * 0.42 * (1 - t * 0.2), 0.15 - t * 0.75, Math.cos(t * Math.PI * 7) * 0.22] as V3; });
const arc = (c: V3, rx: number, ry: number, a0: number, a1: number, n = 24, z = 0): V3[] => Array.from({ length: n }, (_, i) => { const a = a0 + ((a1 - a0) * i) / (n - 1); return [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry, c[2] + z] as V3; });
