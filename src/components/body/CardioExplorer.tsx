"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { buildBody, type V3 } from "@/lib/body";
import { CORONARY, VESSELS, VESSEL_INFO, lungBranches, vesselInfo, type Vessel, type VesselKind } from "@/data/vessels";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";
import { useCamera } from "@/hooks/useCamera";

const HEART: V3 = [0.028, 0.395, 0.045];
type Layer = "arteries" | "veins" | "lungs" | "body";
const KIND_LAYER: Record<VesselKind, Layer> = { artery: "arteries", coronary: "arteries", vein: "veins", portal: "veins", "pulmonary-artery": "lungs", "pulmonary-vein": "lungs" };
/** Flow direction along the traced path: +1 = from first point to last. */
const FLOW: Record<VesselKind, number> = { artery: 1, coronary: 1, vein: -1, portal: 1, "pulmonary-artery": 1, "pulmonary-vein": -1 };
