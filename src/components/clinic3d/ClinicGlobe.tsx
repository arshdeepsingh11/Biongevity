"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WORLD_DOTS } from "@/data/worldmap";
import { OFFICES } from "@/data/clinic";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { BuildingView } from "./BuildingView";

/** Building facts per office. Floor comes from the address; the building shape is illustrative. */
export const SITES: Record<string, { floors: number; floor: number; suite: string; building: string; note: string; tz: string }> = {
  Calgary: { floors: 26, floor: 10, suite: "Suite 1020", building: "Calgary Place Tower 1", note: "Floor 10 from the suite number #1020", tz: "America/Edmonton" },
  Dubai: { floors: 9, floor: 3, suite: "Office 302", building: "AB Center", note: "3rd floor, office 302", tz: "Asia/Dubai" },
  Almelo: { floors: 3, floor: 1, suite: "Windmolen 22", building: "BioAro Europe", note: "Floor to be confirmed", tz: "Europe/Amsterdam" },
};
