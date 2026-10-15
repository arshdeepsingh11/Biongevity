import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ScanTeaser } from "@/components/scan/HealthspanScan";

/** Home "Start here": the AI scan for yourself, family care for a parent, and the lab explainer. */
export function StartHere() {
  const side = [
    { href: "/family/", icon: "users", k: "For a parent", t: "Family care planner", d: "Pick what worries you about Mum or Dad. Get a checklist, the right specialist and tests." },
    { href: "/tools/", icon: "flask", k: "Have results already?", t: "Explain my lab results", d: "Paste results; see each value on a range bar; ask Xevyo what it means." },
    { href: "/precision-health/bioaro-labs/#navigator", icon: "test-tubes", k: "Ready to test?", t: "AI Test Navigator", d: "All BioAro Labs tests ranked for your goals, with a value map and buy links." },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
      <ScanTeaser />
      <div className="grid gap-3">
        {side.map((x) => (
          <Link key={x.href} href={x.href} className="card group flex items-start gap-4 p-5 hover:-translate-y-0.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ai-soft text-ai"><Icon name={x.icon} size={21} weight="duotone" /></span>
            <span className="min-w-0 flex-1"><span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{x.k}</span><span className="block text-[17px] font-semibold">{x.t}</span><span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{x.d}</span></span>
            <Icon name="arrow-right" size={16} className="mt-1 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ai" />
          </Link>
        ))}
      </div>
    </div>
  );
}
