import type { Department, Service, ServiceGroup } from "../types";
import type { Locale } from "@/i18n";
import { uaeBase } from "@/i18n";
import { DERMATOLOGY } from "./dermatology";
import { IV_WELLNESS } from "./iv-wellness";
import { GENERAL_PRACTICE } from "./general-practice";
import { LONGEVITY } from "./longevity";
import { DIAGNOSTICS } from "./diagnostics";
import { DENTAL } from "./dental";
import { HOME_HEALTHCARE, TELEHEALTH } from "./home-telehealth";
import type { DeptAr } from "./ar/types";
import { DERMATOLOGY_AR } from "./ar/dermatology";
import { IV_WELLNESS_AR } from "./ar/iv-wellness";
import { GENERAL_PRACTICE_AR } from "./ar/general-practice";
import { LONGEVITY_AR } from "./ar/longevity";
import { DENTAL_AR, DIAGNOSTICS_AR, HOME_HEALTHCARE_AR, TELEHEALTH_AR } from "./ar/others";

/**
 * The UAE clinic's 8 departments, in business order: skin and wellness first (half of Dubai revenue),
 * then GP and longevity, then the rest. Every department has an overview page and every service its own page,
 * in English (/uae/…) and Arabic (/ar/uae/…).
 */
export const DEPARTMENTS: Department[] = [DERMATOLOGY, IV_WELLNESS, GENERAL_PRACTICE, LONGEVITY, DIAGNOSTICS, DENTAL, HOME_HEALTHCARE, TELEHEALTH];

export const ARABIC: Record<string, DeptAr> = {
  "dermatology-aesthetics": DERMATOLOGY_AR,
  "iv-therapy-wellness": IV_WELLNESS_AR,
  "general-practice": GENERAL_PRACTICE_AR,
  "longevity-precision-health": LONGEVITY_AR,
  "diagnostics-laboratory": DIAGNOSTICS_AR,
  "dental-care": DENTAL_AR,
  "home-healthcare": HOME_HEALTHCARE_AR,
  telehealth: TELEHEALTH_AR,
};

/**
 * Number ranges such as "45–60" inside Arabic text would show reversed ("60–45") because of right-to-left ordering.
 * Wrapping each range in a left-to-right isolate (U+2066 … U+2069) keeps it as written.
 */
const LRI = "\u2066", PDI = "\u2069";
export const fixRanges = (s: string) => s.replace(/(\d+(?:[.,]\d+)?)\s*[–-]\s*(\d+(?:[.,]\d+)?)/g, `${LRI}$1–$2${PDI}`);
function deepFix<T>(v: T): T {
  if (typeof v === "string") return fixRanges(v) as T;
  if (Array.isArray(v)) return v.map(deepFix) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepFix(x)])) as T;
  return v;
}

/** A department in the requested language (Arabic text laid over the English structure; ids, slugs and photos are shared). */
export function localizeDept(d: Department, l: Locale): Department {
  if (l === "en") return d;
  const a = deepFix(ARABIC[d.id]);
  return {
    ...d,
    name: a.name, short: a.short, tagline: a.tagline, intro: a.intro, longevity: a.longevity, why: a.why, steps: a.steps, faqs: a.faqs,
    groups: d.groups.map((g) => ({
      ...g, name: a.groups[g.id].name, intro: a.groups[g.id].intro,
      services: g.services.map((s) => ({ ...s, ...a.services[s.slug], slug: s.slug, photo: s.photo })),
    })),
  };
}

const CACHE: Partial<Record<Locale, Department[]>> = {};
export const departments = (l: Locale = "en") => (CACHE[l] ??= DEPARTMENTS.map((d) => localizeDept(d, l)));

export const UAE_BASE = "/uae";
export const deptHref = (d: Pick<Department, "id">, l: Locale = "en") => `${uaeBase(l)}/${d.id}/`;
export const serviceHref = (d: Pick<Department, "id">, s: Pick<Service, "slug">, l: Locale = "en") => `${uaeBase(l)}/${d.id}/${s.slug}/`;

