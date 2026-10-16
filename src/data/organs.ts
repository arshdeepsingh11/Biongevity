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
