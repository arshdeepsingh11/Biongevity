/**
 * People. Only verified facts go here.
 *
 * UAE_DOCTORS — add each Dubai doctor when the clinic confirms: name, title, specialty, qualifications,
 * licence (e.g. DHA licence number), languages, a short bio and an approved photo (put it in /public/photos/team/).
 * They then appear automatically on the clinic page and on the department pages listed in `depts`.
 */
export interface Doctor {
  id: string;
  name: string;
  title: string;
  /** Qualifications and licence lines. */
  credentials: string[];
  languages?: string[];
  bio: string;
  /** Department ids from src/content/uae (e.g. "dermatology-aesthetics"). */
  depts: string[];
  /** e.g. "/photos/team/dr-name.jpg" */
  photo?: string;
}

export const UAE_DOCTORS: Doctor[] = [];

export const FOUNDER = {
  name: "Dr. Anmol S. Kapoor",
  title: "Physician · Founder, Biongevity",
  bio: "Biongevity's founder is a physician whose work centres on precision prevention: reading genetics, blood markers and everyday measurements together, so that risks are managed before they become disease.",
  linkedin: "https://www.linkedin.com/in/dr-anmol-kapoor-373631a",
};

export const doctorsFor = (dept?: string) => (dept ? UAE_DOCTORS.filter((d) => d.depts.includes(dept)) : UAE_DOCTORS);
