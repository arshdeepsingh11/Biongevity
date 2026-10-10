import { Suspense } from "react";
import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ContactForm } from "@/components/pages/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { CONTACTS, LOCATIONS } from "@/data/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section ai="Contact" className="pt-[calc(100px+var(--safe-top))] sm:pt-[140px]">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 data-reveal className="h-display mt-4">Start with a conversation.</h1>
          <p data-reveal className="lede mt-5">Tell us what you&apos;d like to improve. The AI suggests a starting department as you type.</p>
          <div className="mt-8 space-y-3 text-[15px]">
            {LOCATIONS.map((l) => <div key={l.city} className="flex items-center gap-2"><Icon name="pin" size={17} className="text-violet" />{l.city}</div>)}
            <a href={CONTACTS.labs.tel} className="flex items-center gap-2 hover:text-violet"><Icon name="call" size={17} className="text-violet" />BioAro Labs · {CONTACTS.labs.phone}</a>
            <a href={`mailto:${CONTACTS.labs.email}`} className="flex items-center gap-2 hover:text-violet"><Icon name="mail" size={17} className="text-violet" />{CONTACTS.labs.email}</a>
            <a href={`mailto:${CONTACTS.drugs.email}`} className="flex items-center gap-2 hover:text-violet"><Icon name="mail" size={17} className="text-violet" />{CONTACTS.drugs.email}</a>
          </div>
          <p className="mt-6 text-[12px] text-faint">Biongevity enquiry phone and email to be confirmed by the client.</p>
        </div>
        <Suspense><ContactForm /></Suspense>
      </div>
    </Section>
  );
}
