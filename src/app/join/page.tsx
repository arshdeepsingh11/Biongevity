import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { AuroraText } from "@/components/fx/AuroraText";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { AIPanel } from "@/components/ai/AIPanel";
import { env } from "@/lib/env";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Join Biongevity — your patient app",
  description: "Create your Biongevity account: your Digital Twin, results, personal plan, AI coach, consultations and family sharing in one patient app.",
  alternates: { canonical: "/join/" },
};

const SIGNUP = `${env.appUrl}/en/auth/signup`;
const PATIENT = `${env.appUrl}/en/patient`;
const LOGIN = `${env.appUrl}/en/auth/login`;

const GET = [
  { t: "Your Digital Twin", d: "Health and Recovery scores, live signals and every body system, compared with your own baseline.", icon: "fingerprint" },
  { t: "Results & reports", d: "Lab, genome and clinic reports in one place, explained in plain words.", icon: "file" },
  { t: "Your personal plan", d: "The tests, formulas and visits chosen for you — and why each one is there.", icon: "route" },
  { t: "AI coach", d: "Ask Biongevity SI anything about your data, any time, in four languages.", icon: "sparkle" },
  { t: "Consultations", d: "Book virtual or in-person visits with the care team in a few taps.", icon: "calendar" },
  { t: "Family sharing", d: "Give a parent, partner or child a permissioned view — you choose what they see.", icon: "users" },
];