export const deptById = (id: string, l: Locale = "en") => departments(l).find((d) => d.id === id);
export const servicesOf = (d: Department): Service[] => d.groups.flatMap((g) => g.services);

export interface ServiceRef { dept: Department; group: ServiceGroup; service: Service }

const flatten = (ds: Department[]) => ds.flatMap((dept) => dept.groups.flatMap((group) => group.services.map((service) => ({ dept, group, service }))));
/** Every service (English) with its department and group, for static params and the sitemap. */
export const ALL_SERVICES: ServiceRef[] = flatten(DEPARTMENTS);
export const allServices = (l: Locale = "en") => (l === "en" ? ALL_SERVICES : flatten(departments(l)));

export const findService = (deptId: string, slug: string, l: Locale = "en") => allServices(l).find((r) => r.dept.id === deptId && r.service.slug === slug);

/** English name of a service (WhatsApp messages always include it, so the clinic team can act fast). */
export const englishName = (deptId: string, slug?: string) => {
  const d = DEPARTMENTS.find((x) => x.id === deptId);
  if (!d) return "";
  return slug ? servicesOf(d).find((s) => s.slug === slug)?.name ?? "" : d.name;
};

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

export const popularServices = (l: Locale = "en") => POPULAR.map(([d, s]) => findService(d, s, l)).filter((r): r is ServiceRef => Boolean(r));

/** "Longevity for every part of you" — each area links to the department that cares for it. */
const AREAS: { en: [string, string]; ar: [string, string]; dept: string; icon: string }[] = [
  { en: ["Skin", "Glow, repair and protection from the sun."], ar: ["بشرتك", "إشراقة وإصلاح وحماية من الشمس."], dept: "dermatology-aesthetics", icon: "face" },
  { en: ["Hair", "Thicker, healthier hair and scalp."], ar: ["شعرك", "شعر أكثف وأصحّ وفروة رأس صحية."], dept: "dermatology-aesthetics", icon: "sparkle" },
  { en: ["Heart & metabolism", "Blood pressure, sugar and cholesterol, checked early."], ar: ["قلبك واستقلابك", "ضغط الدم والسكر والكوليسترول، تُفحص مبكرًا."], dept: "general-practice", icon: "heart" },
  { en: ["Gut", "Your microbiome and digestion."], ar: ["جهازك الهضمي", "الميكروبيوم والهضم."], dept: "longevity-precision-health", icon: "gut" },
  { en: ["Mind & energy", "Sleep, stress and everyday energy."], ar: ["عقلك وطاقتك", "النوم والتوتر والطاقة اليومية."], dept: "iv-therapy-wellness", icon: "brain" },
  { en: ["Liver & kidneys", "Quiet organs, checked with simple blood tests."], ar: ["كبدك وكليتاك", "أعضاء صامتة تُفحص بتحاليل دم بسيطة."], dept: "diagnostics-laboratory", icon: "droplet" },
  { en: ["DNA", "Your genes, read once and used for life."], ar: ["حمضك النووي", "جيناتك، تُقرأ مرة وتفيدك مدى الحياة."], dept: "longevity-precision-health", icon: "dna" },
  { en: ["Smile", "Healthy teeth and gums at every age."], ar: ["ابتسامتك", "أسنان ولثة صحية في كل عمر."], dept: "dental-care", icon: "tooth" },
];
export const longevityAreas = (l: Locale = "en") => AREAS.map((a) => ({ t: a[l][0], d: a[l][1], dept: a.dept, icon: a.icon }));

/**
 * Treatment finder: a concern → where to start. Plain mapping by our team's logic (not AI), always ending in
 * "ask our team" on WhatsApp, so the doctor confirms the plan.
 */
