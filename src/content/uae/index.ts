import type { Department, Service, ServiceGroup } from "../types";
import { DERMATOLOGY } from "./dermatology";
import { IV_WELLNESS } from "./iv-wellness";
import { GENERAL_PRACTICE } from "./general-practice";
import { LONGEVITY } from "./longevity";
import { DIAGNOSTICS } from "./diagnostics";
import { DENTAL } from "./dental";
import { HOME_HEALTHCARE, TELEHEALTH } from "./home-telehealth";

/**
 * The UAE clinic's 8 departments, in business order: skin and wellness first (half of Dubai revenue),
 * then GP and longevity, then the rest. Every department has an overview page and every service its own page.
 */
export const DEPARTMENTS: Department[] = [DERMATOLOGY, IV_WELLNESS, GENERAL_PRACTICE, LONGEVITY, DIAGNOSTICS, DENTAL, HOME_HEALTHCARE, TELEHEALTH];

export const UAE_BASE = "/uae";
export const deptHref = (d: Pick<Department, "id">) => `${UAE_BASE}/${d.id}/`;
export const serviceHref = (d: Pick<Department, "id">, s: Pick<Service, "slug">) => `${UAE_BASE}/${d.id}/${s.slug}/`;

export const deptById = (id: string) => DEPARTMENTS.find((d) => d.id === id);
export const servicesOf = (d: Department): Service[] => d.groups.flatMap((g) => g.services);

export interface ServiceRef { dept: Department; group: ServiceGroup; service: Service }

/** Every service with its department and group (for static params, the sitemap and search). */
export const ALL_SERVICES: ServiceRef[] = DEPARTMENTS.flatMap((dept) => dept.groups.flatMap((group) => group.services.map((service) => ({ dept, group, service }))));

export const findService = (deptId: string, slug: string) => ALL_SERVICES.find((r) => r.dept.id === deptId && r.service.slug === slug);

/** Popular treatments shown first on the UAE home page (skin and wellness lead). */
export const POPULAR: [string, string][] = [
  ["dermatology-aesthetics", "hydrafacial"],
  ["dermatology-aesthetics", "skin-boosters"],
  ["dermatology-aesthetics", "botox"],
  ["dermatology-aesthetics", "laser-hair-removal"],
  ["dermatology-aesthetics", "chemical-peels"],
  ["dermatology-aesthetics", "prp-hair-treatment"],
  ["iv-therapy-wellness", "skin-glow-iv-drip"],
  ["iv-therapy-wellness", "energy-iv-drip"],
];

export const popularServices = () => POPULAR.map(([d, s]) => findService(d, s)).filter((r): r is ServiceRef => Boolean(r));

/** "Longevity for every part of you" — each area links to the department that cares for it. */
export const LONGEVITY_AREAS: { t: string; d: string; dept: string; icon: string }[] = [
  { t: "Skin", d: "Glow, repair and protection from the sun.", dept: "dermatology-aesthetics", icon: "face" },
  { t: "Hair", d: "Thicker, healthier hair and scalp.", dept: "dermatology-aesthetics", icon: "sparkle" },
  { t: "Heart & metabolism", d: "Blood pressure, sugar and cholesterol, checked early.", dept: "general-practice", icon: "heart" },
  { t: "Gut", d: "Your microbiome and digestion.", dept: "longevity-precision-health", icon: "gut" },
  { t: "Mind & energy", d: "Sleep, stress and everyday energy.", dept: "iv-therapy-wellness", icon: "brain" },
  { t: "Liver & kidneys", d: "Quiet organs, checked with simple blood tests.", dept: "diagnostics-laboratory", icon: "droplet" },
  { t: "DNA", d: "Your genes, read once and used for life.", dept: "longevity-precision-health", icon: "dna" },
  { t: "Smile", d: "Healthy teeth and gums at every age.", dept: "dental-care", icon: "tooth" },
];
