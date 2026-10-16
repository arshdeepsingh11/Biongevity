import type { IconName } from "@/components/ui/icons";
import { LAB_TESTS } from "./labs";
import { DRUG_PRODUCTS } from "./drugs";

/**
 * "Discover" — what Biongevity SI teaches on a new chat: the BioAro family, what's new on this site and
 * featured tests. Paraphrased from bioaro.com, bioarolabs.com, bioarodrugs.com, neyuhealth.com, the BioELR
 * and BioEMR portals, and this site's own catalogue. Prices in CAD as listed in our catalogue.
 */
export interface DiscoverItem { id: string; name: string; kicker: string; line: string; points: string[]; stat: { v: string; l: string }; icon: IconName; href: string; external?: boolean; ask: string }
