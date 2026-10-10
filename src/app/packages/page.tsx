import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AskButton } from "@/components/pages/AskButton";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { AuroraText } from "@/components/fx/AuroraText";
import { Icon } from "@/components/ui/Icon";
import { PACKAGES, SITE_URL } from "@/data/health";

export const metadata: Metadata = { title: "Longevity Packages" };

const GROUPS = [
  { k: "diagnostics", t: "Integrated diagnostics", icon: "flask" },
  { k: "ai", t: "Biongevity AI longevity coach", icon: "sparkle" },
  { k: "app", t: "Biongevity App & integrations", icon: "phone" },
] as const;

export default function PackagesPage() {
  return (
    <>
      <PageHero eyebrow="Longevity packages" title={<>Core. Precision. <AuroraText>Elite.</AuroraText></>}
        lede="Integrated diagnostics, an AI longevity coach, the Biongevity App and bioactives — in three levels of depth.">
        <AskButton q="Compare Core, Precision and Elite">Ask AI to explain the differences</AskButton>
      </PageHero>
      <Section ai="Compare packages" className="!pt-0">
        <div className="container-x grid gap-5 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <div key={p.handle} data-reveal className={`card relative flex flex-col p-7 ${p.featured ? "shadow-glow" : ""}`}>
              {p.featured && <><ShineBorder radius={28} /><span className="absolute right-6 top-6 rounded-full bg-amber px-2.5 py-1 text-[11px] font-bold text-white">Most chosen</span></>}
              <div className="text-[12px] font-semibold uppercase tracking-wider text-faint">{p.cadence}</div>
              <div className="mt-2 text-[28px] font-semibold tracking-tight">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1.5"><span className="text-[15px] font-medium text-muted">USD</span><span className="text-[52px] font-semibold leading-none tracking-tight"><NumberTicker value={p.price} /></span></div>
              {GROUPS.map((g) => (
                <div key={g.k} className="mt-6">
                  <div className="flex items-center gap-2 text-[13px] font-semibold"><Icon name={g.icon} size={15} className="text-accent" />{g.t}</div>
                  <ul className="mt-2.5 space-y-2">{p[g.k].map((t) => <li key={t} className="flex gap-2.5 text-[14px] leading-snug"><span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent-light text-accent"><Icon name="check" size={10} strokeWidth={2.6} /></span>{t}</li>)}</ul>
                </div>
              ))}
              <div className="mt-6 rounded-2xl bg-canvas px-4 py-3 text-[14px]"><span className="text-muted">Bioactives · </span><span className="font-semibold">{p.bioactives}</span></div>
              <div className="flex-1" />
              <a href={p.url} target="_blank" rel="noopener" className={`${p.featured ? "btn-dark" : "btn-light"} mt-8 w-full`}>Buy {p.name.split(" ")[1]}<Icon name="arrow-up-right" size={14} /></a>
            </div>
          ))}
        </div>
        <div className="container-x mt-6">
          <div className="flex gap-3 rounded-2xl bg-accent-light p-4 text-[13px] text-muted"><Icon name="info" size={18} className="shrink-0 text-accent" />Prices and inclusions from <a className="font-semibold text-accent" href={`${SITE_URL}/longevity-packages/`} target="_blank" rel="noopener">biongevity.com/longevity-packages</a>. Checkout happens on biongevity.com; confirm regional availability with a coordinator.</div>
        </div>
      </Section>
    </>
  );
}
