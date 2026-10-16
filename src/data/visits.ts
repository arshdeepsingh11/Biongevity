import type { IconName } from "@/components/ui/icons";

/**
 * Visit walkthroughs for the 3D clinic (Visit3D). Floor plans are illustrative — the order of the visit,
 * the paperwork and what happens at each stop follow how an in-person Biongevity visit runs.
 * Coordinates: x left→right, z back→front (entrance at the front), metres-ish. A corridor runs along z = 1;
 * front-row rooms open onto it from their back wall, back-row rooms from their front wall. Confirm details with the care team.
 */

export type Tone = "glass" | "olive" | "wood" | "white" | "ink" | "teal" | "gold" | "soft";
export interface Room { id: string; label: string; x: number; z: number; w: number; d: number; door: "front" | "back" | "both" | "open"; dx?: number }
export interface Prop { x: number; z: number; w: number; d: number; h: number; y?: number; tone: Tone; kind?: "screen" | "bed" | "plant" }
export interface Staff { x: number; z: number; face: number; role: string; coat: "white" | "olive" | "teal" }
export interface Step {
  id: string; t: string; room: string; at: [number, number]; face: number; icon: IconName; mins: number;
  d: string; bring?: string[]; check?: string[]; ask: string;
}
export interface Visit { id: string; place: string; floor: string; rooms: Room[]; props: Prop[]; staff: Staff[]; steps: Step[]; size: [number, number] }