const CONCERNS: { id: string; icon: string; en: string; ar: string; picks: [string, string][] }[] = [
  { id: "glow", icon: "sparkle", en: "Dull or tired skin", ar: "بشرة باهتة أو متعبة", picks: [["dermatology-aesthetics", "hydrafacial"], ["dermatology-aesthetics", "skin-boosters"], ["iv-therapy-wellness", "skin-glow-iv-drip"]] },
  { id: "lines", icon: "face", en: "Lines and wrinkles", ar: "الخطوط والتجاعيد", picks: [["dermatology-aesthetics", "botox"], ["dermatology-aesthetics", "skin-boosters"], ["dermatology-aesthetics", "hifu"]] },
  { id: "acne", icon: "droplet", en: "Acne and marks", ar: "حبّ الشباب وآثاره", picks: [["dermatology-aesthetics", "acne-treatment"], ["dermatology-aesthetics", "chemical-peels"], ["dermatology-aesthetics", "fractional-co2-laser"]] },
  { id: "pigment", icon: "sun", en: "Dark spots and melasma", ar: "البقع الداكنة والكلف", picks: [["dermatology-aesthetics", "pigmentation-treatment"], ["dermatology-aesthetics", "q-switch-laser"], ["dermatology-aesthetics", "chemical-peels"]] },
  { id: "hair", icon: "person", en: "Hair thinning", ar: "ترقّق الشعر", picks: [["dermatology-aesthetics", "hair-scalp-consultation"], ["dermatology-aesthetics", "prp-hair-treatment"], ["dermatology-aesthetics", "hair-exosome-therapy"]] },
  { id: "hair-removal", icon: "bolt", en: "Unwanted hair", ar: "الشعر غير المرغوب فيه", picks: [["dermatology-aesthetics", "laser-hair-removal"], ["dermatology-aesthetics", "dermatologist-consultation"]] },
  { id: "energy", icon: "bolt", en: "Low energy", ar: "انخفاض الطاقة", picks: [["iv-therapy-wellness", "energy-iv-drip"], ["general-practice", "vitamin-mineral-assessment"], ["iv-therapy-wellness", "functional-medicine-consultation"]] },
  { id: "weight", icon: "scale", en: "Weight", ar: "الوزن", picks: [["iv-therapy-wellness", "weight-management"], ["iv-therapy-wellness", "nutritional-consultation"], ["dermatology-aesthetics", "fat-dissolving-treatments"]] },
  { id: "check", icon: "stethoscope", en: "A full health check", ar: "فحص صحي شامل", picks: [["general-practice", "comprehensive-health-assessment"], ["diagnostics-laboratory", "comprehensive-wellness-panel"], ["general-practice", "standard-health-check"]] },
  { id: "ageing", icon: "hourglass", en: "Ageing well", ar: "التقدّم في العمر بصحة", picks: [["longevity-precision-health", "longevity-consultation"], ["longevity-precision-health", "biological-age-assessment"], ["longevity-precision-health", "epigenetic-age-testing"]] },
  { id: "smile", icon: "tooth", en: "My smile", ar: "ابتسامتي", picks: [["dental-care", "complete-smile-care"], ["dental-care", "scaling-polishing"], ["dental-care", "dental-consultation"]] },
  { id: "home", icon: "home", en: "Care at home", ar: "الرعاية في المنزل", picks: [["home-healthcare", "doctor-home-visit"], ["home-healthcare", "home-iv-therapy"], ["home-healthcare", "home-blood-testing"]] },
];
export const concerns = (l: Locale = "en") => CONCERNS.map((c) => ({ id: c.id, icon: c.icon, label: c[l], picks: c.picks.map(([d, s]) => findService(d, s, l)).filter((r): r is ServiceRef => Boolean(r)) }));

/** Finder data for the client component (only what it shows). */
export const finderData = (l: Locale = "en") => {
  const en = concerns("en");
  return concerns(l).map((c, i) => ({
    id: c.id, icon: c.icon, label: c.label, en: en[i].label,
    picks: c.picks.map(({ dept, service }) => ({ dept: dept.id, icon: dept.icon, name: service.name, short: service.short, href: serviceHref(dept, service, l) })),
  }));
};
