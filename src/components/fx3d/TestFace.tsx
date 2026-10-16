"use client";
import { Icon } from "@/components/ui/Icon";
import { LAB_COLLECTIONS } from "@/data/labs";
import type { CatalogProduct } from "@/data/types";
import { cn, formatMoney } from "@/lib/utils";

export const collectionOf = (t: CatalogProduct) => LAB_COLLECTIONS.find((c) => c.handle === t.category);
