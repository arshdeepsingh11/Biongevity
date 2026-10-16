"use client";
import { useMemo, useRef, useState } from "react";
import { BodyHologram, type Hotspot } from "@/components/body/BodyHologram";
import { organById } from "@/lib/body";
import { BP_RISK, LIFE_EXPECTANCY, SLEEP_RISK, STEPS_RISK } from "@/data/intelligence";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Sex = "women" | "men";
type Smoke = "never" | "former" | "current";
interface In { sleep: number; steps: number; sbp: number; drinks: number; bmi: number; smoke: Smoke; sex: Sex }
const START: In = { sleep: 6.2, steps: 4800, sbp: 136, drinks: 9, bmi: 28, smoke: "never", sex: "women" };

const c01 = (x: number) => Math.max(0, Math.min(1, x));
function stepsRR(steps: number) {
  const b = STEPS_RISK.bands; if (steps <= b[0].steps) return b[0].rr; if (steps >= b[b.length - 1].steps) return b[b.length - 1].rr;
  const i = b.findIndex((x) => x.steps >= steps), a = b[i - 1], z = b[i]; return a.rr + ((steps - a.steps) / (z.steps - a.steps)) * (z.rr - a.rr);
}
const bpRR = (sbp: number) => Math.pow(2, (Math.max(BP_RISK.ref, sbp) - BP_RISK.ref) / BP_RISK.doubleEvery);
const sleepRR = (h: number) => (h < 7 ? 1 + (SLEEP_RISK.short - 1) * c01((7 - h) / 1.5) : h > 9 ? 1 + (SLEEP_RISK.long - 1) * c01((h - 9) / 1.5) : 1);

/** On-device strain per organ (0 calm → 1 hot). A transparent teaching model, not a diagnosis. */
function heat(v: In): Record<string, number> {
  const bp = c01((v.sbp - 115) / 50), sl = c01(Math.abs(v.sleep - 7.5) / 2.5), mv = c01((8000 - v.steps) / 6500), al = c01(v.drinks / 21), wt = c01((v.bmi - 24) / 12), sm = v.smoke === "current" ? 1 : v.smoke === "former" ? 0.35 : 0;
  return {
    heart: c01(0.45 * bp + 0.2 * mv + 0.2 * wt + 0.3 * sm), brain: c01(0.45 * sl + 0.3 * bp + 0.25 * al), lungs: c01(0.85 * sm + 0.15 * mv),
    liver: c01(0.6 * al + 0.4 * wt), kidneys: c01(0.75 * bp + 0.2 * wt), pancreas: c01(0.55 * wt + 0.45 * mv), muscles: c01(0.9 * mv),
    gut: c01(0.45 * al + 0.3 * sl + 0.25 * wt), joints: c01(0.7 * wt + 0.2 * mv), skin: c01(0.5 * sm + 0.3 * sl),
  };
}
function lowRisk(v: In) {
  const smoke = v.smoke === "never" ? 1 : v.smoke === "former" ? 0.5 : 0;
  const bmi = v.bmi >= 18.5 && v.bmi < 25 ? 1 : v.bmi < 30 ? 0.5 : 0;
  const move = v.steps >= 7500 ? 1 : v.steps >= 5000 ? 0.5 : 0;
  const alc = v.drinks <= (v.sex === "women" ? 7 : 14) ? 1 : 0;
  return smoke + bmi + move + alc + 0.5; // diet held at "partly" (not asked here)
}
