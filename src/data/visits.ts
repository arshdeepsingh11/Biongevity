import type { IconName } from "@/components/ui/icons";

/**
 * Visit walkthroughs for the 3D clinic (Visit3D). Floor plans are illustrative — the order of the visit,
 * the paperwork and what happens at each stop follow how an in-person Biongevity visit runs.
 * Coordinates: x left→right, z back→front (entrance at the front), metres-ish. A corridor runs along z = 1;
 * front-row rooms open onto it from their back wall, back-row rooms from their front wall. Confirm details with the care team.
 */

export type Tone = "glass" | "olive" | "wood" | "white" | "ink" | "teal" | "gold" | "soft";
export interface Room { id: string; label: string; x: number; z: number; w: number; d: number; door: "front" | "back" | "both" | "open"; dx?: number }
