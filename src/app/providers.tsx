"use client";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AIProvider } from "@/components/ai/AIProvider";
import { CartProvider } from "@/components/shop/CartProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider><AIProvider><CartProvider>{children}</CartProvider></AIProvider></ThemeProvider>;
}
