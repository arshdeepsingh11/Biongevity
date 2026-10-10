import type { IconName } from "@/components/ui/icons";

export const SITE = {
  name: "Biongevity",
  tagline: "Precision health and longevity medicine",
  parent: "BioAro",
  description:
    "A new way of living where longevity is enhanced through the power of biology. Crafted with leading technology, scientists and healthcare professionals, delivered anywhere, anytime.",
  url: "https://biongevity.com",
};

export interface NavLink { href: string; label: string; icon: IconName; desc?: string; external?: boolean }
export interface NavItem { id: string; label: string; icon: IconName; href?: string; menu?: NavLink[] }

/** Bottom Sparkle Navbar. Groups mirror biongevity.com menus — hover opens a live preview panel. */
export const NAV: NavItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  {
    id: "precision", label: "Precision", icon: "stethoscope", href: "/precision-health/",
    menu: [
      { href: "/precision-health/internal-medicine/", label: "Internal Medicine", icon: "stethoscope" },
      { href: "/precision-health/cardiology/", label: "Cardiology", icon: "heart" },
      { href: "/precision-health/dermatology/", label: "Dermatology", icon: "sparkle" },
      { href: "/precision-health/dental/", label: "Dental", icon: "tooth" },
      { href: "/precision-health/womens-health/", label: "Women's Health", icon: "users" },
      { href: "/precision-health/mens-health/", label: "Men's Health", icon: "user" },
      { href: "/precision-health/gut-health/", label: "Gut Health", icon: "activity" },
      { href: "/precision-health/gastroenterology/", label: "Gastroenterology", icon: "droplet" },
      { href: "/precision-health/mental-health/", label: "Mental Health", icon: "leaf" },
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
  { id: "programs", label: "Programs", icon: "layers", href: "/packages/" },
  { id: "store", label: "Store", icon: "bag", href: "/#store" },
  {
    id: "discover", label: "Discover", icon: "sparkle",
    menu: [
      { href: "/life/", label: "Biongevity Life", icon: "globe", desc: "Longevity at resorts, homes, offices, cities and schools." },
      { href: "/app/", label: "Biongevity App", icon: "phone", desc: "AI vitals, expert advice and BioELR in your pocket." },
      { href: "/insights/", label: "Insights", icon: "book", desc: "Longevity science, explained plainly." },
      { href: "/about/", label: "About", icon: "info", desc: "Mission, vision and the BioAro group." },
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
