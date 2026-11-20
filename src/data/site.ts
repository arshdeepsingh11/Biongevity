import type { IconName } from "@/components/ui/icons";
import { DEPARTMENTS } from "./departments";

export const SITE = {
  name: "Biongevity",
  tagline: "Longevity and precision health",
  parent: "Biongevity",
  description:
    "Biongevity is a longevity and precision health company. In Dubai: a clinic for dermatology and aesthetics, IV therapy and wellness, general practice, longevity testing, diagnostics, dental care, home healthcare and telehealth. In the United States: telehealth and the Biongevity app, launching March 2027.",
  url: "https://biongevity.com",
};

export interface NavLink { href: string; label: string; icon: IconName; desc?: string; external?: boolean; group?: string }
export interface NavItem { id: string; label: string; icon: IconName; href?: string; menu?: NavLink[] }

/** Site map used by the footer's Explore column (the top navigation is MENU below). */
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
      { href: "/uae/", label: "Biongevity Dubai (UAE)", icon: "pin" },
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
      { href: "/plan/", label: "Care plan builder", icon: "calendar", desc: "Pick a goal: a 12-month plan with tests, re-tests, formulas and a CAD total." },
      { href: "/evidence/", label: "Evidence engine", icon: "microscope", desc: "Every number with its studies, people, effect and GRADE certainty." },
      { href: "/scan/", label: "AI Healthspan Scan", icon: "radar", desc: "2 minutes: 9 health domains, your test plan and re-test timeline." },
      { href: "/family/", label: "Family care", icon: "users", desc: "Caring for a parent: AI checklist, tests, specialists, family view." },
      { href: "/platform/", label: "Healthspan platform", icon: "fingerprint", desc: "Your digital twin, domain scores and AI coach — open the app." },
      { href: "/tools/", label: "AI health tools", icon: "sparkle", desc: "Explain lab results, prep a visit, find the right specialist." },
      { href: "/bioelr/", label: "BioELR for clinics", icon: "layers", desc: "Longevity-focused health record for clinics and communities." },
      { href: "/life/", label: "Biongevity Life", icon: "globe", desc: "Longevity at resorts, homes, offices, cities and schools." },
      { href: "/app/", label: "Biongevity App", icon: "phone", desc: "Wearables, AI coach and your record in your pocket." },
      { href: "/insights/", label: "Insights", icon: "book", desc: "Longevity science, explained plainly." },
      { href: "/about/", label: "About", icon: "info", desc: "Who we are, what we do and how we do it." },
      { href: "/ai/", label: "How our AI works", icon: "shield", desc: "What Biongevity SI does and doesn't do, with model cards." },
      { href: "/dashboard/", label: "Member dashboard", icon: "user", desc: "Illustrative demo of your BioELR record." },
    ],
  },
  { id: "contact", label: "Contact", icon: "message", href: "/contact/" },
];

/**
 * Business WhatsApp — the fixed button at the bottom right and every "WhatsApp us" link.
 * Default: the clinic's business WhatsApp, +971 50 528 2566. NEXT_PUBLIC_WHATSAPP_NUMBER (country code + number, digits only) overrides it.
 */
export const WHATSAPP = {
  number: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971505282566").replace(/\D/g, ""),
  message: "Hi Biongevity, I'd like to book a consultation.",
};
export const waLink = (text?: string) => `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(text ?? WHATSAPP.message)}`;

export interface MenuItem { id: string; label: string; href: string; kind?: "services" | "clinics" | "more" }

/** Top navigation (desktop bar and phone drawer). Services and Clinics open menus; the rest are links. */
export const MENU: MenuItem[] = [
  { id: "services", label: "Services", href: "/precision-health/", kind: "services" },
  { id: "clinics", label: "Clinics", href: "/clinic/", kind: "clinics" },
  { id: "programs", label: "Programs & pricing", href: "/shop/#depth" },
  { id: "how", label: "How it works", href: "/#how-it-works" },
  { id: "about", label: "About", href: "/about/" },
  { id: "contact", label: "Contact", href: "/contact/" },
  { id: "more", label: "More", href: "/explore/", kind: "more" },
];

/** The "More" menu: tools and reading, grouped. */
export const MORE_LINKS: { group: string; links: NavLink[] }[] = [
  { group: "Tools", links: [
    { href: "/explore/", label: "Explore the science", icon: "orbit", desc: "Interactive charts, 3D body and the longevity lab." },
    { href: "/scan/", label: "AI Healthspan Scan", icon: "radar", desc: "2 minutes: your domains and test plan." },
    { href: "/plan/", label: "Care plan builder", icon: "calendar", desc: "A 12-month plan with tests and a total." },
    { href: "/tools/", label: "Explain my lab results", icon: "flask", desc: "Paste results; see what they mean." },
    { href: "/family/", label: "Family care", icon: "users", desc: "Caring for a parent, with one shared view." },
  ] },
  { group: "Platform", links: [
    { href: "/platform/", label: "Healthspan platform", icon: "fingerprint", desc: "Your digital twin and AI coach." },
    { href: "/app/", label: "Biongevity App", icon: "phone", desc: "Wearables, coach and your record." },
    { href: "/bioelr/", label: "BioELR for clinics", icon: "layers", desc: "The record system clinics use." },
    { href: "/ai/", label: "How our AI works", icon: "shield", desc: "What Biongevity SI does and doesn't do." },
  ] },
  { group: "Read", links: [
    { href: "/insights/", label: "Insights", icon: "book", desc: "Longevity science, explained plainly." },
    { href: "/evidence/", label: "Evidence engine", icon: "microscope", desc: "Every number with its studies." },
    { href: "/life/", label: "Biongevity Life", icon: "globe", desc: "Longevity at resorts, homes and offices." },
  ] },
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
