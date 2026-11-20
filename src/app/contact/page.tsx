import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Head } from "@/components/site/Blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { INTERNATIONAL } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Biongevity International: ${INTERNATIONAL.email}. For the Dubai clinic, visit Biongevity Dubai.`,
  alternates: { canonical: "/contact/" },
};

/** International contact: basic details only (no clinic). Dubai patients are sent to the Dubai clinic site. */
export default function Contact() {
  return (
    <section data-ai="Contact" className="relative isolate overflow-hidden pb-24 pt-[calc(110px+var(--safe-top))] lg:pt-[150px]">
      <div className="hero-glow" /><div className="grain" />
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Head as="h1" eyebrow="Contact" title={<>Talk to <span className="t-italic">Biongevity.</span></>} lede={`Questions about Biongevity, our United States launch in ${INTERNATIONAL.usLaunch}, partnerships or press? Send us a message.`} />
          <ul className="mt-10 grid gap-3" data-rv>
            <li><a href={`mailto:${INTERNATIONAL.email}`} className="card6 flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--c-canvas))] text-gold-deep"><Icon name="mail" size={22} /></span>
              <span><span className="block text-[13px] font-semibold uppercase tracking-[.12em] text-faint">Email</span><span className="block text-[18px] font-semibold">{INTERNATIONAL.email}</span></span>
            </a></li>
            <li><Link href="/uae/contact/" className="card6 flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--c-canvas))] text-gold-deep"><Icon name="pin" size={22} /></span>
              <span className="flex-1"><span className="block text-[13px] font-semibold uppercase tracking-[.12em] text-faint">Patients in the UAE</span><span className="block text-[18px] font-semibold">Contact Biongevity Dubai</span></span>
              <Icon name="arrow-right" size={16} className="text-faint" />
            </Link></li>
          </ul>
        </div>
        <div id="updates" className="anchor6" data-rv>
          <h2 className="t-h3 mb-4">Send a message</h2>
          <EnquiryForm mode="intl" interests={["United States launch", "Other countries", "Partnerships", "Press", "Something else"]} />
        </div>
      </div>
    </section>
  );
}
