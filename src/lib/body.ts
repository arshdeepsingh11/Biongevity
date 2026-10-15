/**
 * Procedural 3D human — a point-cloud body and its organs, generated in code (no model files, no images).
 * Units: the body stands from y = -1 (feet) to y = 1 (top of head), facing +z. +x is the body's left
 * (the viewer's right when seen from the front).
 */
export type V3 = [number, number, number];

export interface Organ {
  id: string; label: string; plain: string; at: V3; r: V3; n: number;
  /** Where the label sits (defaults to the organ centre) — keeps neighbouring labels apart. */
  tag?: V3;
  /** Departments that look after this part of the body (ids from data/departments.ts). */
  depts: string[];
}
