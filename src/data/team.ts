import type { IconName } from "@/components/ui/icons";
import { FOUNDER } from "./site";

/**
 * People and proof. Only verified facts live here: add a doctor when the clinic sends name, title,
 * credentials, bio and an approved photo (put the file in /public/team and set `photo`).
 */
export interface Doctor {
  id: string; name: string; role: string;
  /** Short credential lines shown under the name (degrees, fellowships, licences). */
  credentials: string[];
  bio: string;
  /** Department ids this doctor appears on (see src/data/departments.ts). */
  depts: string[];
  locations: ("Calgary" | "Dubai" | "Virtual")[];
  photo?: string;
  linkedin?: string;
}

export const TEAM: Doctor[] = [
  {
    id: "kapoor", name: FOUNDER.name, role: "Cardiologist · CEO & Founder, BioAro Inc.",
    credentials: ["Cardiology", "Founder of Biongevity, BioAro Labs, BioAro Drugs and BioELR"],
    bio: "Cardiologist and founder of BioAro Inc., the Calgary company behind Biongevity. His work centres on precision prevention: reading genomics, biomarkers and everyday measurements together so that heart and metabolic risk are managed before they become disease.",
    depts: ["cardiology", "heart-failure", "internal-medicine"], locations: ["Calgary", "Virtual"], linkedin: FOUNDER.linkedin,
  },
];

export const teamFor = (dept?: string) => (dept ? TEAM.filter((d) => d.depts.includes(dept)) : TEAM);

/** Roles every patient meets, for departments without a named doctor yet. */
export const CARE_ROLES: { icon: IconName; t: string; d: string }[] = [
  { icon: "stethoscope", t: "Specialist physician", d: "Reviews your history and results and sets the plan." },
  { icon: "users", t: "Care coordinator", d: "Books, follows up and keeps your record together." },
  { icon: "sparkle", t: "Biongevity SI", d: "Explains results in plain words between visits, in English, French, Arabic and Persian." },
];

/** Proof points shown in trust sections. Add licences, accreditations and awards here as the clinic confirms them. */
export const CREDENTIALS: { icon: IconName; t: string; d: string }[] = [
  { icon: "heart", t: "Alberta's first onsite exercise stress echo", d: "Cardiology with exercise stress echocardiography in the same clinic visit." },
  { icon: "flask", t: "CLIA-registered laboratory testing", d: "BioAro Labs tests are processed by CLIA-registered laboratories." },
  { icon: "building", t: "Part of BioAro Inc.", d: "The Calgary precision-health group behind BioAro Labs, BioAro Drugs and the BioELR record." },
  { icon: "pin", t: "Calgary · Dubai · Almelo", d: "Two clinics and a European office sharing one connected record and one care standard." },
];
