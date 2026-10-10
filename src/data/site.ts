import type { IconName } from "@/components/ui/icons";

export const SITE = {
  name: "Biongevity",
  tagline: "Precision health and longevity medicine",
  parent: "BioAro",
  description:
    "A new way of living where longevity is enhanced through the power of biology. Crafted with leading technology, scientists and healthcare professionals, delivered anywhere, anytime.",
  url: "https://biongevity.com",
};

export const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/precision-health/", label: "Precision Health", icon: "stethoscope" },
  { href: "/packages/", label: "Packages", icon: "layers" },
  { href: "/labs/", label: "Labs", icon: "flask" },
  { href: "/drugs/", label: "Drugs", icon: "pill" },
  { href: "/journey/", label: "Journey", icon: "route" },
  { href: "/life/", label: "Life", icon: "globe" },
  { href: "/clinic/", label: "Clinic", icon: "pin" },
  { href: "/app/", label: "App", icon: "phone" },
  { href: "/journal/", label: "Journal", icon: "book" },
  { href: "/about/", label: "About", icon: "info" },
  { href: "/contact/", label: "Contact", icon: "message" },
];

/** Mobile bottom dock (Apple Dock component) — becomes the native tab bar in the app. */
export const DOCK: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/labs/", label: "Labs", icon: "flask" },
  { href: "/drugs/", label: "Drugs", icon: "pill" },
  { href: "/packages/", label: "Plans", icon: "layers" },
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
