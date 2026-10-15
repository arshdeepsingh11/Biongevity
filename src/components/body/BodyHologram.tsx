"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ORGANS, buildBody, organById } from "@/lib/body";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type Tone = "good" | "attention" | "neutral" | "focus";
export interface Hotspot { id: string; label?: string; status?: string; tone?: Tone }
