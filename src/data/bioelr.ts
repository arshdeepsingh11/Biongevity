import type { IconName } from "@/components/ui/icons";

/** BioELR — Biongevity's longevity-focused health record system for clinics and institutions (B2B). Paraphrased from the brochure; claims follow docs/COPY_RULES.md. */
export const BIOELR_AI: { t: string; d: string; icon: IconName }[] = [
  { t: "Clinical decision support", d: "Suggests tests and options from patient data and guidelines — the clinician decides.", icon: "stethoscope" },
  { t: "Voice-to-note", d: "Speech recognition drafts progress notes so clinicians spend less time typing.", icon: "mic" },
  { t: "Allergy & interaction alerts", d: "Flags possible allergies and drug interactions for review before prescribing.", icon: "siren" },
  { t: "“Talk to me” patient chat", d: "Answers routine patient questions any time and hands anything clinical to the team.", icon: "message" },
  { t: "Risk patterns", d: "Spots trends across longitudinal data and surfaces them for clinician review.", icon: "trend" },
  { t: "AI patient monitoring", d: "Remote readings from wearables and devices, with alerts when values drift from baseline.", icon: "activity" },
];

export type ModuleGroup = "Operations" | "Specialty" | "Patient";
export const BIOELR_MODULES: { id: string; t: string; d: string; icon: IconName; group: ModuleGroup }[] = [
  { id: "clinic", t: "Clinic management", d: "Scheduling, billing and inventory in one place.", icon: "building", group: "Operations" },
  { id: "multi", t: "Multi-clinic", d: "One view of staff, resources and patient flow across sites.", icon: "network", group: "Operations" },
  { id: "schedule", t: "Schedule management", d: "Appointments, staff rotas and rooms with fewer wait times.", icon: "calendar", group: "Operations" },
  { id: "inventory", t: "Inventory", d: "Longevity products and supplements, transfers and re-ordering.", icon: "box", group: "Operations" },
  { id: "crm", t: "CRM & leads", d: "Capture, tag and follow up leads to grow your patient base.", icon: "target", group: "Operations" },
  { id: "reminders", t: "Reminders", d: "Automated email reminders that reduce no-shows.", icon: "alarm", group: "Operations" },
  { id: "cardiac", t: "Cardiac", d: "Heart metrics, cardiac medications, reminders and reports.", icon: "heart", group: "Specialty" },
  { id: "derma", t: "Dermatology", d: "Treatment plans, prescriptions and progress tracking.", icon: "face", group: "Specialty" },
  { id: "dental", t: "Dental", d: "Procedures, charting by voice, prescriptions and progress.", icon: "tooth", group: "Specialty" },
  { id: "virtual", t: "Virtual consults", d: "Video visits and follow-ups for patients anywhere.", icon: "video", group: "Patient" },
  { id: "patient", t: "Patient management", d: "Demographics, records and appointments with AI chat.", icon: "user", group: "Patient" },
  { id: "intake", t: "Custom intake", d: "Intake forms tailored to each service.", icon: "clipboard", group: "Patient" },
  { id: "meds", t: "Medication management", d: "Prescriptions and refills to support adherence.", icon: "tablets", group: "Patient" },
  { id: "booking", t: "Self-booking", d: "Patients book, update details and view records online.", icon: "laptop", group: "Patient" },
  { id: "progress", t: "Progress tracking", d: "Before-and-after reports patients understand.", icon: "chart", group: "Patient" },
  { id: "genomic", t: "Genomic care plans", d: "Plans that use genetic and multi-omic results when relevant.", icon: "dna", group: "Patient" },
];

export const BIOELR_INTEROP: { t: string; d: string; icon: IconName }[] = [
  { t: "HL7® integration", d: "Built-in HL7 for exchanging data with labs, pharmacies and other systems.", icon: "network" },
  { t: "SNOMED CT & ICD", d: "Standard clinical terms and codes for global interoperability.", icon: "book" },
  { t: "Wearables & IoT", d: "Fitness trackers, medical devices and smart-home sensors in one longitudinal view.", icon: "wifi" },
  { t: "Multi-omic data", d: "Whole genome and exome, biomarkers and microbiome alongside clinical data.", icon: "dna" },
  { t: "Privacy & security", d: "Built with privacy and security in mind; configured for each jurisdiction's requirements.", icon: "lock" },
  { t: "Analytics & research", d: "Built-in analysis, visualisation and reporting for clinical insight.", icon: "bars" },
];

export const BIOELR_SCALE: { t: string; d: string; icon: IconName }[] = [
  { t: "Clinics & groups", d: "Single sites to multi-clinic networks with one record.", icon: "hospital" },
  { t: "Longevity resorts", d: "Guest baselines, programs and follow-up after they leave.", icon: "sun" },
  { t: "Communities & cities", d: "Population health trends, interventions and research — with consent.", icon: "building" },
];

export const ORG_TYPES = ["Single clinic", "Clinic group", "Longevity resort", "Community / city", "Employer / insurer"];
export const SPECIALTIES = ["Longevity", "Cardiology", "Internal medicine", "Endocrinology", "Dermatology", "Dental", "Women's health", "Mental health"];
