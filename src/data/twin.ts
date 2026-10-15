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
