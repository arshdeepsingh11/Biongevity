import { Suspense } from "react";
import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ContactForm } from "@/components/pages/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { CONTACTS } from "@/data/site";
import { OFFICES } from "@/data/clinic";
import { ContactFlow } from "@/components/pages/ContactFlow";
import { BOOK_URL } from "@/lib/env";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section ai="Contact" className="pt-[calc(100px+var(--safe-top))] sm:pt-[140px]">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 data-reveal className="h-display mt-4">Start with a conversation.</h1>
          <p data-reveal className="lede mt-5">Tell us what you&apos;d like to improve. The AI suggests a starting department as you type.</p>
          <div className="mt-8 grid gap-3">
            {OFFICES.map((o) => (
              <div key={o.city} className="card p-5">
                <div className="flex items-center gap-2 text-[17px] font-semibold"><Icon name="pin" size={17} className="text-accent" />{o.city}<span className="text-[12px] font-medium text-faint">· {o.region}</span></div>
                <div className="mt-1 text-[14px] text-muted">{o.address}</div>
                <div className="mt-2 flex flex-wrap gap-x-4 text-[14px] font-semibold"><a href={o.tel} className="hover:text-accent">{o.phone}</a>{o.email && <a href={`mailto:${o.email}`} className="hover:text-accent">{o.email}</a>}</div>
              </div>
            ))}
            <div className="text-[13px] text-muted">BioAro Labs support · <a href={CONTACTS.labs.tel} className="font-semibold hover:text-accent">{CONTACTS.labs.phone}</a> · <a href={`mailto:${CONTACTS.labs.email}`} className="font-semibold hover:text-accent">{CONTACTS.labs.email}</a></div>
          </div>
        </div>
        <Suspense><ContactForm /></Suspense>
      </div>
    </Section>
  );
}
