import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { UAE_CLINIC, WA, waLink } from "@/content/contact";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";
const sz = (s: Size) => (s === "sm" ? "btn6-sm" : s === "lg" ? "btn6-lg" : "");

/**
 * Book now — opens WhatsApp with a booking message for `item`, so the clinic team can confirm a time.
 * (Prices are not shown on the site; the team shares prices and offers on WhatsApp.)
 * data-book makes it a `book_click` conversion in Analytics; data-item says which service.
 */
export function BookNow({ item, label = "Book now", size = "md", className, variant = "primary" }: { item?: string; label?: ReactNode; size?: Size; className?: string; variant?: "primary" | "light" | "dept" }) {
  const v = variant === "light" ? "btn6-light" : variant === "dept" ? "btn6-dept" : "btn6-primary";
  return (
    <a href={waLink(item ? WA.book(item) : WA.general)} target="_blank" rel="noopener" data-book data-item={item} className={cn("btn6", v, sz(size), className)}>
      <Icon name="calendar" size={size === "sm" ? 16 : 18} />{label}
    </a>
  );
}

/** WhatsApp us — a pre-filled chat with the clinic's business WhatsApp. */
export function WhatsAppBtn({ text = WA.general, label = "WhatsApp us", size = "md", className, item, variant = "wa" }: { text?: string; label?: ReactNode; size?: Size; className?: string; item?: string; variant?: "wa" | "ghost" | "outline-light" }) {
  const v = variant === "ghost" ? "btn6-ghost" : variant === "outline-light" ? "btn6-outline-light" : "btn6-wa";
  return (
    <a href={waLink(text)} target="_blank" rel="noopener" data-item={item} className={cn("btn6", v, sz(size), className)}>
      <Icon name="whatsapp" size={size === "sm" ? 17 : 19} weight="fill" />{label}
    </a>
  );
}

/** Ask for price — WhatsApp with a price/offer question about `item`. */
export function PriceBtn({ item, size = "md", className, variant = "ghost" }: { item: string; size?: Size; className?: string; variant?: "ghost" | "outline-light" }) {
  return <WhatsAppBtn text={WA.price(item)} label="Ask for price" size={size} className={className} item={item} variant={variant} />;
}

/** Call the clinic. */
export function CallBtn({ size = "md", className, variant = "ghost" }: { size?: Size; className?: string; variant?: "ghost" | "outline-light" }) {
  return (
    <a href={UAE_CLINIC.tel} className={cn("btn6", variant === "outline-light" ? "btn6-outline-light" : "btn6-ghost", sz(size), className)}>
      <Icon name="call" size={size === "sm" ? 16 : 18} />{UAE_CLINIC.phone}
    </a>
  );
}
