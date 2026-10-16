import type { OrganId } from "./deptExtra";

/**
 * Procedural 3D organ models for the Organ3D viewer — simplified anatomy built from ellipsoids, tubes and slabs
 * (our own geometry, no third-party model files). Units are roughly −1…1; y is up, z faces the viewer.
 * Each part carries a plain-language note and how it is usually checked. Educational, not to scale.
 */

export type V3 = [number, number, number];
