import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Crumbs, Head } from "@/components/site/Blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { DEPARTMENTS } from "@/content/uae";
import { UAE_CLINIC, WA, waLink } from "@/content/contact";
import { JsonLd, crumbsLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Contact & Location | Biongevity Dubai, Al Barsha" },
  description: `Book or ask a question on WhatsApp ${UAE_CLINIC.whatsappDisplay}, call ${UAE_CLINIC.phone} or visit us at ${UAE_CLINIC.address.join(", ")}.`,
  alternates: { canonical: "/uae/contact/" },
};

export default function UaeContact() {
  const ways = [
    { icon: "whatsapp", t: "WhatsApp", v: UAE_CLINIC.whatsappDisplay, href: waLink(WA.general), d: "Fastest way to book, ask for prices and offers.", ext: true },
    { icon: "call", t: "Call the clinic", v: UAE_CLINIC.phone, href: UAE_CLINIC.tel, d: "Speak to our front desk team." },
    { icon: "mail", t: "Email", v: UAE_CLINIC.email, href: `mailto:${UAE_CLINIC.email}`, d: "For documents and non-urgent questions." },
    { icon: "pin", t: "Visit", v: UAE_CLINIC.address[0], href: UAE_CLINIC.mapUrl, d: `${UAE_CLINIC.address[1]}, ${UAE_CLINIC.address[2]}`, ext: true },
  ];
  return (
    <>
      <JsonLd data={crumbsLd([["Biongevity Dubai", "/uae/"], ["Contact", "/uae/contact/"]])} />
      <section data-ai="Contact" className="relative isolate overflow-hidden pb-20 pt-[calc(100px+var(--safe-top))] lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[["Dubai", "/uae/"], ["Contact"]]} />
          <Head as="h1" className="mt-8" eyebrow="Contact & location" title={<>We are here <span className="t-italic">to help.</span></>} lede="Message us on WhatsApp to book, ask for prices and current offers, or ask any question. You can also call, email or visit." />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <ul className="grid content-start gap-3">
              {ways.map((w, i) => (
                <li key={w.t} data-rv style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                  <a href={w.href} target={w.ext ? "_blank" : undefined} rel={w.ext ? "noopener" : undefined} className="card6 flex items-start gap-4 p-5">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${w.icon === "whatsapp" ? "bg-[rgb(var(--c-wa))] text-white" : "bg-[rgb(var(--c-canvas))] text-gold-deep"}`}><Icon name={w.icon} size={22} weight={w.icon === "whatsapp" ? "fill" : "regular"} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold uppercase tracking-[.12em] text-faint">{w.t}</span>
                      <span className="mt-0.5 block break-words text-[18px] font-semibold">{w.v}</span>
                      <span className="mt-0.5 block text-[14.5px] text-muted">{w.d}</span>
                    </span>
                    <Icon name={w.ext ? "arrow-up-right" : "arrow-right"} size={16} className="mt-1 text-faint" />
                  </a>
                </li>
              ))}
              <li className="px-1 pt-2 text-[14px] text-muted" data-rv>{UAE_CLINIC.vatNote} {UAE_CLINIC.emergency}</li>
            </ul>
            <div data-rv>
              <h2 className="t-h3 mb-4">Send an enquiry</h2>
              <EnquiryForm mode="uae" interests={["Not sure yet, please advise", ...DEPARTMENTS.map((d) => d.name), "Longevity supplements"]} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
