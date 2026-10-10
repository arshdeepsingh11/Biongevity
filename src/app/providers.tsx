"use client";
import type { ReactNode } from "react";
import { AIProvider } from "@/components/ai/AIProvider";
import { CartProvider } from "@/components/commerce/CartProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider><AIProvider>{children}</AIProvider></CartProvider>;
}
