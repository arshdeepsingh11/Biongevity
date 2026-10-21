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
