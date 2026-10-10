import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Bento Grid — responsive asymmetric grid. Use `span` for wide/tall cells. */
export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 md:grid-cols-6", className)}>{children}</div>;
}

export function BentoCell({ children, className, span = "md:col-span-2", dark }: { children: ReactNode; className?: string; span?: string; dark?: boolean }) {
  return (
    <div data-reveal data-scan className={cn("relative overflow-hidden rounded-4xl p-6 sm:p-7", dark ? "bg-night text-white" : "bg-white shadow-card ring-1 ring-black/[0.05]", span, className)}>
      {children}
    </div>
  );
}
