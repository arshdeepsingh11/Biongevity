"use client";
import type { ReactNode } from "react";
import { AIProvider } from "@/components/ai/AIProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <AIProvider>{children}</AIProvider>;
}
