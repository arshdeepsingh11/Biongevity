import type { V3 } from "@/lib/body";

/**
 * Cardiovascular system, simplified for education. Paths are traced in the same units as lib/body.ts
 * (feet y = -1, head y = 1, +x = the body's left, +z = front). Anatomy text is general, plain-language
 * education — not a diagnosis. Illustrative model, not to scale.
 */
export type VesselKind = "artery" | "vein" | "pulmonary-artery" | "pulmonary-vein" | "portal" | "coronary";

export interface VesselInfo { id: string; name: string; kind: VesselKind; what: string; fact: string; check?: string; dept?: string }
