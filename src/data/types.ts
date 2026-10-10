import type { IconName } from "@/components/ui/icons";

export type Brand = "Biongevity" | "BioAro Labs" | "BioAro Drugs";
export type ProductKind = "lab-test" | "supplement" | "program";

/** Unified catalog item. Field names mirror Shopify Storefront Product so local
 *  data and live Shopify data render through the same components. */
export interface CatalogProduct {
  handle: string;              // Shopify product handle
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
  image?: string;              // filled from Shopify featuredImage
  variantId?: string;          // Shopify ProductVariant GID
  availableForSale?: boolean;
}

export interface Collection { handle: string; title: string; description: string; icon: IconName }
