import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { UAE_CLINIC, waLink } from "@/content/contact";
import { t, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";
const sz = (s: Size) => (s === "sm" ? "btn6-sm" : s === "lg" ? "btn6-lg" : "");

/**
 * Book now — opens WhatsApp with a booking message for `item`, so the clinic team can confirm a time.
 * Prices are not shown on the site; the team shares prices and offers on WhatsApp.
 * data-book makes it a `book_click` conversion; data-item (`track`, the English name) says which service.
 */
export function BookNow({ l = "en", item, track, label, size = "md", className, variant = "primary" }: { l?: Locale; item?: string; track?: string; label?: ReactNode; size?: Size; className?: string; variant?: "primary" | "light" | "dept" }) {
  const v = variant === "light" ? "btn6-light" : variant === "dept" ? "btn6-dept" : "btn6-primary";
  const d = t(l);
  return (
    <a href={waLink(item ? d.wa.book(item) : d.wa.general)} target="_blank" rel="noopener" data-book data-item={track ?? item} className={cn("btn6", v, sz(size), className)}>
      <Icon name="calendar" size={size === "sm" ? 16 : 18} />{label ?? d.bookNow}
    </a>
  );
}

/** WhatsApp us — a pre-filled chat with the clinic's business WhatsApp. */
export function WhatsAppBtn({ l = "en", text, label, size = "md", className, item, variant = "wa" }: { l?: Locale; text?: string; label?: ReactNode; size?: Size; className?: string; item?: string; variant?: "wa" | "ghost" | "outline-light" }) {
  const v = variant === "ghost" ? "btn6-ghost" : variant === "outline-light" ? "btn6-outline-light" : "btn6-wa";
  const d = t(l);
  return (
    <a href={waLink(text ?? d.wa.general)} target="_blank" rel="noopener" data-item={item} className={cn("btn6", v, sz(size), className)}>
      <Icon name="whatsapp" size={size === "sm" ? 17 : 19} weight="fill" />{label ?? d.whatsappUs}
    </a>
  );
}

/** Ask for price — WhatsApp with a price/offer question about `item`. */
export function PriceBtn({ l = "en", item, track, size = "md", className, variant = "ghost" }: { l?: Locale; item: string; track?: string; size?: Size; className?: string; variant?: "ghost" | "outline-light" }) {
  const d = t(l);
  return <WhatsAppBtn l={l} text={d.wa.price(item)} label={d.askForPrice} size={size} className={className} item={track ?? item} variant={variant} />;
}

/** Call the clinic. The number is always shown left-to-right. */
export function CallBtn({ size = "md", className, variant = "ghost" }: { size?: Size; className?: string; variant?: "ghost" | "outline-light" }) {
  return (
    <a href={UAE_CLINIC.tel} className={cn("btn6", variant === "outline-light" ? "btn6-outline-light" : "btn6-ghost", sz(size), className)}>
      <Icon name="call" size={size === "sm" ? 16 : 18} /><span dir="ltr">{UAE_CLINIC.phone}</span>
    </a>
  );
}
