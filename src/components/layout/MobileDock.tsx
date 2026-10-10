"use client";
import { usePathname, useRouter } from "next/navigation";
import { DOCK } from "@/data/site";
import { AppleDock } from "@/components/fx/AppleDock";

/** Bottom tab bar on phones/tablets (and in the Capacitor app) — the Apple Dock component. */
export function MobileDock() {
  const path = usePathname();
  const router = useRouter();
  const items = DOCK.map((d) => ({
    icon: d.icon, label: d.label,
    active: d.href === "/" ? path === "/" : path.startsWith(d.href),
    onClick: () => router.push(d.href),
  }));
  return (
    <div className="fixed inset-x-0 bottom-0 z-[75] px-3 pb-[calc(10px+var(--safe-bottom))] lg:hidden">
      <AppleDock items={items} base={46} magnify={1.35} className="w-fit" />
    </div>
  );
}
