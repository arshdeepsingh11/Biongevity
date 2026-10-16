import type { IconName } from "@/components/ui/icons";

/**
 * Department deep dives — what each department offers in practice, how it links to the rest of the record,
 * and where the information comes from. Paraphrased in our own words from BioAro-group clinic sites
 * (NEYU Health, ARC Network, NEA Precision Skin, BioGut Clinic) and BioAro Labs. Reviewed October 2026.
 * Confirm services and availability with the care team; nothing here is a price promise unless it is a BioAro Labs list price.
 */

export type OrganId = "lungs" | "skin" | "brain" | "gut" | "thyroid" | "kidneys" | "tooth" | "knee" | "uterus" | "prostate" | "liver";

export interface DeptExtra {
  organ?: OrganId;
  offer: { t: string; d: string; icon: IconName }[];
  links: { t: string; d: string }[];
  numbers?: { v: string; l: string }[];
  partner?: { name: string; url: string; line: string };
  sources: { name: string; url: string }[];
}
