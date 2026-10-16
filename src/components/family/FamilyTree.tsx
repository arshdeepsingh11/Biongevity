"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { LAB_TESTS } from "@/data/labs";
import { deptById } from "@/data/departments";
import { BuyButton } from "@/components/commerce/BuyButton";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";

type Rel = "pgm" | "pgf" | "mgm" | "mgf" | "father" | "mother" | "sibling";
const PEOPLE: { id: Rel; label: string; degree: 1 | 2; female: boolean }[] = [
  { id: "pgm", label: "Paternal grandmother", degree: 2, female: true }, { id: "pgf", label: "Paternal grandfather", degree: 2, female: false },
  { id: "mgm", label: "Maternal grandmother", degree: 2, female: true }, { id: "mgf", label: "Maternal grandfather", degree: 2, female: false },
  { id: "father", label: "Father", degree: 1, female: false }, { id: "mother", label: "Mother", degree: 1, female: true },
  { id: "sibling", label: "Brother or sister", degree: 1, female: false },
];

interface Cond { id: string; label: string; icon: IconName; tests: string[]; clinic: string; dept: string; why: string }
/** Conditions and what they suggest. General education — a clinician confirms what applies to you. */
const CONDS: Cond[] = [
  { id: "heart", label: "Heart disease", icon: "heart", tests: ["hs-CRP", "Disease-Based DNA Test"], clinic: "Lipid panel with ApoB and a one-time Lp(a)", dept: "cardiology", why: "Heart disease in a parent or sibling — especially before 55 in men or 65 in women — raises your own risk and is a reason to check cholesterol particles early." },
  { id: "bp", label: "High blood pressure", icon: "activity", tests: ["Cystatin C"], clinic: "Home or 24-hour blood-pressure monitoring", dept: "cardiology", why: "Blood pressure runs in families; home readings catch it years before symptoms." },
  { id: "stroke", label: "Stroke", icon: "brain", tests: ["hs-CRP", "PAI-1"], clinic: "Blood pressure, lipids and carotid ultrasound if advised", dept: "cardiology", why: "A family history of stroke makes blood pressure and artery health the first things to check." },
  { id: "diabetes", label: "Type 2 diabetes", icon: "droplet", tests: ["Core Inflammation Aging"], clinic: "HbA1c and fasting glucose", dept: "endocrinology", why: "A parent or sibling with type 2 diabetes roughly doubles to triples your own risk; early checks and habits change the course." },
  { id: "colon", label: "Bowel (colorectal) cancer", icon: "gut", tests: ["Disease-Based DNA Test"], clinic: "Ask about starting bowel screening earlier", dept: "gut-health", why: "A close relative with bowel cancer often means screening should start earlier than usual. A microbiome test is not a cancer screen." },
  { id: "breast", label: "Breast or ovarian cancer", icon: "venus", tests: ["Disease-Based DNA Test", "Whole Genome Sequencing 30X"], clinic: "Genetic counselling; earlier breast screening if advised", dept: "womens-health", why: "Some families carry inherited variants (such as BRCA1/2) that a genetic test with counselling can clarify." },
  { id: "prostate", label: "Prostate cancer", icon: "mars", tests: ["Disease-Based DNA Test"], clinic: "Discuss PSA testing and when to start", dept: "mens-health", why: "A father or brother with prostate cancer is a reason to talk about PSA testing earlier." },
  { id: "dementia", label: "Dementia / Alzheimer's", icon: "brain", tests: ["Brain Health"], clinic: "Memory review; manage blood pressure, hearing and sleep", dept: "geriatric-medicine", why: "Family history adds some risk, but blood pressure, activity, hearing and sleep are powerful levers." },
  { id: "bones", label: "Osteoporosis / hip fracture", icon: "bone", tests: ["Vitamin D, 25-Hydroxy", "Vitamin K1"], clinic: "Bone density scan if advised", dept: "geriatric-medicine", why: "A parent's hip fracture is a recognised risk factor for your own bone health." },
];
const findTest = (k: string) => LAB_TESTS.find((t) => t.title.toLowerCase().startsWith(k.toLowerCase()));
