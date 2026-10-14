import { cn } from "@/lib/utils";

/** Shine Border — animated iridescent border. Place inside a `relative` parent. */
export function ShineBorder({ radius = 28, width = 1.5, className }: { radius?: number; width?: number; className?: string }) {
  return (
    <span aria-hidden data-ai-fx className={cn("pointer-events-none absolute inset-0 z-[1] animate-shine", className)}
      style={{
        borderRadius: radius, padding: width,
        background: "linear-gradient(90deg,rgb(var(--c-ai-hi)),rgb(var(--c-ai)),rgb(var(--c-ai-2)),rgb(var(--c-ai)),rgb(var(--c-ai-hi))) 0 0/200% 100%",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude",
      }} />
  );
}
