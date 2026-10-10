import type { IconName } from "@/components/ui/icons";
import { SITE_URL } from "./health";

/* Content source: biongevity.com — Global Clinic menu (Journey, Virtual Clinic, UAE Precision Clinic). */

export interface ClinicPage {
  id: "journey" | "virtual" | "uae";
  name: string; short: string; icon: IconName; tag: string; summary: string;
  media?: string; source: string;
  points: { t: string; d: string; icon?: IconName }[];
}

export const CLINICS: ClinicPage[] = [
  {
    id: "journey", name: "Longevity Journey", short: "Journey", icon: "route",
    tag: "Your longevity clinic, anywhere in the world.",
    summary: "Move from reactive to proactive. Physical wellness, genetics and cognitive health merge into one roadmap tailored to your holistic wellbeing.",
    source: `${SITE_URL}/journey/`,
    points: [
      { icon: "dna", t: "Real-time genomics", d: "Direct access to innovative healthcare services through Biongevity clinics, BioELR and the Biongevity App." },
      { icon: "flask", t: "Multidimensional lab & diagnostics", d: "Genetics, longevity markers, metabolic composition and microflora analysis — all in one place." },
      { icon: "clock", t: "24/7 healthcare access", d: "A personal health assistant: professionals and AI proactively assist you before issues arise." },
      { icon: "hourglass", t: "Biological vs chronological age", d: "Biological age reflects cellular health; Precision Age reveals personalized insights." },
    ],
  },
  {
    id: "virtual", name: "Virtual Longevity Clinic", short: "Virtual Clinic", icon: "video",
    tag: "Because your health matters, wherever you are.",
    summary: "Personalized, precision healthcare without commutes or waiting rooms — breaking the idea that longevity care is only for a select few.",
    source: `${SITE_URL}/virtual-clinic/`,
    points: [
      { icon: "eye", t: "We see the whole you", d: "Personalized insights that go deep into your lifestyle, habits and goals." },
      { icon: "phone", t: "Care at your fingertips", d: "Expert team and state-of-the-art tools at home, at work or on the go." },
      { icon: "message", t: "Real people, real connection", d: "Longevity doctors who listen and guide with actionable advice." },
      { icon: "shield", t: "Preventive, not reactive", d: "Predict and prevent issues before they arise." },
      { icon: "users", t: "A community that cares", d: "A supportive community committed to health and longevity." },
    ],
  },
  {
    id: "uae", name: "UAE Precision Clinic", short: "UAE Clinic", icon: "pin",
    tag: "Not your typical clinic.",
    summary: "A revolutionary precision and longevity clinic in Dubai — genetic and microbiome diagnostics with precision internal medicine and endocrinology. Be the CEO of your own health.",
    media: "clinicFilm",
    source: `${SITE_URL}/uae-precision-clinic/`,
    points: [
      { icon: "activity", t: "VO₂ max testing", d: "Cardiovascular fitness and endurance." },
      { icon: "eye", t: "Spirometry", d: "Lung function and respiratory health." },
      { icon: "heart", t: "Brachial ankle index", d: "Vascular health and circulation." },
      { icon: "dumbbell", t: "Grip strength", d: "Muscle strength as a fitness indicator." },
      { icon: "sparkle", t: "Skin analysis", d: "Detailed dermatological insights." },
      { icon: "layers", t: "Body composition", d: "Fat, muscle and bone density." },
      { icon: "bolt", t: "Metabolic rate", d: "Your calorie-burning efficiency." },
      { icon: "brain", t: "Cognitive performance", d: "Memory, focus and brain agility." },
      { icon: "chart", t: "Stress & HRV", d: "Stress resilience and balance." },
    ],
  },
];

export const clinicById = (id: string) => CLINICS.find((c) => c.id === id) ?? CLINICS[0];

/** Offices (biongevity.com/contact). */
export const OFFICES = [
  { city: "Calgary", region: "Head Office · Canada", phone: "403-250-2221", tel: "tel:+14032502221", email: "info@biongevity.com", address: "Calgary Place Tower 1, #1020 – 330 5th Avenue SW, Calgary, Alberta", loc: [51.0447, -114.0719] as [number, number] },
  { city: "Dubai", region: "Biongevity Clinic · UAE", phone: "+971 4 379 6393", tel: "tel:+97143796393", email: "infodxb@biongevity.com", address: "AB Center, 3rd floor, office 302, Sheikh Zayed Rd, Al Barsha 1, Dubai", loc: [25.2048, 55.2708] as [number, number] },
  { city: "Almelo", region: "BioAro Europe · Netherlands", phone: "+31 548 659077", tel: "tel:+31548659077", email: null as string | null, address: "Windmolen 22, 7609NN Almelo, The Netherlands", loc: [52.3567, 6.6625] as [number, number] },
];

export const ABOUT = {
  mission: "To extend healthspan and lifespan through personalized and precision healthcare, transforming the way people approach their health and wellness.",
  vision: "A world where everyone has the tools and knowledge to achieve optimal health and longevity — with Biongevity pioneering longevity medicine to empower healthier, longer lives.",
  intro: "A new way of living where your longevity is enhanced through the power of biology. Crafted with leading technology, scientists and healthcare professionals, Biongevity's platform precisely delivers longevity care anywhere, anytime.",
};

/** Testimonial stories (uploaded clinic videos). */
export const STORIES = [
  { id: "clinic", t: "Inside the clinic", d: "A patient on her precision aesthetics visit.", video: "/media/story-clinic.mp4", poster: "/media/story-clinic.jpg", tag: "Precision Dermatology", href: "/precision-health/dermatology/" },
  { id: "gut", t: "Gut health, decoded", d: "At-home gut microbiome test and personalized recommendations.", video: "/media/story-gut.mp4", poster: "/media/story-gut.jpg", tag: "Precision Gut Health", href: "/precision-health/gut-health/" },
  { id: "skin", t: "My skin microbiome", d: "Unboxing and using the Bio Skin kit.", video: "/media/story-skin.mp4", poster: "/media/story-skin.jpg", tag: "BioSkin test", href: "/precision-health/dermatology/" },
];
