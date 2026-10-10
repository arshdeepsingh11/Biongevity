import type { IconName } from "@/components/ui/icons";

export type Brand = "Biongevity" | "BioAro Labs" | "BioAro Drugs";
export type ProductKind = "lab-test" | "supplement" | "program";

/** Unified catalog item. `url` is the real product page on bioarolabs.com /
 *  bioarodrugs.com — purchase happens there. */
export interface CatalogProduct {
  handle: string;
  url: string;                 // external product page
  title: string;
  vendor: Brand;
  kind: ProductKind;
  price: number;
  currency: string;
  category: string;            // collection handle
  summary: string;
  bestFor?: string;
  tagline?: string;
  format?: string;
  icon: IconName;
  goals?: string[];
  ingredients?: { name: string; why: string; amount: string }[];
  directions?: string;
  image?: string;
}

export interface Collection { handle: string; title: string; description: string; icon: IconName }
