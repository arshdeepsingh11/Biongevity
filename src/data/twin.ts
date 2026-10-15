import type { IconName } from "@/components/ui/icons";
import type { Tone } from "@/components/body/BodyHologram";

/**
 * Digital Twin tour — what members see at app.biongevity.com/en/patient/digital-twin, explained in plain words.
 * All values below are EXAMPLE values shaped like the real screen, labelled "Example" wherever they appear.
 */
export const TWIN_PATH = "/en/patient/digital-twin";

export const TWIN_SYSTEMS: { id: string; label: string; status: string; tone: Tone; why: string }[] = [
  { id: "brain", label: "Brain", status: "Needs attention", tone: "attention", why: "Short sleep and low HRV this week can affect focus and mood." },
  { id: "eyes", label: "Eyes", status: "Excellent", tone: "good", why: "No warning signs in your latest results." },
  { id: "lungs", label: "Lungs", status: "Needs attention", tone: "attention", why: "Resting breathing rate rose overnight on two nights." },
  { id: "heart", label: "Heart", status: "Needs attention", tone: "attention", why: "Resting heart rate is up and HRV is down versus your baseline." },
  { id: "liver", label: "Liver", status: "Excellent", tone: "good", why: "Liver markers sit inside your normal range." },
  { id: "gut", label: "Gut", status: "Good", tone: "good", why: "Microbiome diversity is in the mid range." },
  { id: "spine", label: "Bones", status: "Excellent", tone: "good", why: "Vitamin D and activity support bone health." },
  { id: "muscles", label: "Muscles", status: "Good", tone: "good", why: "Steps are steady; strength work would lift this further." },
];

export const STATUS_WORDS = [
  { t: "Excellent", d: "Better than your own usual range. Keep doing what you're doing.", tone: "good" as Tone },
  { t: "Good", d: "Inside your normal range. Nothing to act on.", tone: "good" as Tone },
  { t: "Needs attention", d: "Moved away from your baseline. Xevyo explains why; your care team decides if anything should change.", tone: "attention" as Tone },
];

export interface TourStep { id: string; n: string; s: string; t: string; icon: IconName; where: string; plain: string; points: string[] }
export const TOUR: TourStep[] = [
  { id: "scores", n: "01", s: "Scores", t: "Your scores at a glance", icon: "gauge", where: "Top of the Overview", plain: "Three numbers summarise today. Health Score is your overall picture (0–100). Recovery Score shows how ready your body is today. HRV Status is the variation between heartbeats — higher usually means better recovery.",
    points: ["Health Score updates as new results arrive", "Recovery Score is live from your wearable", "HRV is shown in milliseconds (ms)"] },
  { id: "monitor", n: "02", s: "Live health", t: "Live Health Monitor", icon: "activity", where: "Left column", plain: "Your latest heart rate, HRV, steps and sleep, streamed from your watch or ring. A small trend line shows today's shape.",
    points: ["Works with Apple Health, Health Connect, Garmin, Oura and more", "Tap View all for every signal", "Gaps mean the device wasn't worn"] },
  { id: "body", n: "03", s: "Your body", t: "Your body, system by system", icon: "fingerprint", where: "Centre — the 3D twin", plain: "A 3D model of you. Each body system shows a simple status — Excellent, Good or Needs attention — compared with your own baseline, not just population ranges.",
    points: ["Front and back views", "Tap a system to see what moved", "Personalise your avatar"] },
  { id: "trends", n: "04", s: "Trends", t: "Health Trends", icon: "chart", where: "Right column", plain: "Charts of HRV, sleep, resting heart rate and steps — daily, weekly, monthly or yearly — so you can see direction, not just today's number.",
    points: ["Switch metric with the tabs", "Change the time range", "Look for the trend, not one bad day"] },
  { id: "simulate", n: "05", s: "What-if", t: "Simulations & heat map", icon: "radar", where: "Sidebar → Simulations, Heat Map Simulator", plain: "Ask “what if?”. Move a habit — more sleep, more steps — and see which body systems the change touches and how your scores may respond.",
    points: ["Educational estimates, clearly labelled", "The heat map shows where the effect lands", "Share a scenario with your clinician"] },
  { id: "coach", n: "06", s: "AI Coach", t: "AI Insight & Coach", icon: "sparkle", where: "AI Insight card and Coach", plain: "Xevyo turns the numbers into one plain-language insight and a small next step. Chat with the Coach any time; it escalates anything clinical to your care team.",
    points: ["English and Japanese", "Explains why a status changed", "Never diagnoses or prescribes"] },
];
