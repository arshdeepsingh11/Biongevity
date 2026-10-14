import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIPanel } from "@/components/ai/AIPanel";
import { Logo } from "@/components/ui/Logo";
import { PORTALS } from "@/data/platform";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Biongevity app — members, clinicians and family members.",
  alternates: { canonical: "/login/" },
  robots: { index: false, follow: true },
};

/** Sign-in happens in the member app. This page only sends each role there. */
export default function LoginPage() {
  return (
    <Section ai="Sign in" chip={false} className="pt-[calc(100px+var(--safe-top))] sm:pt-[140px]">
      <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="flex items-center gap-3"><XevyoOrb size={44} live halo /><Logo size={26} /></div>
          <h1 className="h-display mt-6 max-w-[14ch]">Welcome back.</h1>
          <p className="lede mt-4 max-w-[52ch]">Your digital twin, results, plan and Xevyo coach live in the Biongevity app. Choose how you sign in — you&apos;ll continue on <span className="font-semibold text-ink">{env.appUrl.replace(/^https?:\/\//, "")}</span>.</p>
          <div className="mt-8 grid gap-3">
            {PORTALS.map((p) => (
              <a key={p.id} href={env.appUrl} className="group flex items-center gap-4 rounded-[22px] bg-white p-4 shadow-card ring-1 ring-ink/[0.07] transition hover:-translate-y-0.5 hover:ring-ai/35 sm:p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-light text-accent"><Icon name={p.icon} size={22} weight="duotone" /></span>
                <span className="flex-1"><span className="block text-[18px] font-semibold">{p.t}</span><span className="block text-[14px] text-muted">{p.d}</span></span>
                <span className="btn-dark h-10 px-4 text-[14px]">Continue<Icon name="arrow-up-right" size={14} /></span>
              </a>
            ))}
          </div>
          <p className="mt-5 text-[13px] text-muted">New to Biongevity? <Link href="/shop/#depth" className="font-semibold text-accent underline">Start with a baseline</Link> · Clinic or institution? <Link href="/bioelr/" className="font-semibold text-accent underline">See BioELR</Link></p>
          <p className="mt-2 text-[12px] text-faint">This website never asks for your password. Sign-in is handled by the Biongevity app.</p>
        </div>
        <AIPanel title="Need help signing in?" context="Signing in to the Biongevity app" prompts={["How do I sign in to the app?", "What can a family member see?", "I'm a clinician — how do I get access?"]} className="self-start" />
      </div>
    </Section>
  );
}
