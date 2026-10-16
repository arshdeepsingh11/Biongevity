"use client";
import { useEffect, useRef, useState } from "react";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

/** City character for the stylised map (heights in metres-ish, water side). */
const PROFILE: Record<string, { tall: [number, number]; water: "north" | "east" | "canal"; seed: number; label: string }> = {
  Calgary: { tall: [40, 190], water: "north", seed: 5, label: "Downtown Calgary · Bow River to the north" },
  Dubai: { tall: [30, 260], water: "east", seed: 9, label: "Dubai · Business Bay" },
  Almelo: { tall: [8, 26], water: "canal", seed: 13, label: "Almelo · town centre" },
};
