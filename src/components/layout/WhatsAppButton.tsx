"use client";
import { usePathname } from "next/navigation";
import { waLink } from "@/data/site";
import { Icon } from "@/components/ui/Icon";

/**
 * Fixed WhatsApp button, bottom right on every page: one tap opens a chat with the business WhatsApp.
 * On phones it floats above the sticky Book bar; on desktop it sits in the corner with a label.
 */
export function WhatsAppButton() {
  const path = usePathname();
  if (/^\/(admin|login)/.test(path)) return null;
  return (
    <a href={waLink()} target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"
      className="wa-fab fixed bottom-[calc(80px+var(--safe-bottom))] right-3 z-[97] flex h-14 items-center gap-2.5 rounded-full pl-[13px] pr-[13px] text-white shadow-lift transition-transform hover:-translate-y-0.5 lg:bottom-6 lg:right-6 lg:pr-5">
      <Icon name="whatsapp" size={30} weight="fill" />
      <span className="hidden text-[15px] font-semibold lg:inline">WhatsApp us</span>
    </a>
  );
}
