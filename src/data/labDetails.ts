/**
 * BioAro Labs test details — taken from each test's page on bioarolabs.com (October 2026): what it is, what it
 * measures, who it is for, sample type, preparation, turnaround and number of markers. Shown in the test book.
 * Keyed by the exact test title used in labs.ts. Educational information, not a diagnosis.
 */
export interface LabDetail { tag: string; about: string; measure: string; who: string[]; sample: string; prep: string; results: string; markers: string }

type Row = [tag: string, about: string, measure: string, who: string[], sample: string, prep: string, results: string, markers: string];

const WB = "Whole Blood", REF = "Referral needed (USA only)", W46 = "4–6 weeks", W23 = "2–3 weeks", W34 = "3–4 weeks", NONE = "No special instructions", NOAB = "No antibiotics in the prior 2 months";
