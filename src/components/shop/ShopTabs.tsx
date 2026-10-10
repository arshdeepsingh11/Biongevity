"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { ProgramsTab } from "./ProgramsTab";
import { HealthPackages } from "@/components/bioaro/HealthPackages";
import { LongevityQuiz } from "@/components/quiz/LongevityQuiz";

const TABS = [
  { id: "programs", label: "Programs", icon: "crown" },
  { id: "packages", label: "Health packages", icon: "box" },
  { id: "match", label: "Find my match", icon: "target" },
] as const;
type Tab = (typeof TABS)[number]["id"];

/** Shop — one place for Biongevity programs, BioAro Labs tests and BioAro Drugs formulas. Tab state lives in ?tab=. */
export function ShopTabs() {
  const [tab, setTab] = useState<Tab>("programs");
  useEffect(() => {
    const read = () => { const t = new URLSearchParams(location.search).get("tab") as Tab | null; if (t && TABS.some((x) => x.id === t)) setTab(t); };
    read(); addEventListener("popstate", read); return () => removeEventListener("popstate", read);
  }, []);
  const go = (t: Tab) => { setTab(t); history.replaceState(null, "", `?tab=${t}`); };
  return (
    <div>
      <div className="sticky top-[calc(64px+var(--safe-top))] z-20 -mx-4 bg-white/75 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div role="tablist" aria-label="Shop sections" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card ring-1 ring-ink/[0.06] sm:inline-flex">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => go(t.id)} className="relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold">
              {tab === t.id && <motion.span layoutId="shopTab" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className={`relative flex items-center gap-2 transition-colors ${tab === t.id ? "text-white" : "text-muted hover:text-ink"}`}><Icon name={t.icon} size={16} />{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8" role="tabpanel">
        {tab === "programs" && <ProgramsTab onMatch={() => go("match")} />}
        {tab === "packages" && <HealthPackages />}
        {tab === "match" && <LongevityQuiz />}
      </div>
    </div>
  );
}
