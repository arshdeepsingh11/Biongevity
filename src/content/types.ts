import type { IconName } from "@/components/ui/icons";

/** One question and answer, shown in FAQ accordions and in FAQPage structured data. */
export interface Faq { q: string; a: string }

/** Short facts shown as chips on a service page. Only typical, non-promissory values. */
export interface ServiceFacts {
  /** Typical time in clinic, e.g. "45–60 min". */
  time?: string;
  /** Typical recovery, e.g. "None" or "1–2 days of mild redness". */
  downtime?: string;
  /** How many sessions are usually advised, e.g. "Course of 3". */
  sessions?: string;
  /** Where it happens, e.g. "In clinic", "At home", "Online". */
  where?: string;
}

/** A treatment or service with its own page: /uae/<department>/<slug>/ */
export interface Service {
  slug: string;
  name: string;
  /** One line under the title and on cards (≤ 110 characters). */
  short: string;
  /** What it is, in plain words (2–3 sentences). */
  about: string;
  /** Who it may suit. */
  forWho: string[];
  /** What the appointment includes. */
  includes: string[];
  facts?: ServiceFacts;
  faqs?: Faq[];
  /** Optional photo key from src/content/photos.ts (defaults to the group's or department's photo). */
  photo?: string;
}

/** A sub-heading inside a department (e.g. "Laser & Energy Treatments"). Groups are sections on the department page. */
export interface ServiceGroup {
  id: string;
  name: string;
  intro?: string;
  photo?: string;
  services: Service[];
}

export interface Department {
  /** URL slug and data-dept value (accent colour lives in src/styles/themes.css). */
  id: string;
  name: string;
  /** Short name for menus. */
  short: string;
  icon: IconName;
  /** One line for cards and the hero. */
  tagline: string;
  /** Two or three sentences for the department hero. */
  intro: string;
  /** The "longevity for …" line that ties the department to the brand. */
  longevity: string;
  photo: string;
  /** Three reasons, shown as a row on the department page. */
  why: { t: string; d: string }[];
  /** How a visit works, four steps. */
  steps: { t: string; d: string }[];
  faqs: Faq[];
  groups: ServiceGroup[];
}