export const CALGARY_VISIT: Visit = {
  id: "calgary", place: "Calgary Place Tower 1 · Suite 1020", floor: "Floor 10", size: [23, 17],
  rooms: [
    { id: "lobby", label: "Entrance", x: -2.5, z: 7.1, w: 5, d: 1.8, door: "open" },
    { id: "reception", label: "Reception", x: -2.5, z: 4, w: 5, d: 4.4, door: "both", dx: -0.6 },
    { id: "lounge", label: "Lounge", x: -8, z: 4, w: 5, d: 4.4, door: "back" },
    { id: "intake", label: "Smart intake", x: 2.5, z: 4, w: 4, d: 4.4, door: "back" },
    { id: "vitals", label: "Vitals & body", x: 7, z: 4, w: 4, d: 4.4, door: "back" },
    { id: "plan", label: "Plan & booking", x: -8.5, z: -2.2, w: 4, d: 4.8, door: "front" },
    { id: "imaging", label: "Echo & imaging", x: -3.5, z: -2.2, w: 5.5, d: 4.8, door: "front" },
    { id: "consult", label: "Consultation", x: 2.5, z: -2.2, w: 6, d: 4.8, door: "front" },
    { id: "lab", label: "Lab draw", x: 8, z: -2.2, w: 4, d: 4.8, door: "front" },
  ],
  props: [
    { x: -2.4, z: 4, w: 0.8, d: 3, h: 1.05, tone: "wood" }, { x: -2.1, z: 4, w: 0.12, d: 0.9, h: 0.5, y: 1.05, tone: "ink", kind: "screen" },
    { x: -9.6, z: 4.8, w: 0.9, d: 2.6, h: 0.45, tone: "olive" }, { x: -6.6, z: 5.6, w: 1.8, d: 0.8, h: 0.45, tone: "olive" }, { x: -8.2, z: 4.6, w: 1.2, d: 0.8, h: 0.4, tone: "wood" },
    { x: -10, z: 2.4, w: 0.6, d: 0.6, h: 1.4, tone: "teal", kind: "plant" }, { x: 0.3, z: 7.4, w: 0.6, d: 0.6, h: 1.4, tone: "teal", kind: "plant" },
    { x: 3.7, z: 5.2, w: 0.7, d: 0.5, h: 1.3, tone: "white" }, { x: 3.7, z: 4.92, w: 0.6, d: 0.08, h: 0.45, y: 1.3, tone: "ink", kind: "screen" }, { x: 1.3, z: 5.4, w: 0.9, d: 0.9, h: 0.45, tone: "olive" },
    { x: 8.3, z: 5.3, w: 0.5, d: 0.5, h: 1.6, tone: "white" }, { x: 5.9, z: 4.6, w: 0.8, d: 0.6, h: 0.1, tone: "ink" }, { x: 8.2, z: 3.4, w: 0.8, d: 0.8, h: 0.45, tone: "olive" },
    { x: 9.0, z: -2.8, w: 1.0, d: 1.6, h: 0.9, tone: "teal" }, { x: 6.8, z: -3.8, w: 1.2, d: 0.5, h: 1.0, tone: "white" },
    { x: 2.5, z: -3.2, w: 2.2, d: 1, h: 0.75, tone: "wood" }, { x: 2.5, z: -3.75, w: 1.0, d: 0.08, h: 0.55, y: 0.75, tone: "ink", kind: "screen" }, { x: 4.6, z: -1.6, w: 1.8, d: 0.8, h: 0.7, tone: "white", kind: "bed" },
    { x: -4.6, z: -3.0, w: 2.0, d: 0.9, h: 0.7, tone: "white", kind: "bed" }, { x: -2.2, z: -3.6, w: 0.8, d: 0.6, h: 1.5, tone: "ink" }, { x: -2.2, z: -3.95, w: 0.7, d: 0.08, h: 0.5, y: 1.5, tone: "teal", kind: "screen" },
    { x: -8.5, z: -3.0, w: 1.8, d: 0.7, h: 0.75, tone: "wood" }, { x: -8.5, z: -3.3, w: 0.8, d: 0.08, h: 0.45, y: 0.75, tone: "ink", kind: "screen" },
  ],
  staff: [
    { x: -3.3, z: 4, face: Math.PI / 2, role: "Care coordinator", coat: "olive" },
    { x: 1.4, z: 3.8, face: 1.2, role: "Intake assistant", coat: "olive" },
    { x: 6.0, z: 3.4, face: 0.9, role: "Nurse", coat: "teal" },
    { x: 7.4, z: -3.0, face: 0.4, role: "Phlebotomist", coat: "teal" },
    { x: 2.5, z: -4.1, face: 0, role: "Physician", coat: "white" },
    { x: -2.8, z: -2.6, face: -1.0, role: "Sonographer", coat: "white" },
    { x: -8.5, z: -3.9, face: 0, role: "Care coordinator", coat: "olive" },
  ],
  steps: [
    { id: "arrive", t: "Arrive", room: "lobby", at: [-0.6, 7.2], face: Math.PI, icon: "building", mins: 0, d: "Take the elevator to the 10th floor, Suite 1020. Arrive 10–15 minutes early for a first visit.", bring: ["Photo ID", "Alberta Health Care card", "Referral (if you have one)"], ask: "What should I bring to my first in-person Biongevity visit in Calgary, and where do I go?" },
    { id: "checkin", t: "Check in at reception", room: "reception", at: [-0.6, 4], face: -Math.PI / 2, icon: "clipboard", mins: 5, d: "The care coordinator confirms your identity and booking, scans your health card and opens your record.", check: ["Identity confirmed", "Health card scanned", "Contact details checked"], ask: "What happens at check-in for a Biongevity clinic visit?" },
    { id: "forms", t: "Complete formalities", room: "intake", at: [2.5, 4.6], face: 0.9, icon: "file", mins: 10, d: "On the intake tablet: privacy consent, medical history, medications and your goals. If you did the smart intake at home, it is already filled in.", check: ["Privacy & consent signed", "Medical history", "Medications & allergies", "What you want to improve"], ask: "What forms and consents do I complete at a Biongevity visit, and can I do them before I arrive?" },
    { id: "wait", t: "Settle in the lounge", room: "lounge", at: [-8, 4.2], face: 0.6, icon: "clock", mins: 5, d: "A short wait while the team reviews your intake. Biongevity SI can answer questions on your phone.", ask: "How long will I wait at a Biongevity clinic visit?" },
    { id: "vitals", t: "Vitals & body measures", room: "vitals", at: [7, 4.0], face: -0.9, icon: "gauge", mins: 10, d: "Blood pressure (rested, seated), height, weight, waist and body composition — your baseline.", check: ["Blood pressure ×2", "Height & weight", "Waist", "Body composition"], ask: "Which vitals and body measures are taken at a first Biongevity visit and why?" },
    { id: "lab", t: "Lab draw", room: "lab", at: [8, -2.2], face: 2.4, icon: "test-tube", mins: 10, d: "Blood samples for the tests in your plan. Some panels need fasting — the coordinator tells you when booking.", check: ["Labels matched to your ID", "Samples taken", "Courier to the lab"], ask: "Do I need to fast before blood tests at Biongevity, and which tests need it?" },
    { id: "consult", t: "Consultation", room: "consult", at: [2.5, -2.3], face: Math.PI, icon: "stethoscope", mins: 30, d: "A physician reviews your history, results so far and goals, examines you where needed and agrees next steps with you.", ask: "What happens during a Biongevity physician consultation?" },
    { id: "imaging", t: "Echo or imaging (if planned)", room: "imaging", at: [-3.5, -2.2], face: -2.2, icon: "heart", mins: 30, d: "Only if it answers a real question — for example an echocardiogram or an exercise stress echo.", ask: "When would I need an echocardiogram or stress echo at Biongevity?" },
    { id: "plan", t: "Plan & next booking", room: "plan", at: [-8.5, -2.1], face: Math.PI, icon: "route", mins: 5, d: "You leave with a written plan, the next appointment booked and results flowing into your record and the app.", ask: "What is in the plan I get after a Biongevity visit?" },
  ],
};

