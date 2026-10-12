"use client";
import type { ReactNode } from "react";
import { AIProvider } from "@/components/ai/AIProvider";
import { CartProvider } from "@/components/shop/CartProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <AIProvider><CartProvider>{children}</CartProvider></AIProvider>;
}
