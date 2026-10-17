"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn, formatMoney } from "@/lib/utils";

export interface BookCategory { id: string; title: string; icon: string; line?: string }
export interface BookItem {
  id: string; category: string; title: string; kicker?: string; image?: string; iconUrl?: string; icon: string;
  summary: string; tags?: string[]; price: number; meta?: string; url: string; store: string;
}