export const DUBAI_VISIT: Visit = {
  id: "dubai", place: "AB Center · Office 302, Al Barsha 1", floor: "3rd floor", size: [23, 17],
  rooms: [
    { id: "lift", label: "Lift lobby", x: -2.5, z: 7.1, w: 5, d: 1.8, door: "open" },
    { id: "reception", label: "Reception", x: -2.5, z: 4, w: 5, d: 4.4, door: "both", dx: -0.6 },
    { id: "majlis", label: "Majlis lounge", x: -8, z: 4, w: 5, d: 4.4, door: "back" },
    { id: "body", label: "Body composition", x: 2.5, z: 4, w: 4, d: 4.4, door: "back" },
    { id: "fitness", label: "Fitness & VO₂", x: 7, z: 4, w: 4, d: 4.4, door: "back" },
    { id: "plan", label: "Results & plan", x: -8.5, z: -2.2, w: 4, d: 4.8, door: "front" },
    { id: "aesthetics", label: "Precision aesthetics", x: -3.5, z: -2.2, w: 5.5, d: 4.8, door: "front" },
    { id: "consult", label: "Precision consult", x: 2.5, z: -2.2, w: 6, d: 4.8, door: "front" },
    { id: "lab", label: "Lab & genetics", x: 8, z: -2.2, w: 4, d: 4.8, door: "front" },
  ],
  props: [
    { x: -2.4, z: 4, w: 0.8, d: 3, h: 1.05, tone: "gold" }, { x: -2.1, z: 4, w: 0.12, d: 0.9, h: 0.5, y: 1.05, tone: "ink", kind: "screen" },
    { x: -9.8, z: 4.2, w: 0.8, d: 3.4, h: 0.45, tone: "gold" }, { x: -8, z: 5.8, w: 3.2, d: 0.8, h: 0.45, tone: "gold" }, { x: -8, z: 4.2, w: 1.2, d: 1.2, h: 0.35, tone: "wood" },
    { x: 0.3, z: 7.4, w: 0.6, d: 0.6, h: 1.4, tone: "teal", kind: "plant" }, { x: -10, z: 2.4, w: 0.6, d: 0.6, h: 1.4, tone: "teal", kind: "plant" },
    { x: 2.5, z: 5.0, w: 0.8, d: 0.8, h: 0.12, tone: "ink" }, { x: 2.5, z: 5.3, w: 0.15, d: 0.15, h: 1.1, tone: "white" },
    { x: 7.6, z: 5.2, w: 1.6, d: 0.6, h: 1.0, tone: "ink" }, { x: 8.5, z: 3.0, w: 0.6, d: 0.6, h: 1.4, tone: "white" },
    { x: 9.0, z: -2.8, w: 1.0, d: 1.6, h: 0.9, tone: "teal" }, { x: 6.8, z: -3.8, w: 1.2, d: 0.5, h: 1.0, tone: "white" },
    { x: 2.5, z: -3.2, w: 2.2, d: 1, h: 0.75, tone: "wood" }, { x: 2.5, z: -3.75, w: 1.0, d: 0.08, h: 0.55, y: 0.75, tone: "ink", kind: "screen" },
    { x: -4.6, z: -3.0, w: 2.0, d: 0.9, h: 0.7, tone: "white", kind: "bed" }, { x: -2.0, z: -3.8, w: 0.8, d: 0.6, h: 1.3, tone: "olive" },
    { x: -8.5, z: -3.0, w: 1.8, d: 0.7, h: 0.75, tone: "wood" }, { x: -8.5, z: -3.3, w: 0.8, d: 0.08, h: 0.45, y: 0.75, tone: "ink", kind: "screen" },
  ],
  staff: [
    { x: -3.3, z: 4, face: Math.PI / 2, role: "Patient coordinator", coat: "olive" },
    { x: 1.3, z: 3.6, face: 1.2, role: "Nurse", coat: "teal" },
    { x: 6.0, z: 5.0, face: 2.0, role: "Exercise physiologist", coat: "teal" },
    { x: 7.4, z: -3.0, face: 0.4, role: "Lab nurse", coat: "teal" },
    { x: 2.5, z: -4.1, face: 0, role: "Physician", coat: "white" },
    { x: -2.6, z: -2.4, face: -1.0, role: "Aesthetic clinician", coat: "white" },
    { x: -8.5, z: -3.9, face: 0, role: "Patient coordinator", coat: "olive" },
  ],
  steps: [
    { id: "arrive", t: "Arrive at AB Center", room: "lift", at: [-0.6, 7.2], face: Math.PI, icon: "building", mins: 0, d: "AB Center on Sheikh Zayed Road, Al Barsha 1. Take the lift to the 3rd floor, office 302. Arrive 15 minutes early; a full assessment day is long, so wear comfortable clothes.", bring: ["Emirates ID or passport", "Insurance card (if you will claim)", "Recent reports and medication list", "Comfortable clothes and trainers"], ask: "What should I bring to a full-day assessment at Biongevity Clinic Dubai?" },
    { id: "checkin", t: "Registration", room: "reception", at: [-0.6, 4], face: -Math.PI / 2, icon: "clipboard", mins: 10, d: "The patient coordinator registers you with your Emirates ID or passport, confirms insurance or self-pay, and walks you through the day's schedule.", check: ["ID registered", "Insurance or self-pay confirmed", "Schedule for the day explained"], ask: "How does registration work at Biongevity Clinic Dubai?" },
    { id: "forms", t: "Consent & history", room: "majlis", at: [-8, 3.2], face: 0, icon: "file", mins: 15, d: "In the lounge, on a tablet: consent for assessments and genetic testing, health history, medications and goals. Forms can be completed in advance.", check: ["Assessment consent", "Genetic testing consent", "Health history", "Medications & goals"], ask: "Which consents do I sign for genetic and longevity testing at Biongevity Dubai?" },
    { id: "body", t: "Body composition", room: "body", at: [2.5, 4.4], face: 0.9, icon: "scale", mins: 15, d: "Weight, height, waist and a body-composition scan — muscle, fat and visceral fat as your baseline.", check: ["Height & weight", "Body-composition scan", "Waist"], ask: "What does a body composition scan show and why does it matter for longevity?" },
    { id: "fitness", t: "Fitness & VO₂ test", room: "fitness", at: [7, 4.2], face: 0, icon: "activity", mins: 30, d: "Cardiorespiratory fitness on a bike or treadmill with heart monitoring — fitness is one of the strongest predictors of a long life.", check: ["Resting ECG & BP", "Graded exercise", "Recovery"], ask: "Why is VO2 max so important for longevity and how is it measured?" },
    { id: "lab", t: "Lab & genetic samples", room: "lab", at: [8, -2.2], face: 2.4, icon: "dna", mins: 15, d: "Blood for metabolic and longevity markers; a cheek or saliva sample if genetic or microbiome testing is part of your plan.", check: ["Fasting confirmed", "Blood samples", "Genetic / microbiome sample (if planned)"], ask: "Which lab and genetic samples are taken at a Biongevity Dubai assessment?" },
    { id: "consult", t: "Precision consultation", room: "consult", at: [2.5, -2.3], face: Math.PI, icon: "stethoscope", mins: 40, d: "A physician brings the day together — history, examination, first results — and agrees priorities with you.", ask: "What happens in the precision consultation at Biongevity Dubai?" },
    { id: "aesthetics", t: "Precision aesthetics (optional)", room: "aesthetics", at: [-3.5, -2.2], face: -2.2, icon: "face", mins: 20, d: "If you want it: a skin assessment and an evidence-based plan alongside your health results.", ask: "What does precision aesthetics include at Biongevity Dubai?" },
    { id: "plan", t: "Results & longevity plan", room: "plan", at: [-8.5, -2.1], face: Math.PI, icon: "route", mins: 15, d: "Same-day results are reviewed; lab and genetic results follow in your record and the app. You leave with a plan and your next review booked.", ask: "When do I get my results after a Biongevity Dubai assessment?" },
  ],
};
