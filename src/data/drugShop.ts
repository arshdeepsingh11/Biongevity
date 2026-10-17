/**
 * The full BioAro Drugs shop (bioarodrugs.com/us/shop, Oct 2026): every formula with its real product photo,
 * line, price (as shown on the store, labelled CAD on this site — confirm before launch), dose and description.
 * Photos are served by BioAro Drugs' Shopify CDN; each card links to the real product page.
 */
import type { IconName } from "@/components/ui/icons";

const STORE = "https://bioarodrugs.com/us";
const CDN = "https://cdn.shopify.com/s/files/1/0677/0724/0551/files/";

export interface ShopFormula { handle: string; title: string; tagline: string; price: number; category: string; dose: string; summary: string; image: string }

export const DRUG_SHOP_CATEGORIES: { id: string; title: string; icon: IconName; line: string }[] = [
  { id: "longevity", title: "Longevity", icon: "hourglass", line: "Cellular energy and healthy ageing." },
  { id: "focus", title: "Focus", icon: "brain", line: "Clarity through long days." },
  { id: "energy", title: "Energy", icon: "bolt", line: "Natural energy, less fatigue." },
  { id: "performance", title: "Performance", icon: "dumbbell", line: "Strength, power and training." },
  { id: "recovery", title: "Recovery", icon: "activity", line: "Joints, muscles and rehydration." },
  { id: "sleep-calm", title: "Sleep & Calm", icon: "moon", line: "Rest, relaxation and stress." },
  { id: "hormonal-health", title: "Hormonal Health", icon: "test-tube", line: "Men's and women's daily support." },
  { id: "daily-foundations", title: "Daily Foundations", icon: "leaf", line: "Everyday nutrition and digestion." },
];
