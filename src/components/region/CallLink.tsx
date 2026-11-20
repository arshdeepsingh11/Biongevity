"use client";
import { Icon } from "@/components/ui/Icon";
import { useRegion } from "./RegionProvider";
import { cn } from "@/lib/utils";

/** Call the clinic for the visitor's region (Calgary head office or the Dubai clinic). */
export function CallLink({ className, size = "md", label }: { className?: string; size?: "sm" | "md" | "lg"; label?: string }) {
  const { office } = useRegion();
  const h = size === "sm" ? "h-10 px-4 text-[14px]" : size === "lg" ? "h-[52px] px-7 text-[16px]" : "h-12 px-6";
  return <a href={office.tel} data-call className={cn("btn-light", h, className)}><Icon name="call" size={16} className="text-accent" />{label ?? office.phone}</a>;
}

/** Plain "or call …" line under a button row. */
export function CallLine({ className }: { className?: string }) {
  const { office } = useRegion();
  return <a href={office.tel} data-call className={className}>or call {office.phone}</a>;
}
