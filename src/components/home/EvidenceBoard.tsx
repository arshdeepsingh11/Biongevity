"use client";
import { LineChart, Columns } from "@/components/charts/Charts";
import { AIChartFrame } from "@/components/charts/AICharts";
import { STEPS_RISK, SLEEP_RISK, BP_RISK, LIFE_EXPECTANCY } from "@/data/intelligence";

const HABITS = [0, 1, 2, 3, 4, 5];
const lerp = (a: number, b: number, n: number) => Math.round((a + ((b - a) * n) / 5) * 10) / 10;

/** AI Evidence board — four published findings as charts, each with an AI insight and "Explain". */
export function EvidenceBoard() {
  const steps = STEPS_RISK.bands;
  const gain = Math.round((1 - steps[2].rr) * 100);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <AIChartFrame kicker="Movement" title="Mortality risk falls with daily steps" source={STEPS_RISK.src} data={steps}
        insight={<>Going from about 3,500 to 7,800 steps a day is linked with <b>{gain}% lower</b> risk — most of the benefit comes before 10,000.</>}>
        <LineChart labels={steps.map((b) => `${(b.steps / 1000).toFixed(1)}k steps`)} series={[{ name: "Relative risk", values: steps.map((b) => b.rr) }]} height={180} min={0.4} max={1.05} />
      </AIChartFrame>
      <AIChartFrame kicker="Blood pressure" title="Risk doubles with every +20 mmHg" source={BP_RISK.src} data={{ ref: BP_RISK.ref, doubleEvery: BP_RISK.doubleEvery }}
        insight={<>From 115 to 155 mmHg systolic, cardiovascular death risk is about <b>4×</b> higher (ages 40–69). Home readings catch it early.</>}>
        <LineChart labels={["115", "135", "155", "175"]} series={[{ name: "Relative risk", values: [1, 2, 4, 8] }]} height={180} refLine={{ value: 2, label: "2× at 135" }} />
      </AIChartFrame>
      <AIChartFrame kicker="Sleep" title="Too little and too much sleep both carry risk" source={SLEEP_RISK.src} data={SLEEP_RISK}
        insight={<>Compared with 7–8 hours: short sleep <b>+{Math.round((SLEEP_RISK.short - 1) * 100)}%</b>, long sleep <b>+{Math.round((SLEEP_RISK.long - 1) * 100)}%</b>. Long sleep is often a sign worth checking.</>}>
        <Columns data={[{ label: "Under 6 h", value: SLEEP_RISK.short }, { label: "7–8 h", value: 1 }, { label: "Over 9 h", value: SLEEP_RISK.long }]} unit="×" height={160} highlight="7–8 h" />
      </AIChartFrame>
      <AIChartFrame kicker="Five habits" title="Life expectancy at 50, by healthy habits" source={LIFE_EXPECTANCY.src} data={LIFE_EXPECTANCY}
        insight={<>All five low-risk habits added about <b>{(LIFE_EXPECTANCY.women.five - LIFE_EXPECTANCY.women.zero).toFixed(0)} years</b> for women and <b>{(LIFE_EXPECTANCY.men.five - LIFE_EXPECTANCY.men.zero).toFixed(0)}</b> for men in this study.</>}>
        <LineChart labels={HABITS.map((n) => `${n} habits`)} series={[{ name: "Women", values: HABITS.map((n) => lerp(LIFE_EXPECTANCY.women.zero, LIFE_EXPECTANCY.women.five, n)) }, { name: "Men", values: HABITS.map((n) => lerp(LIFE_EXPECTANCY.men.zero, LIFE_EXPECTANCY.men.five, n)), dashed: true }]} height={180} unit=" yrs" />
      </AIChartFrame>
    </div>
  );
}
