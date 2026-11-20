"use client";
import type { ReactNode } from "react";
import { AIProvider } from "@/components/ai/AIProvider";
import { CartProvider } from "@/components/shop/CartProvider";
import { RegionProvider } from "@/components/region/RegionProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <RegionProvider><AIProvider><CartProvider>{children}</CartProvider></AIProvider></RegionProvider>;
}
