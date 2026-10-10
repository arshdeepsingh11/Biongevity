import type { IconName } from "@/components/ui/icons";

export const SITE = {
  name: "Biongevity",
  tagline: "Precision health and longevity medicine",
  parent: "BioAro",
  description:
    "A new way of living where longevity is enhanced through the power of biology. Crafted with leading technology, scientists and healthcare professionals, delivered anywhere, anytime.",
  url: "https://biongevity.com",
};

/** Six tabs. Labs + Drugs live on Home (products link out); Journey, Life, Clinic, App merged into Care. */
export const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/precision-health/", label: "Precision Health", icon: "stethoscope" },
  { href: "/packages/", label: "Programs", icon: "layers" },
  { href: "/care/", label: "Care", icon: "route" },
  { href: "/insights/", label: "Insights", icon: "book" },
  { href: "/about/", label: "About", icon: "info" },
  { href: "/contact/", label: "Contact", icon: "message" },
];

/** Mobile bottom dock (Apple Dock) — the native tab bar in the app. */
export const DOCK: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/precision-health/", label: "Health", icon: "stethoscope" },
  { href: "/care/", label: "Care", icon: "route" },
  { href: "/insights/", label: "Insights", icon: "book" },
  { href: "/dashboard/", label: "Me", icon: "user" },
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
    // TODO(content): confirm Biongevity enquiry phone / email with the client.
    phone: null as string | null,
    email: null as string | null,
  },
};

export const LOCATIONS = [
  { city: "Calgary, Alberta", d: "Biongevity and BioAro are based in Calgary.", note: "Clinic address to confirm" },
  { city: "Dubai, UAE", d: "Biongevity launched a precision health and longevity clinic in Dubai.", note: "Clinic address to confirm" },
];

export const ABOUT_FACTS = [
  { k: "Parent company", v: "BioAro" },
  { k: "Headquarters", v: "Calgary, Alberta" },
  { k: "Clinics", v: "Calgary · Dubai" },
  { k: "Platform", v: "BioELR" },
];

export const FOUNDER = {
  name: "Dr. Anmol S. Kapoor",
  role: "Cardiologist · CEO & Founder, BioAro Inc.",
  linkedin: "https://www.linkedin.com/in/dr-anmol-kapoor-373631a",
  quote:
    "Supplementation should become more personalized, transparent and evidence-informed. People are asked to take things daily without being told what is in them, how much, or why.",
};
