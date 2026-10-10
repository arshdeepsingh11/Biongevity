import type { IconName } from "@/components/ui/icons";

/**
 * Clinical detail per department — when to come in, what we look for, care & tests, the visit path and FAQs.
 * Written in our own words from public pages at neyuhealth.com (BioAro's sister clinic) and biongevity.com.
 * General information only; services vary by location and are confirmed by the care team.
 */

export type ToolId = "bp" | "bmi" | "hba1c" | "fibre" | "sleep" | "uv" | "oral" | "bone" | "crc";

export interface CareDetail {
  when: string[];
  signs: string[];
  care: { t: string; d: string; icon: IconName }[];
  path: { t: string; d: string }[];
  faq: { q: string; a: string }[];
  tool: ToolId;
  urgent?: string;
  source: string;
}

const NEYU = "https://neyuhealth.com";
const PATH = [
  { t: "Book or refer", d: "Book directly, or come with a referral from your family doctor." },
  { t: "Consultation", d: "A specialist reviews your history, goals and any previous results." },
  { t: "Testing", d: "Only the tests that answer your questions — many on the same day." },
  { t: "Your plan", d: "A written plan, results in your record and a follow-up date." },
];

export const CARE: Record<string, CareDetail> = {
  "internal-medicine": {
    when: ["You live with more than one long-term condition", "Symptoms like fatigue or weight change have no clear cause", "Lab results came back abnormal and need a plan", "You want a thorough preventive check-up", "Thyroid, blood sugar or blood pressure need closer management"],
    signs: ["Persistent tiredness", "Unexplained weight gain or loss", "High blood sugar or HbA1c", "Thyroid symptoms (cold, hair or skin change)", "High blood pressure", "Abnormal cholesterol"],
    care: [
      { icon: "clipboard", t: "Comprehensive assessment", d: "History, examination and a baseline panel reviewed as a whole, not organ by organ." },
      { icon: "droplet", t: "Diabetes & metabolic care", d: "HbA1c, insulin resistance and weight — with nutrition and activity built into the plan." },
      { icon: "test-tube", t: "Endocrinology", d: "Thyroid, adrenal and hormone disorders investigated and managed." },
      { icon: "gauge", t: "Blood pressure & lipids", d: "Home and ambulatory readings, lipid profiles and cardiovascular risk scoring." },
      { icon: "dna", t: "Genomic risk review", d: "Inherited risk from whole-genome sequencing translated into screening timelines." },
      { icon: "scan", t: "Imaging coordination", d: "Ultrasound, MRI and other imaging ordered when it changes a decision." },
    ],
    path: PATH,
    faq: [
      { q: "What does an internist do?", a: "Internal medicine specialists look after adults with complex or multiple conditions, connecting symptoms, labs and medications into one plan." },
      { q: "Do I need a referral?", a: "Some services and insurers require one. Our coordinators confirm what applies to you before booking." },
      { q: "How often should results be reviewed?", a: "Usually once a year for prevention, more often when a condition is being adjusted. Your plan sets the cadence." },
    ],
    tool: "bmi", source: `${NEYU}/specialties/internal-medicine`,
  },
  cardiology: {
    when: ["Chest discomfort, especially with exertion", "Palpitations or a racing, irregular heartbeat", "Breathlessness or swelling in the ankles", "Dizziness or fainting", "Repeated high blood-pressure readings", "A family history of early heart disease"],
    signs: ["Chest pain or pressure", "Palpitations", "Shortness of breath", "Fatigue on exertion", "Light-headedness", "High blood pressure"],
    care: [
      { icon: "stethoscope", t: "Cardiology consultation", d: "Symptoms, risk factors and family history reviewed by a cardiologist." },
      { icon: "activity", t: "ECG", d: "A quick recording of the heart's electrical activity at rest." },
      { icon: "timer", t: "Holter monitoring", d: "A small recorder worn for 24–48 hours to catch rhythm changes in daily life." },
      { icon: "heart", t: "Echocardiography", d: "Ultrasound of the heart's structure, valves and pumping strength." },
      { icon: "dumbbell", t: "Exercise stress echo", d: "Heart images before and after exercise to reveal problems that appear under load." },
      { icon: "scan", t: "Carotid ultrasound", d: "Checks the neck arteries for plaque and narrowing." },
      { icon: "atom", t: "Myocardial perfusion imaging", d: "Shows blood flow to the heart muscle at rest and under stress." },
      { icon: "gauge", t: "24-hour ambulatory BP", d: "Readings every 20–30 minutes for a true picture of day and night pressure." },
    ],
    path: PATH,
    faq: [
      { q: "How do I prepare for a Holter monitor?", a: "Shower beforehand, wear loose clothing and keep a short diary of activities and symptoms. Avoid getting the device wet." },
      { q: "Is a stress echo safe?", a: "Yes — it is supervised throughout, and the test is stopped if there is any concern." },
      { q: "What blood pressure should I aim for at home?", a: "Hypertension Canada uses an average home reading below 135/85 mmHg. Your clinician may set a personal target." },
    ],
    urgent: "Chest pain lasting more than a few minutes, fainting, or sudden breathlessness is an emergency — call 911.",
    tool: "bp", source: `${NEYU}/specialties/cardiology`,
  },
  dermatology: {
    when: ["Acne, eczema or psoriasis that keeps returning", "A mole that changes in size, shape or colour", "Pigmentation or sun damage", "Visible signs of ageing you want to address", "Sensitivity or irritation without a clear cause"],
    signs: ["Breakouts", "Dry, itchy patches", "Redness or flushing", "Dark spots", "Changing moles", "Fine lines"],
    care: [
      { icon: "face", t: "Skin analysis", d: "Hydration, texture, pores and pigmentation measured with an imaging analyser." },
      { icon: "microscope", t: "Skin microbiome test", d: "Finds bacterial and fungal imbalances behind irritation or acne." },
      { icon: "sparkle", t: "Laser treatments", d: "Hair removal, pigmentation and resurfacing with medical-grade lasers." },
      { icon: "droplet", t: "HydraFacial", d: "Cleanse, exfoliate, extract and hydrate in one session." },
      { icon: "bolt", t: "HIFU tightening", d: "Non-invasive ultrasound lifting that stimulates collagen." },
      { icon: "shield", t: "Medical dermatology", d: "Diagnosis and treatment plans for chronic skin conditions." },
    ],
    path: PATH,
    faq: [
      { q: "When should a mole be checked?", a: "Use ABCDE: Asymmetry, irregular Border, uneven Colour, Diameter over 6 mm, or Evolving. Any of these is worth a prompt review." },
      { q: "What does a skin microbiome test show?", a: "Which microbes live on your skin and whether the balance may be contributing to symptoms." },
      { q: "How many laser sessions will I need?", a: "It depends on the treatment and skin type — usually a short series spaced weeks apart. You'll get a plan at consultation." },
    ],
    tool: "uv", source: NEYU,
  },
  dental: {
    when: ["Gums that bleed when brushing", "Persistent bad breath", "Tooth sensitivity or pain", "It has been over a year since your last check-up", "You want cosmetic changes to your smile"],
    signs: ["Bleeding gums", "Bad breath", "Sensitivity", "Toothache", "Loose teeth", "Dry mouth"],
    care: [
      { icon: "microscope", t: "Oral microbiome test", d: "Detects harmful bacteria early, before cavities or gum disease set in." },
      { icon: "tooth", t: "Check-up & hygiene", d: "Examination, cleaning and early detection." },
      { icon: "shield", t: "Root canal treatment", d: "Saves infected teeth and relieves pain." },
      { icon: "sparkle", t: "Cosmetic dentistry", d: "Whitening, veneers and smile design." },
      { icon: "bone", t: "Implants & restorative", d: "Replace missing teeth and restore function." },
      { icon: "baby", t: "Children's dentistry", d: "Gentle care that builds good habits early." },
    ],
    path: PATH,
    faq: [
      { q: "Why does oral health matter for longevity?", a: "Gum disease is linked with heart and metabolic conditions. Healthy gums are part of a healthy body." },
      { q: "How often should I visit?", a: "Most adults benefit from a check-up every 6–12 months; your dentist may suggest more often." },
      { q: "Is the oral microbiome test painful?", a: "No — it is a simple saliva or swab sample." },
    ],
    tool: "oral", source: NEYU,
  },
  "womens-health": {
    when: ["Your cycle has changed", "Perimenopause or menopause symptoms", "You are planning a pregnancy", "Family history of breast or ovarian cancer", "You are over 50 and want a bone-health plan", "Recurrent vaginal infections"],
    signs: ["Irregular cycles", "Hot flushes", "Low energy", "Mood changes", "Sleep disruption", "Recurring infections"],
    care: [
      { icon: "test-tube", t: "Hormone assessment", d: "Estradiol, progesterone, SHBG and more — timed to your cycle." },
      { icon: "dna", t: "Genomic risk", d: "Inherited predisposition for breast and ovarian cancer and osteoporosis." },
      { icon: "microscope", t: "Vaginal & gut microbiome", d: "BioFemme and BioGut tests for infection prevention and balance." },
      { icon: "bone", t: "Bone health", d: "Risk assessment and density screening referrals." },
      { icon: "baby", t: "Fertility support", d: "Preconception planning and hormone optimisation." },
      { icon: "shield", t: "Preventive screening", d: "Cervical and breast screening coordinated to your local guidelines." },
    ],
    path: PATH,
    faq: [
      { q: "When does menopause usually happen?", a: "On average around 51, with perimenopause often starting several years earlier." },
      { q: "Can hormone tests be done at any time?", a: "Some hormones vary across the cycle, so timing matters. We'll tell you which day to test." },
      { q: "Who should consider genetic testing?", a: "Anyone with a strong family history of breast, ovarian or related cancers." },
    ],
    tool: "bone", source: NEYU,
  },
  "mens-health": {
    when: ["Low energy, motivation or libido", "Urinary changes such as frequency at night", "Family history of prostate cancer or heart disease", "You are 40+ and want a structured check-up", "Body composition or performance goals"],
    signs: ["Fatigue", "Low libido", "Night-time urination", "Weight around the waist", "Poor recovery", "Sleep problems"],
    care: [
      { icon: "test-tube", t: "Hormone panel", d: "Total testosterone, SHBG, DHT and related markers." },
      { icon: "dna", t: "Genomic markers", d: "Prostate cancer, cardiovascular and metabolic predisposition." },
      { icon: "scan", t: "Imaging", d: "Prostate ultrasound and cardiac imaging when indicated." },
      { icon: "scale", t: "Body composition", d: "Fat, muscle and bone measured, not guessed." },
      { icon: "heart", t: "Cardiometabolic check", d: "Blood pressure, lipids, glucose and HbA1c." },
      { icon: "dumbbell", t: "Performance plan", d: "Training, recovery and nutrition aligned with your biology." },
    ],
    path: PATH,
    faq: [
      { q: "Should I test my testosterone?", a: "If you have symptoms, yes — ideally a morning sample, repeated before any treatment decision." },
      { q: "When should prostate screening start?", a: "It depends on age and risk. Many guidelines discuss PSA testing from 50, earlier with family history." },
      { q: "What is HbA1c?", a: "Your average blood sugar over about three months — a key marker for diabetes risk." },
    ],
    tool: "hba1c", source: NEYU,
  },
  "gut-health": {
    when: ["Bloating, gas or irregular bowels", "After a course of antibiotics", "Food sensitivities you can't pin down", "Skin or mood concerns that may link to the gut", "You want to optimise digestion and immunity"],
    signs: ["Bloating", "Constipation", "Loose stools", "Food reactions", "Fatigue after meals", "Skin flare-ups"],
    care: [
      { icon: "microscope", t: "Gut microbiome analysis", d: "Diversity, dysbiosis and metabolic efficiency from a stool sample (BioGut)." },
      { icon: "dna", t: "Genomic & epigenetic insight", d: "Predispositions and how lifestyle changes gene expression." },
      { icon: "salad", t: "Precision nutrition", d: "A diet plan built around your microbiome results." },
      { icon: "scan", t: "Endoscopy & colonoscopy", d: "Referral when symptoms need a direct look." },
      { icon: "tablets", t: "Targeted support", d: "Pre- and probiotic strategies matched to your profile." },
      { icon: "chart", t: "Re-testing", d: "Track how your microbiome responds over time." },
    ],
    path: PATH,
    faq: [
      { q: "How is the BioGut test collected?", a: "With an at-home stool kit, posted back to the lab." },
      { q: "How much fibre should I eat?", a: "Health Canada suggests about 25 g a day for adult women and 38 g for men — most people get roughly half." },
      { q: "Can a microbiome test diagnose disease?", a: "No. It shows balance and diversity to guide your plan; diagnoses come from a clinician." },
    ],
    urgent: "Blood in the stool, black stools or unexplained weight loss need a prompt medical review.",
    tool: "fibre", source: NEYU,
  },
  gastroenterology: {
    when: ["Heartburn or reflux more than twice a week", "Difficulty swallowing", "Ongoing abdominal pain", "A lasting change in bowel habit", "Family history of bowel cancer", "You're due for colorectal screening"],
    signs: ["Heartburn", "Abdominal pain", "Diarrhoea or constipation", "Blood in stool", "Swallowing difficulty", "Unexplained weight loss"],
    care: [
      { icon: "stethoscope", t: "Gastro consultation", d: "A specialist review of symptoms, diet and history." },
      { icon: "scan", t: "Gastroscopy", d: "A camera check of the oesophagus, stomach and duodenum." },
      { icon: "microscope", t: "Colonoscopy", d: "The gold-standard bowel cancer screen, removing polyps on the spot." },
      { icon: "flame", t: "Reflux management", d: "Lifestyle, medication and follow-up for GERD." },
      { icon: "gut", t: "IBS & IBD care", d: "Microbiome-informed plans for IBS and Crohn's." },
      { icon: "salad", t: "Nutrition & prevention", d: "Diet strategies for symptom control and cancer prevention." },
    ],
    path: PATH,
    faq: [
      { q: "When should I start bowel screening?", a: "Most Canadian programs screen average-risk adults aged 50–74; earlier if you have a family history." },
      { q: "Is a colonoscopy uncomfortable?", a: "Sedation is usually offered. The preparation the day before is often the hardest part." },
      { q: "Can reflux be serious?", a: "Long-standing reflux can damage the oesophagus, so frequent symptoms are worth assessing." },
    ],
    urgent: "Vomiting blood, black stools or severe abdominal pain are emergencies — call 911.",
    tool: "crc", source: NEYU,
  },
  "mental-health": {
    when: ["Low mood or worry lasting more than two weeks", "Sleep that won't settle", "Stress that affects work or relationships", "A difficult or traumatic experience", "Focus or attention difficulties", "Family changes or conflict"],
    signs: ["Low mood", "Worry", "Poor sleep", "Irritability", "Low motivation", "Difficulty concentrating"],
    care: [
      { icon: "message", t: "Cognitive behavioural therapy", d: "Practical, evidence-based tools for anxiety and depression." },
      { icon: "shield", t: "Trauma-informed therapy", d: "Paced, safe care for difficult experiences." },
      { icon: "users", t: "Family counselling", d: "Support for the people around you." },
      { icon: "brain", t: "ADHD assessment & support", d: "Assessment pathways and coaching." },
      { icon: "bed", t: "Sleep & stress physiology", d: "Cortisol, HRV and sleep tracking to measure progress." },
      { icon: "leaf", t: "Mindfulness & lifestyle", d: "Daily practices that build resilience." },
    ],
    path: PATH,
    faq: [
      { q: "Can sessions be virtual?", a: "Yes — many people prefer video sessions, and they work well for talk therapy." },
      { q: "How many sessions will I need?", a: "It varies. Many structured therapies run 6–12 sessions, reviewed together as you go." },
      { q: "Is what I share confidential?", a: "Yes, within the legal limits your clinician will explain at your first visit." },
    ],
    urgent: "If you are in crisis or thinking about harming yourself, call or text 9-8-8 (Canada and US) or your local emergency number.",
    tool: "sleep", source: NEYU,
  },
};
