import { MEDIA } from "@/config/media";
import { DEPARTMENTS } from "@/data/departments";
import { LAB_TESTS } from "@/data/labs";
import { Icon } from "@/components/ui/Icon";
import { BookNow, WhatsAppLink } from "@/components/ui/BookNow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";

const TRUST = [
  { icon: "stethoscope", v: `${DEPARTMENTS.length} specialist departments` },
  { icon: "test-tubes", v: `${LAB_TESTS.length} advanced lab tests` },
  { icon: "heart", v: "Alberta's first onsite exercise stress echo" },
  { icon: "pin", v: "Calgary · Dubai · Almelo · online" },
] as const;

/** Home hero: the clinic film full-bleed, one promise, and the two ways to start — Book now or WhatsApp. */
export function Hero() {
  const m = MEDIA.clinicLoop;
  return (
    <section data-ai="Hero" className="relative z-[1] flex min-h-[100svh] flex-col overflow-hidden bg-ink text-snow">
      <BackgroundVideo src={m.video!} poster={m.poster} className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden className="hero-scrim absolute inset-0" />
      <div className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-[calc(140px+var(--safe-top))] sm:pb-16 sm:pt-[200px]">
        <div className="max-w-[760px]">
          <Reveal><div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-snow/80"><span className="h-px w-6 bg-snow/60" />Longevity &amp; precision health clinic</div></Reveal>
          <SplitReveal as="h1" when="ready" delay={0.1} className="h-display mt-5 !text-snow">Live more good years.</SplitReveal>
          <Reveal delay={160}><p className="mt-6 max-w-[54ch] text-[17px] leading-[1.55] text-snow/85 sm:text-[19px]">Specialist care, advanced testing and a plan built on your own biology — in clinic or by video, with one team that follows you over time.</p></Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookNow size="lg" />
              <WhatsAppLink size="lg" className="!border-0 !bg-white/90 !text-ink hover:!bg-white" />
            </div>
          </Reveal>
        </div>
        <Reveal delay={360}>
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-snow/20 pt-6 text-[13.5px] text-snow/85 sm:mt-16 lg:grid-cols-4">
            {TRUST.map((t) => <li key={t.v} className="flex items-center gap-2.5"><Icon name={t.icon} size={18} className="shrink-0 text-snow/70" />{t.v}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
