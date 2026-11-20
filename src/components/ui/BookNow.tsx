import type { ReactNode } from "react";
import { BOOK_URL } from "@/lib/env";
import { waLink } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { CallLink, CallLine } from "@/components/region/CallLink";
import { cn } from "@/lib/utils";

export { CallLink };

/** The one booking button. Everywhere it reads "Book now" and opens the booking calendar. */
export function BookNow({ label = "Book now", className, light, size = "md" }: { label?: ReactNode; className?: string; light?: boolean; size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? "h-10 px-4 text-[14px]" : size === "lg" ? "h-[52px] px-7 text-[16px]" : "h-12 px-6";
  return (
    <a href={BOOK_URL} target="_blank" rel="noopener" data-book className={cn(light ? "btn-light" : "btn-dark", "whitespace-nowrap", h, className)}>
      <Icon name="calendar" size={size === "sm" ? 15 : 17} />{label}
    </a>
  );
}

/** "WhatsApp us" — opens a chat with the business WhatsApp, pre-filled with a short message. */
export function WhatsAppLink({ label = "WhatsApp us", text, className, size = "md", solid }: { label?: ReactNode; text?: string; className?: string; size?: "sm" | "md" | "lg"; solid?: boolean }) {
  const h = size === "sm" ? "h-10 px-4 text-[14px]" : size === "lg" ? "h-[52px] px-7 text-[16px]" : "h-12 px-6";
  return (
    <a href={waLink(text)} target="_blank" rel="noopener" className={cn(solid ? "btn text-white" : "btn-light", "whitespace-nowrap", h, className)} style={solid ? { background: "#25D366", boxShadow: "0 10px 24px -10px rgb(37 211 102 / .7)" } : undefined}>
      <Icon name="whatsapp" size={size === "sm" ? 16 : 19} weight="fill" className={solid ? "text-white" : "text-[#25D366]"} />{label}
    </a>
  );
}

/** Book now + WhatsApp side by side: the pair that closes every main section. */
export function BookRow({ text, className, center, size = "md" }: { text?: string; className?: string; center?: boolean; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={cn("flex flex-wrap gap-3", center && "justify-center", className)}>
      <BookNow size={size} />
      <WhatsAppLink text={text} size={size} />
    </div>
  );
}

/**
 * Booking band — the closing call to action of a service page: one line, Book now, WhatsApp and the phone number.
 * `text` pre-fills the WhatsApp message with the page's subject.
 */
export function BookBand({ title = "Ready when you are.", lede = "Book a consultation online, or message us on WhatsApp and a coordinator will reply during clinic hours.", text, className }: { title?: ReactNode; lede?: string; text?: string; className?: string }) {
  return (
    <section data-ai="Book" className={cn("relative z-[1] py-14 sm:py-20", className)}>
      <div className="container-x">
        <div className="book-band relative overflow-hidden rounded-[32px] px-6 py-10 text-center sm:px-10 sm:py-14">
          <h2 className="h-section mx-auto max-w-[18ch] text-balance">{title}</h2>
          <p className="lede mx-auto mt-4 max-w-[52ch]">{lede}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookNow size="lg" />
            <WhatsAppLink text={text} size="lg" />
            <CallLink size="lg" className="max-sm:hidden" />
          </div>
          <CallLine className="mt-4 inline-block text-[14px] font-medium text-muted hover:text-accent sm:hidden" />
        </div>
      </div>
    </section>
  );
}
