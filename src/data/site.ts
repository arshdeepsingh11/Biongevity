import type { IconName } from "@/components/ui/icons";
import { DEPARTMENTS } from "./departments";

export const SITE = {
  name: "Biongevity",
  tagline: "AI-guided longevity and healthspan care",
  parent: "BioAro",
  description:
    "AI-guided longevity and precision health for adults 40–65 and their families: Biongevity SI, a longitudinal healthspan platform, cardiology with onsite exercise stress echo, internal medicine, endocrinology, whole genome sequencing, microbiome and biomarker testing, virtual care and AI-guided plans — Calgary, Dubai and Almelo.",
  url: "https://biongevity.com",
};

export interface NavLink { href: string; label: string; icon: IconName; desc?: string; external?: boolean; group?: string }
export interface NavItem { id: string; label: string; icon: IconName; href?: string; menu?: NavLink[] }

/** Bottom Sparkle Navbar — hover opens a live preview panel. */
export const NAV: NavItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  {
    id: "precision", label: "Precision", icon: "stethoscope", href: "/precision-health/",
    menu: [
      ...DEPARTMENTS.map((d) => ({ href: `/precision-health/${d.id}/`, label: d.short, icon: d.icon, group: d.group })),
      { href: "/precision-health/bioaro-labs/", label: "BioAro Labs", icon: "test-tubes", group: "BioAro", desc: "AI-connected lab tests" },
      { href: "/precision-health/bioaro-drugs/", label: "BioAro Drugs", icon: "tablets", group: "BioAro", desc: "AI-guided protocols" },
    ],
  },
  {
    id: "clinic", label: "Clinic", icon: "pin", href: "/clinic/",
    menu: [
      { href: "/clinic/journey/", label: "Longevity Journey", icon: "route" },
      { href: "/clinic/virtual/", label: "Virtual Clinic", icon: "video" },
      { href: "/clinic/uae/", label: "UAE Precision Clinic", icon: "pin" },
    ],
  },
  {
    id: "shop", label: "Shop", icon: "bag", href: "/shop/",
    menu: [
      { href: "/shop/#studio", label: "Plan Studio", icon: "sparkle", desc: "Pick a goal — a plan assembles itself, live." },
      { href: "/shop/#depth", label: "Longevity programs", icon: "crown", desc: "Core, Precision and Elite — 3, 6 or 12 months." },
      { href: "/shop/#browse", label: "Browse everything", icon: "search", desc: "Programs, packages, tests and formulas — one bag." },
      { href: "/precision-health/bioaro-labs/#catalog", label: "BioAro lab tests", icon: "test-tubes", desc: "47 tests — genome, microbiome, hormones and more." },
    ],
  },
  {
    id: "discover", label: "Discover", icon: "orbit",
    menu: [
      { href: "/twin/", label: "Digital Twin", icon: "fingerprint", desc: "A 3D guided tour of your twin — then open it in the app." },
      { href: "/scan/", label: "AI Healthspan Scan", icon: "radar", desc: "2 minutes: 9 health domains, your test plan and re-test timeline." },
      { href: "/family/", label: "Family care", icon: "users", desc: "Caring for a parent: AI checklist, tests, specialists, family view." },
      { href: "/platform/", label: "Healthspan platform", icon: "fingerprint", desc: "Your digital twin, domain scores and AI coach — open the app." },
      { href: "/tools/", label: "AI health tools", icon: "sparkle", desc: "Explain lab results, prep a visit, find the right specialist." },
      { href: "/bioelr/", label: "BioELR for clinics", icon: "layers", desc: "Longevity-focused health record for clinics and communities." },
      { href: "/life/", label: "Biongevity Life", icon: "globe", desc: "Longevity at resorts, homes, offices, cities and schools." },
      { href: "/app/", label: "Biongevity App", icon: "phone", desc: "Wearables, AI coach and your record in your pocket." },
      { href: "/insights/", label: "Insights", icon: "book", desc: "Longevity science, explained plainly." },
      { href: "/about/", label: "About", icon: "info", desc: "Mission, vision and the BioAro group." },
      { href: "/ai/", label: "How our AI works", icon: "shield", desc: "What Xevyo does and doesn't do, with model cards." },
      { href: "/dashboard/", label: "Member dashboard", icon: "user", desc: "Illustrative demo of your BioELR record." },
    ],
  },
  { id: "contact", label: "Contact", icon: "message", href: "/contact/" },
];

export const CONTACTS = {
  labs: {
    phone: "+1 (833) 246-2766",
    tel: "tel:+18332462766",
    email: "support@bioarolabs.com",
    address: "5941 Optical Ct, Room 203H, San Jose, CA 95138",
    url: "https://bioarolabs.com/",
  },
  drugs: {
    email: "support@bioarodrugs.com",
    url: "https://bioarodrugs.com/",
    instagram: "https://www.instagram.com/bioarodrugs",
    x: "https://x.com/bioarodrugs",
  },
  biongevity: {
    phone: "403-250-2221",
    email: "info@biongevity.com",
  },
};


export const ABOUT_FACTS = [
  { k: "Parent company", v: "BioAro" },
  { k: "Headquarters", v: "Calgary, Alberta" },
  { k: "Offices", v: "Calgary · Dubai · Almelo" },
  { k: "Platform", v: "BioELR" },
];

export const FOUNDER = {
  name: "Dr. Anmol S. Kapoor",
  role: "Cardiologist · CEO & Founder, BioAro Inc.",
  linkedin: "https://www.linkedin.com/in/dr-anmol-kapoor-373631a",
  quote:
    "Supplementation should become more personalized, transparent and evidence-informed. People are asked to take things daily without being told what is in them, how much, or why.",
};
