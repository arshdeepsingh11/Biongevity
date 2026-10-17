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
    <>
    <Section ai="Contact" className="pt-[calc(100px+var(--safe-top))] sm:pt-[140px]">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow>Contact · Book</Eyebrow>
          <h1 data-reveal className="h-display mt-4">Start with a conversation.</h1>
          <p data-reveal className="lede mt-5 max-w-[52ch]">Book straight into the Biongevity app: pick a consultation category, choose virtual or in person, and your care team takes it from there. Questions first? Write to us below — Biongevity SI suggests the right department as you type.</p>
          <div data-reveal className="mt-7 flex flex-wrap gap-3">
            <a href={BOOK_URL} target="_blank" rel="noopener" className="btn-dark h-12 px-6"><Icon name="calendar" size={17} />Book a consultation<Icon name="arrow-up-right" size={14} /></a>
            <a href="#message" className="btn-light h-12 px-6"><Icon name="message" size={16} />Send a message</a>
          </div>
          <ul className="mt-8 grid gap-2 text-[13.5px] text-muted sm:grid-cols-3">
            {[["calendar", "Choose a category", "Heart, hormones, skin, family…"], ["video", "Virtual or in person", "Calgary, Dubai or video"], ["shield", "Private by design", "Your record stays yours"]].map(([i, t, d]) => (
              <li key={t} className="flex gap-2.5 rounded-2xl bg-white/60 p-3 ring-1 ring-ink/[0.05] backdrop-blur"><span className="icon-tile h-8 w-8 shrink-0"><Icon name={i} size={15} /></span><span><b className="block text-[13px] font-semibold text-ink">{t}</b><span className="text-[12px]">{d}</span></span></li>
            ))}
          </ul>
        </div>
        <ContactFlow />
      </div>
    </Section>
    <Section ai="Message and offices" id="message" className="!pt-4 scroll-mt-24">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Offices</Eyebrow>
          <h2 className="h-section mt-3">Or reach us directly.</h2>
          <div className="mt-6 grid gap-3">
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
    </>
  );
}
