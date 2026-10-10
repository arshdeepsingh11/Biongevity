import type { IconName } from "@/components/ui/icons";

/**
 * Departments — one source for every Precision Health page.
 * Specialty content is written in our own words from the NEYU Health clinical pages (BioAro group);
 * precision programs carry Biongevity's genomics, microbiome and longevity approach.
 * General information only — not medical advice. Services are confirmed by the care team.
 */

export type DeptGroup = "Specialty care" | "Precision programs";

export interface Service { t: string; d: string; icon: IconName; time?: string; prep?: string[] }
export interface Department {
  id: string; icon: IconName; name: string; short: string; group: DeptGroup;
  tag: string; summary: string; approach: string[];
  areas: { t: string; d: string; icon: IconName }[];
  when: string[]; signs: string[];
  services: Service[];
  faq: { q: string; a: string }[];
  prompts: string[];
  keywords: string[];
  urgent?: string;
  specialist?: { role: string; bio: string };
  calm?: boolean;
}

export const CARE_PATH = [
  { t: "Referral or self-booking", d: "Come with a referral from your family doctor, upload one online, or book directly where allowed.", icon: "file" as IconName },
  { t: "Specialist consultation", d: "A specialist reviews your full history, medications, previous results and goals.", icon: "stethoscope" as IconName },
  { t: "Targeted testing", d: "Onsite diagnostics first; precision lab tests only when they answer a real question.", icon: "microscope" as IconName },
  { t: "Your plan, tracked", d: "Clear next steps, results and follow-ups in one connected record — explained in plain language.", icon: "route" as IconName },
];

const EMERGENCY = "This is not an emergency service. For chest pain, trouble breathing, fainting, stroke signs or severe bleeding, call 911. In Alberta, Health Link 811 offers 24/7 nurse advice.";

export const DEPARTMENTS: Department[] = [
  /* ───────────────────────── Specialty care ───────────────────────── */
  {
    id: "cardiology", icon: "heart", name: "Cardiology", short: "Cardiology", group: "Specialty care",
    tag: "Heart care with onsite exercise stress echo.",
    summary: "Assessment and long-term care for chest symptoms, palpitations, blood pressure, cholesterol and structural heart conditions — with imaging, rhythm monitoring and Alberta's first onsite exercise stress echocardiogram program.",
    approach: [
      "Cardiology starts with a full review of your symptoms, risk factors and family history. Most questions can then be answered with a small number of well-chosen tests done in the same clinic.",
      "Imaging, rhythm monitoring and blood-pressure monitoring sit side by side with internal medicine and endocrinology, so heart, metabolic and hormone risk are read together rather than in isolation.",
      "Results, plans and follow-ups live in one record, so every clinician — and you — can see the full picture over time.",
    ],
    areas: [
      { icon: "heart", t: "Chest pain & coronary disease", d: "Assessing chest discomfort and the arteries that supply the heart." },
      { icon: "wave", t: "Palpitations & arrhythmia", d: "Finding the rhythm behind a racing, skipping or irregular heartbeat." },
      { icon: "gauge", t: "High blood pressure", d: "Confirming readings and tuning treatment to a home target of 135/85." },
      { icon: "droplet", t: "Cholesterol & lipids", d: "Risk-based lipid management, not one number in isolation." },
      { icon: "heart-half", t: "Structural heart disease", d: "Valves, chambers and pumping function on echocardiography." },
      { icon: "walk", t: "Exercise tolerance", d: "How your heart performs when it is asked to work harder." },
      { icon: "dna", t: "Inherited risk", d: "Early-onset family history read alongside genomics." },
      { icon: "route", t: "Prevention plans", d: "Risk scoring and a plan before problems start." },
    ],
    when: ["Chest discomfort, especially on exertion", "Palpitations or an irregular heartbeat", "Breathlessness, or swelling in the ankles", "Dizziness, light-headedness or fainting", "High blood-pressure readings at home or in clinic", "A family history of early heart disease"],
    signs: ["Chest pain or pressure", "Shortness of breath", "Palpitations", "Dizziness", "Fatigue on exertion", "Swelling"],
    services: [
      { icon: "stethoscope", t: "Cardiology consultation", d: "A specialist review of symptoms, risk factors, medications and previous results, ending with a clear plan.", time: "30–45 min" },
      { icon: "walk", t: "Exercise stress echocardiogram", d: "Ultrasound images of the heart at rest and straight after exercise, showing problems that only appear under load.", time: "45–60 min", prep: ["Comfortable clothes and running shoes", "No food or caffeine for 4 hours", "No creams or lotion on the chest"] },
      { icon: "wave", t: "Electrocardiogram (ECG)", d: "A quick, painless recording of the heart's electrical activity at rest.", time: "10 min" },
      { icon: "timer", t: "Holter monitoring", d: "A small recorder worn for 24, 48 or 72 hours to catch rhythm changes a single visit can miss.", time: "24–72 h", prep: ["Shower before fitting — no bathing with the device on", "Keep a diary of symptoms and activities", "Avoid strong magnets and metal detectors"] },
      { icon: "heart-half", t: "Echocardiography", d: "Real-time ultrasound of the heart's chambers, valves and pumping function.", time: "30–45 min" },
      { icon: "scan", t: "Carotid ultrasound", d: "Checks the neck arteries that supply the brain for plaque and narrowing.", time: "20–30 min" },
      { icon: "atom", t: "Myocardial perfusion imaging", d: "Nuclear imaging of blood flow to the heart muscle at rest and under stress.", time: "2–4 h", prep: ["No caffeine for 24 hours", "Fast for 4 hours", "Comfortable clothes and shoes"] },
      { icon: "gauge", t: "24-hour ambulatory BP", d: "Blood pressure measured automatically through a normal day and night — the most accurate picture of your true pressure.", time: "24 h", prep: ["Loose-sleeved shirt", "Keep the arm still and relaxed during readings", "Carry on with normal activities"] },
    ],
    faq: [
      { q: "How do I prepare for a Holter monitor?", a: "Shower before your fitting, since you can't bathe while wearing it. Keep a short diary of what you were doing whenever you notice symptoms, and avoid strong magnets and metal detectors until it comes off." },
      { q: "What does a stress echo show?", a: "It compares ultrasound images of the heart at rest and immediately after exercise. Areas of muscle that don't move normally under stress can point to narrowed arteries that a resting test would miss." },
      { q: "What does high blood pressure do to the heart?", a: "Over years it makes the heart work harder, thickening the muscle and stiffening arteries. That raises the risk of heart attack, stroke, heart failure and kidney disease — which is why confirming and treating it early matters." },
      { q: "Holter or ambulatory BP — what's the difference?", a: "A Holter records heart rhythm; an ambulatory monitor records blood pressure. Both run over a full day or more so they capture what a single office reading can miss." },
      { q: "Do I need a referral?", a: "Most cardiology tests need a physician order or referral. You can upload a referral online and the team confirms everything before booking." },
    ],
    prompts: ["How do I prepare for a Holter monitor?", "Is 135/85 high at home?", "What does a stress echo show?"],
    keywords: ["Stress echo", "ECG", "Holter", "Echocardiography", "Carotid ultrasound", "Ambulatory BP", "Lipids"],
    urgent: EMERGENCY,
    specialist: { role: "Cardiology team", bio: "Cardiologists with expertise in non-invasive cardiac care, advanced cardiac imaging and precision prevention." },
  },
  {
    id: "heart-failure", icon: "heart-half", name: "Heart Failure Clinic", short: "Heart Failure", group: "Specialty care",
    tag: "Steady, proactive care for every day.",
    summary: "Focused, ongoing care for people living with heart failure — from first evaluation to long-term monitoring — built around medication optimisation, symptom control and staying out of hospital.",
    approach: [
      "Heart failure is managed best with regular, proactive visits rather than waiting for a crisis. Weight, symptoms and medication response are tracked and adjusted early.",
      "The clinic is led by the cardiology team, with imaging onsite and education so you understand your own warning signs.",
    ],
    areas: [
      { icon: "heart-half", t: "Reduced ejection fraction (HFrEF)", d: "When the heart pumps with less force than normal." },
      { icon: "heart-plain", t: "Preserved ejection fraction (HFpEF)", d: "When the heart pumps normally but fills stiffly." },
      { icon: "heart", t: "Heart failure after a heart attack", d: "Recovery, rehabilitation and long-term protection." },
      { icon: "tablets", t: "Medication optimisation", d: "Guideline therapies titrated to the right dose for you." },
      { icon: "scale", t: "Fluid & weight management", d: "Daily weights and early action on fluid build-up." },
      { icon: "cpu", t: "Device follow-up", d: "Coordination of pacemaker and defibrillator follow-up." },
    ],
    when: ["You've been diagnosed with heart failure", "Breathlessness is getting worse", "Swelling in the legs or abdomen", "Unexplained weight gain over a few days", "Fatigue that limits daily activities"],
    signs: ["Breathlessness", "Leg swelling", "Rapid weight gain", "Fatigue", "Needing more pillows at night"],
    services: [
      { icon: "stethoscope", t: "Heart failure assessment", d: "Diagnosis, staging and a personalised treatment plan." },
      { icon: "heart-half", t: "Echocardiography", d: "Measures ejection fraction — how much blood the heart pumps with each beat." },
      { icon: "tablets", t: "Medication titration visits", d: "Regular reviews to reach the most effective tolerated doses." },
      { icon: "scale", t: "Weight & symptom monitoring", d: "Daily weights and symptoms reviewed so changes are caught early." },
      { icon: "book", t: "Education & self-care", d: "Salt, fluids, activity and the warning signs to act on." },
      { icon: "cpu", t: "Device coordination", d: "Follow-up for pacemakers and implantable defibrillators." },
    ],
    faq: [
      { q: "Why track my weight every day?", a: "A quick rise — often 1 kg in a day or 2 kg in a week — usually means fluid is building up before you feel it. Catching it early lets your team adjust treatment and avoid a hospital visit." },
      { q: "What do the NYHA classes mean?", a: "They grade how much heart failure limits activity: Class I no limitation, II symptoms with ordinary activity, III symptoms with less-than-ordinary activity, IV symptoms at rest." },
      { q: "What is ejection fraction?", a: "The share of blood the left ventricle pumps out with each beat. Around 50–70% is typical; lower values mean reduced pumping function." },
      { q: "Can heart failure improve?", a: "Yes. With the right medications, many people see symptoms ease and pumping function improve, especially when treatment is optimised early." },
    ],
    prompts: ["Why track my weight every day?", "What does ejection fraction mean?"],
    keywords: ["HFrEF", "HFpEF", "Ejection fraction", "NYHA", "Medication titration"],
    urgent: EMERGENCY,
  },
  {
    id: "internal-medicine", icon: "stethoscope", name: "Internal Medicine", short: "Internal Medicine", group: "Specialty care",
    tag: "Whole-person care for complex and chronic conditions.",
    summary: "Internists look after adult health as a whole — especially when several conditions interact, a diagnosis is unclear, or care needs one physician to coordinate across specialists.",
    approach: [
      "Internal medicine handles everything from routine chronic disease management to complex diagnostic work-ups, working alongside cardiology and endocrinology in one place.",
      "Genomics, advanced biomarkers and imaging are added only where they change a decision — so the plan stays focused and every test has a purpose.",
    ],
    areas: [
      { icon: "gauge", t: "Hypertension & cardiovascular risk", d: "Confirming, treating and preventing." },
      { icon: "droplet", t: "Diabetes & metabolic conditions", d: "Blood sugar, weight and insulin resistance." },
      { icon: "search", t: "Complex or undiagnosed symptoms", d: "A structured work-up when the cause isn't clear." },
      { icon: "network", t: "Multi-system chronic disease", d: "Several conditions managed as one plan." },
      { icon: "clipboard", t: "Pre-operative assessment", d: "Medical clearance and risk planning before surgery." },
      { icon: "stethoscope", t: "General adult consultation", d: "Specialist opinion on adult medical problems." },
    ],
    when: ["You live with more than one long-term condition", "Symptoms like fatigue or weight change have no clear cause", "Abnormal blood results need a plan", "You need a medical assessment before surgery", "Your care needs coordinating across several specialists"],
    signs: ["Persistent fatigue", "Unexplained weight change", "Abnormal blood tests", "High blood sugar", "High blood pressure"],
    services: [
      { icon: "clipboard", t: "Comprehensive assessment", d: "History, examination and a baseline panel reviewed as a whole." },
      { icon: "search", t: "Diagnostic work-up", d: "Stepwise testing for symptoms without a clear cause." },
      { icon: "network", t: "Chronic disease management", d: "Diabetes, hypertension, kidney and thyroid care in one plan." },
      { icon: "file", t: "Pre-operative medical assessment", d: "Risk review and optimisation before an operation." },
      { icon: "tablets", t: "Medication review", d: "Fewer pills, fewer interactions, clearer purpose." },
      { icon: "dna", t: "Genomic risk review", d: "Inherited risk translated into screening timelines." },
    ],
    faq: [
      { q: "What does an internist do?", a: "Internists are specialists in adult medicine. They diagnose difficult problems and manage several conditions at once, connecting symptoms, results and medications into one plan." },
      { q: "What is a pre-operative assessment?", a: "A medical review before surgery that checks heart, lung and other risks, adjusts medications and makes sure you are as fit as possible for the operation." },
      { q: "How are blood pressure and diabetes connected?", a: "They often occur together and both damage blood vessels. Treating them together lowers the risk of heart, kidney and eye complications more than treating either alone." },
      { q: "How often should results be reviewed?", a: "Usually yearly for prevention, and more often while a condition or medication is being adjusted." },
    ],
    prompts: ["What is a pre-operative assessment?", "How are blood pressure and diabetes connected?"],
    keywords: ["Chronic disease", "Diagnostics", "Pre-op", "Hypertension", "Diabetes", "Coordination"],
  },
  {
    id: "endocrinology", icon: "test-tube", name: "Endocrinology", short: "Endocrinology", group: "Specialty care",
    tag: "Hormones and metabolism, expertly managed.",
    summary: "Care for diabetes, thyroid, adrenal, pituitary and other hormone conditions — with a particular interest in young-onset type 2 diabetes and PCOS, led by internationally trained expertise.",
    approach: [
      "Hormone conditions affect energy, weight, mood, bones and the heart. Care starts by confirming the diagnosis with the right tests at the right time of day or cycle.",
      "Plans combine medication, nutrition and activity — and are tracked with simple markers like HbA1c, thyroid levels and body composition.",
    ],
    areas: [
      { icon: "droplet", t: "Type 1 & type 2 diabetes", d: "Including young-onset type 2 diabetes." },
      { icon: "test-tube", t: "Thyroid disorders", d: "Under- and over-active thyroid, nodules and goitre." },
      { icon: "flower", t: "PCOS", d: "Cycles, insulin resistance and long-term health." },
      { icon: "atom", t: "Adrenal & pituitary disorders", d: "Investigation and management of rarer hormone conditions." },
      { icon: "bone", t: "Osteoporosis", d: "Bone strength, fracture risk and treatment." },
      { icon: "scale", t: "Obesity & metabolic syndrome", d: "Weight, waist and insulin resistance." },
    ],
    when: ["Diabetes that's hard to control", "An abnormal thyroid test", "Symptoms of a hormone imbalance", "Irregular cycles or suspected PCOS", "Your doctor recommends specialist input"],
    signs: ["High HbA1c", "Fatigue", "Weight change", "Feeling cold or hot", "Irregular periods", "Hair or skin changes"],
    services: [
      { icon: "stethoscope", t: "Endocrinology consultation", d: "Diagnosis and plan for hormone and metabolic conditions." },
      { icon: "droplet", t: "Diabetes care", d: "Medication, technology and lifestyle, tracked with HbA1c." },
      { icon: "test-tube", t: "Thyroid assessment", d: "Blood tests and ultrasound referral when needed." },
      { icon: "flower", t: "PCOS program", d: "Cycles, metabolism and long-term risk together." },
      { icon: "bone", t: "Bone health", d: "Fracture-risk assessment and treatment options." },
      { icon: "scale", t: "Metabolic health", d: "Weight, waist and insulin resistance with a measurable plan." },
    ],
    faq: [
      { q: "What is prediabetes?", a: "Blood sugar higher than normal but below the diabetes range — in Canada, an HbA1c of 6.0–6.4%. It's a warning sign, and lifestyle changes can often bring it back to normal." },
      { q: "What are common signs of thyroid problems?", a: "An under-active thyroid can cause tiredness, weight gain, dry skin and feeling cold; an over-active one can cause weight loss, a racing heart, anxiety and heat intolerance." },
      { q: "What is PCOS?", a: "Polycystic ovary syndrome is a common hormone condition causing irregular cycles, excess androgen effects and insulin resistance. It's managed long-term to protect fertility, metabolism and heart health." },
      { q: "What does HbA1c measure?", a: "Your average blood sugar over about three months. Below 6.0% is normal, 6.0–6.4% is prediabetes, and 6.5% or above is in the diabetes range (Diabetes Canada)." },
    ],
    prompts: ["What is prediabetes?", "What are common signs of thyroid problems?"],
    keywords: ["Diabetes", "Thyroid", "PCOS", "Adrenal", "Osteoporosis", "HbA1c"],
  },
  {
    id: "respiratory-medicine", icon: "lungs", name: "Respiratory Medicine", short: "Respiratory", group: "Specialty care",
    tag: "Sleep well. Breathe easy. Live better.",
    summary: "Diagnosis and care for sleep apnea, asthma, COPD and breathing problems — with lung function testing, home and in-lab sleep studies, CPAP support and home oxygen, delivered with a dedicated respiratory care network.",
    approach: [
      "Pulmonologists and registered respiratory therapists guide you through testing and treatment with education and support, not a rushed hand-off.",
      "Testing happens where it suits you best — at home for many sleep studies, in the lab when more detail is needed.",
    ],
    areas: [
      { icon: "bed", t: "Obstructive sleep apnea", d: "Breathing pauses during sleep." },
      { icon: "moon", t: "Snoring & daytime sleepiness", d: "Finding the cause and fixing it." },
      { icon: "wind", t: "Asthma", d: "Control plans and inhaler technique." },
      { icon: "lungs", t: "COPD", d: "Lung function, flare prevention and rehab." },
      { icon: "leaf", t: "Allergies affecting breathing", d: "Allergy testing and triggers." },
      { icon: "droplet", t: "Home oxygen", d: "Assessment, equipment and safety." },
    ],
    when: ["Loud snoring or gasping at night", "Daytime sleepiness", "A cough that won't go away", "Wheezing", "Breathlessness with activity"],
    signs: ["Snoring", "Gasping at night", "Daytime sleepiness", "Wheeze", "Chronic cough", "Breathlessness"],
    services: [
      { icon: "lungs", t: "Pulmonary function testing", d: "Measures how much air your lungs move, how fast, and how well oxygen transfers." },
      { icon: "leaf", t: "Allergy testing", d: "Identifies triggers that affect breathing." },
      { icon: "stethoscope", t: "Pulmonology consultation", d: "Specialist assessment and treatment plan." },
      { icon: "home", t: "Portable sleep study", d: "A home test for suspected sleep apnea." },
      { icon: "bed", t: "In-lab sleep study (polysomnography)", d: "A detailed overnight study when more information is needed." },
      { icon: "wind", t: "CPAP & BiPAP equipment", d: "Fitting, setup and ongoing support." },
      { icon: "droplet", t: "Home oxygen & safety", d: "Equipment and guidance for safe use at home." },
    ],
    faq: [
      { q: "Is snoring always sleep apnea?", a: "No. Many people snore without apnea. Gasping, choking, witnessed pauses or daytime sleepiness make apnea more likely — a sleep study gives the answer." },
      { q: "What is CPAP?", a: "Continuous positive airway pressure: a quiet machine that gently keeps the airway open during sleep. It's the most effective treatment for moderate to severe sleep apnea." },
      { q: "What does a lung function test involve?", a: "You breathe into a mouthpiece — sometimes before and after an inhaler — to measure airflow and lung volumes. It's painless and takes about 30–60 minutes." },
      { q: "Do I need a referral?", a: "Yes — respiratory and sleep services usually start with a referral from your family doctor." },
    ],
    prompts: ["Is snoring always sleep apnea?", "What is CPAP?"],
    keywords: ["Sleep apnea", "Asthma", "COPD", "Spirometry", "CPAP", "Sleep study"],
    urgent: "For severe trouble breathing, call 911.",
  },
  {
    id: "geriatric-medicine", icon: "walk", name: "Geriatric Medicine", short: "Geriatrics", group: "Specialty care",
    tag: "Independence, safety and quality of life.",
    summary: "Care for later life — memory, mobility, falls and medication review — focused on keeping people independent and well, with support for the family members who care for them.",
    approach: [
      "Older adults often live with several conditions and medications at once. A comprehensive assessment looks at all of them together, along with function, mood and support at home.",
      "Internal medicine physicians see many of these concerns today, with referral to specialist geriatric services when needed.",
    ],
    areas: [
      { icon: "walk", t: "Frailty & falls risk", d: "Strength, balance and home safety." },
      { icon: "brain", t: "Memory & cognition", d: "Assessment of memory changes and next steps." },
      { icon: "tablets", t: "Medication review", d: "Simplifying and de-prescribing safely." },
      { icon: "wheelchair", t: "Mobility & function", d: "Keeping daily activities manageable." },
      { icon: "care", t: "Caregiver support", d: "Coordination and support for families." },
      { icon: "hourglass", t: "Healthy ageing", d: "Prevention tailored to later life." },
    ],
    when: ["You take many medications", "You've had a fall", "Memory is changing", "Care across several conditions needs coordinating"],
    signs: ["Falls", "Memory changes", "Many medications", "Unsteadiness", "Weight loss"],
    services: [
      { icon: "clipboard", t: "Comprehensive geriatric assessment", d: "Health, function, mood, memory and support reviewed together." },
      { icon: "brain", t: "Cognitive screening", d: "Structured memory and thinking tests." },
      { icon: "tablets", t: "Medication review", d: "Fewer interactions and side effects." },
      { icon: "walk", t: "Falls-risk assessment", d: "Balance, strength and home-safety advice." },
      { icon: "care", t: "Care coordination", d: "Linking specialists, family and community services." },
    ],
    faq: [
      { q: "What is a comprehensive geriatric assessment?", a: "A detailed review of medical conditions, medications, memory, mood, mobility and home support, leading to one coordinated plan." },
      { q: "What memory changes are normal with age?", a: "Occasionally misplacing things or taking longer to recall names is common. Getting lost in familiar places, repeating questions or struggling with daily tasks deserves assessment." },
      { q: "How can falls be prevented?", a: "Strength and balance exercise, a medication review, good lighting, removing trip hazards, and vision and footwear checks all reduce risk." },
    ],
    prompts: ["What is a comprehensive geriatric assessment?", "What memory changes are normal with age?"],
    keywords: ["Falls", "Memory", "Medication review", "Mobility", "Caregivers"],
  },
  {
    id: "nutrition", icon: "salad", name: "Nutrition", short: "Nutrition", group: "Specialty care",
    tag: "Evidence-based eating, built around you.",
    summary: "Personalised nutrition coaching for heart, metabolic and general health — tailored to your goals, conditions and lifestyle rather than a generic meal plan, with Registered Dietitian-prepared protocols.",
    approach: [
      "Nutrition plans start from what you already eat and what you want to change, then add structure: portions, timing, fibre, protein and practical swaps.",
      "Where useful, microbiome and nutrient testing guide the plan, and progress is tracked against real markers rather than willpower.",
    ],
    areas: [
      { icon: "scale", t: "Weight management", d: "Sustainable change without crash diets." },
      { icon: "droplet", t: "Blood-sugar-conscious eating", d: "For prediabetes and diabetes." },
      { icon: "heart", t: "Heart-healthy nutrition", d: "Lipids and blood pressure through food." },
      { icon: "bolt", t: "Energy & everyday eating", d: "Steady energy across the day." },
      { icon: "face", t: "Nutrition with skin & longevity programs", d: "Protocols that support other treatments." },
    ],
    when: ["You want a plan built for your conditions", "Weight or blood sugar is creeping up", "Your cholesterol or blood pressure needs support", "Energy dips through the day"],
    signs: ["Weight change", "High blood sugar", "High cholesterol", "Low energy", "Bloating"],
    services: [
      { icon: "salad", t: "Personalised nutrition coaching", d: "One-to-one coaching around your goals and conditions." },
      { icon: "clipboard", t: "Dietitian-prepared protocols", d: "Included in select treatment and skin packages." },
      { icon: "bolt", t: "Nutrition starter plan", d: "A quick questionnaire that drafts a practical plan." },
      { icon: "gut", t: "Gut microbiome insight", d: "Microbiome testing to personalise fibre and food choices." },
      { icon: "sun", t: "Nutrient status", d: "Vitamin levels checked where they change advice." },
    ],
    faq: [
      { q: "What does a balanced plate look like?", a: "Roughly half vegetables and fruit, a quarter protein and a quarter whole grains, with water as the main drink — the model behind Canada's Food Guide." },
      { q: "What is a gut microbiome test?", a: "A stool test that shows which microbes live in your gut and how diverse they are, so fibre and food choices can be personalised." },
      { q: "How much fibre should I eat?", a: "Health Canada suggests about 25 g a day for women and 38 g for men. Most adults get roughly half." },
    ],
    prompts: ["What does a balanced plate look like?", "How much fibre should I eat?"],
    keywords: ["Weight", "Blood sugar", "Heart-healthy", "Dietitian", "Fibre"],
  },
  {
    id: "skin-health", icon: "face", name: "Skin Health", short: "Skin Health", group: "Specialty care",
    tag: "Physician-managed skin, laser and wellness.",
    summary: "Assessment and treatment of skin concerns — acne, rosacea, pigmentation, ageing and scarring — with Fotona laser technology, injectables, medical facials and microbiome-guided plans.",
    approach: [
      "Every plan starts with a consultation about your goals. Treatments are combined with skincare and, when helpful, skin microbiome testing.",
      "Fotona lasers work at two depths — Er:YAG on the surface and Nd:YAG deeper — so several concerns can be treated in one visit, often with no downtime.",
    ],
    areas: [
      { icon: "face", t: "Skin concerns", d: "Active acne, scarring, rosacea, pigmentation and melasma, lines and large pores." },
      { icon: "sparkle", t: "Laser", d: "Fotona resurfacing, tightening and 4D facial laser." },
      { icon: "syringe", t: "Injectables", d: "Neuromodulators and dermal fillers." },
      { icon: "droplet", t: "Facials", d: "Medical facials, peels and medical-grade skincare." },
      { icon: "person", t: "Body", d: "Skin tightening, muscle sculpting and weight programs." },
      { icon: "leaf", t: "Hair", d: "Hair restoration and laser hair removal." },
    ],
    when: ["Acne or rosacea that keeps returning", "Pigmentation, melasma or sun damage", "Acne scarring or stretch marks", "Lines and loss of firmness", "A mole that changes — see a physician promptly"],
    signs: ["Breakouts", "Redness", "Dark spots", "Scarring", "Fine lines", "Large pores"],
    services: [
      { icon: "sparkle", t: "Fotona 4D facial laser", d: "Four laser modes in one visit, including intra-oral tightening, with no downtime." },
      { icon: "face", t: "Laser resurfacing", d: "Texture, scarring and fine lines." },
      { icon: "syringe", t: "Neuromodulators & fillers", d: "Physician-administered injectables." },
      { icon: "droplet", t: "Medical facials & peels", d: "Clinical-grade treatments for clarity and glow." },
      { icon: "microscope", t: "Skin microbiome test", d: "Shows bacterial and fungal balance behind irritation." },
      { icon: "leaf", t: "Hair restoration", d: "PRP with laser support." },
    ],
    faq: [
      { q: "When should a mole be checked?", a: "Use ABCDE — Asymmetry, irregular Border, uneven Colour, Diameter over 6 mm, or Evolving. Any of these deserves a prompt medical review." },
      { q: "Is there downtime after Fotona treatments?", a: "Many Fotona treatments have little or no downtime; deeper resurfacing can need a few days. You'll get a plan at consultation." },
      { q: "How does the microbiome affect skin?", a: "The microbes on your skin help protect its barrier. An imbalance can contribute to acne, irritation and sensitivity." },
    ],
    prompts: ["When should a mole be checked?", "Which laser suits pigmentation?"],
    keywords: ["Fotona", "Acne", "Rosacea", "Pigmentation", "Injectables", "Microbiome"],
  },
  {
    id: "pediatric-rheumatology", icon: "baby", name: "Pediatric Rheumatology", short: "Pediatric Rheum", group: "Specialty care",
    tag: "Joint and inflammatory care for young people.",
    summary: "Specialist care for children and adolescents with joint, muscle and inflammatory conditions — from first assessment to long-term support for families.",
    approach: [
      "Inflammatory conditions in children are diagnosed by combining history, examination and targeted tests, with care built around school, sport and growth.",
      "Families are part of every plan, with clear explanations and regular review.",
    ],
    areas: [
      { icon: "bone", t: "Juvenile arthritis", d: "Joint pain, swelling and stiffness." },
      { icon: "flame", t: "Inflammatory conditions", d: "Investigating ongoing inflammation." },
      { icon: "walk", t: "Muscle & joint pain", d: "Finding the cause and restoring activity." },
      { icon: "care", t: "Family support", d: "Education and coordination with schools." },
    ],
    when: ["Joint swelling or stiffness lasting more than a few weeks", "Limping without an injury", "Ongoing fevers with joint pain", "Morning stiffness"],
    signs: ["Joint swelling", "Morning stiffness", "Limping", "Recurrent fevers", "Rash with joint pain"],
    services: [
      { icon: "stethoscope", t: "Pediatric rheumatology consultation", d: "Assessment with the child and family." },
      { icon: "test-tube", t: "Inflammatory markers", d: "Blood tests that track inflammation." },
      { icon: "route", t: "Long-term care plan", d: "Treatment, monitoring and school support." },
    ],
    faq: [
      { q: "What is juvenile arthritis?", a: "Arthritis that starts before age 16 and lasts more than six weeks. With modern treatment, most children stay active and do well." },
      { q: "What are inflammatory markers?", a: "Blood tests like CRP and ESR that rise with inflammation. They help diagnosis and show how well treatment is working." },
    ],
    prompts: ["What is juvenile arthritis?"],
    keywords: ["Juvenile arthritis", "Inflammation", "Joint pain", "Families"],
  },

  /* ───────────────────────── Precision programs ───────────────────────── */
  {
    id: "womens-health", icon: "flower", name: "Women's Health", short: "Women's Health", group: "Precision programs",
    tag: "Optimal health at every stage of life.",
    summary: "Hormones, fertility, bone and heart health across every life stage — combining genomic risk, microbiome insight and preventive screening into one plan.",
    approach: [
      "Genomic insights identify inherited risk for breast and ovarian cancer and osteoporosis, so screening can start at the right time.",
      "Gut and vaginal microbiome analysis supports infection prevention, fertility and hormonal balance, while hormone testing is timed to your cycle.",
    ],
    areas: [
      { icon: "test-tube", t: "Hormone balance", d: "Cycles, perimenopause and menopause." },
      { icon: "baby", t: "Fertility & preconception", d: "Planning and optimisation." },
      { icon: "bone", t: "Bone health", d: "Fracture risk after 50." },
      { icon: "dna", t: "Inherited cancer risk", d: "Breast and ovarian predisposition." },
      { icon: "microscope", t: "Vaginal & gut microbiome", d: "Recurrent infections and balance." },
      { icon: "heart", t: "Heart health", d: "Risk changes after menopause." },
    ],
    when: ["Your cycle has changed", "Perimenopause or menopause symptoms", "Planning a pregnancy", "A family history of breast or ovarian cancer", "Over 50 and want a bone-health plan", "Recurrent vaginal infections"],
    signs: ["Irregular cycles", "Hot flushes", "Low energy", "Mood changes", "Sleep disruption", "Recurring infections"],
    services: [
      { icon: "test-tube", t: "Hormone assessment", d: "Estradiol, progesterone, SHBG and more — timed to your cycle." },
      { icon: "dna", t: "Genomic risk", d: "Breast, ovarian cancer and osteoporosis predisposition." },
      { icon: "microscope", t: "BioFemme & BioGut", d: "Vaginal and gut microbiome balance." },
      { icon: "bone", t: "Bone-health plan", d: "Risk assessment and density screening." },
      { icon: "baby", t: "Fertility support", d: "Preconception planning." },
      { icon: "shield", t: "Preventive screening", d: "Cervical and breast screening to local guidelines." },
    ],
    faq: [
      { q: "When does menopause usually happen?", a: "On average around 51, with perimenopause often starting several years earlier." },
      { q: "Can hormone tests be done at any time?", a: "Some hormones vary across the cycle, so timing matters. Your clinician will tell you which day to test." },
      { q: "Who should consider genetic testing?", a: "Anyone with a strong family history of breast, ovarian or related cancers." },
    ],
    prompts: ["Which checks are right for my stage of life?", "When should hormones be tested?"],
    keywords: ["Hormones", "Fertility", "Bone density", "Microbiome", "Screening"],
  },
  {
    id: "mens-health", icon: "person", name: "Men's Health", short: "Men's Health", group: "Precision programs",
    tag: "Peak health at every stage.",
    summary: "Preventive care and early detection for men — prostate, heart and hormone health, body composition and performance, read alongside your genetics.",
    approach: [
      "Genetic markers for prostate cancer, cardiovascular disease and hormone balance set the starting point.",
      "Hormone panels, body composition and cardiometabolic markers turn into a plan for training, recovery and nutrition.",
    ],
    areas: [
      { icon: "test-tube", t: "Testosterone & hormones", d: "Symptoms, testing and safe optimisation." },
      { icon: "shield", t: "Prostate health", d: "Screening matched to age and risk." },
      { icon: "heart", t: "Cardiometabolic risk", d: "Blood pressure, lipids and HbA1c." },
      { icon: "scale", t: "Body composition", d: "Fat, muscle and bone." },
      { icon: "dumbbell", t: "Performance & recovery", d: "Training aligned with biology." },
      { icon: "dna", t: "Genomic risk", d: "Inherited risk read early." },
    ],
    when: ["Low energy, motivation or libido", "Urinary changes", "A family history of prostate cancer or heart disease", "40+ and want a structured check-up", "Body composition goals"],
    signs: ["Fatigue", "Low libido", "Night-time urination", "Waist gain", "Poor recovery"],
    services: [
      { icon: "test-tube", t: "Hormone panel", d: "Total testosterone, SHBG, DHT and related markers." },
      { icon: "dna", t: "Genomic markers", d: "Prostate, cardiovascular and metabolic predisposition." },
      { icon: "scale", t: "Body composition", d: "Measured, not guessed." },
      { icon: "heart", t: "Cardiometabolic check", d: "Blood pressure, lipids, glucose and HbA1c." },
      { icon: "dumbbell", t: "Performance plan", d: "Training, recovery and nutrition." },
    ],
    faq: [
      { q: "Should I test my testosterone?", a: "If you have symptoms, yes — ideally a morning sample, repeated before any treatment decision." },
      { q: "When should prostate screening start?", a: "It depends on age and risk. Many guidelines discuss PSA testing from 50, or earlier with a family history." },
    ],
    prompts: ["Should I test my testosterone?", "When should prostate screening start?"],
    keywords: ["Prostate", "Testosterone", "Body composition", "Cardiometabolic"],
  },
  {
    id: "gut-health", icon: "gut", name: "Gut Health & Gastroenterology", short: "Gut Health", group: "Precision programs",
    tag: "The foundation of overall wellness.",
    summary: "Microbiome-guided care for digestion, reflux, IBS and inflammatory bowel conditions — from at-home gut testing to specialist gastroenterology and colorectal screening.",
    approach: [
      "Gut microbiome analysis shows how your gut influences immunity, metabolism and mood, and guides personalised nutrition.",
      "Specialist gastroenterology covers reflux, IBS, Crohn's and cancer prevention, with endoscopy and colonoscopy when symptoms need a direct look.",
    ],
    areas: [
      { icon: "gut", t: "Microbiome balance", d: "Diversity, dysbiosis and metabolic efficiency." },
      { icon: "flame", t: "Reflux (GERD)", d: "Targeted, evidence-based management." },
      { icon: "wave", t: "IBS & IBD", d: "IBS and Crohn's, microbiome-informed." },
      { icon: "shield", t: "Colorectal screening", d: "Prevention from age 50, earlier with family history." },
      { icon: "salad", t: "Precision nutrition", d: "Diet built around your results." },
    ],
    when: ["Bloating or irregular bowels", "Heartburn more than twice a week", "After a course of antibiotics", "A family history of bowel cancer", "You're due for colorectal screening"],
    signs: ["Bloating", "Heartburn", "Constipation", "Loose stools", "Abdominal pain"],
    services: [
      { icon: "microscope", t: "BioGut microbiome test", d: "At-home stool test for diversity and balance." },
      { icon: "stethoscope", t: "Gastroenterology consultation", d: "Specialist review of symptoms and history." },
      { icon: "scan", t: "Gastroscopy & colonoscopy", d: "Direct examination when indicated." },
      { icon: "flame", t: "Reflux management", d: "Lifestyle, medication and follow-up." },
      { icon: "salad", t: "Nutrition plan", d: "Microbiome-guided food choices." },
    ],
    faq: [
      { q: "When should bowel screening start?", a: "Most Canadian programs screen average-risk adults aged 50–74; earlier if a close relative has had bowel cancer." },
      { q: "Can a microbiome test diagnose disease?", a: "No. It shows balance and diversity to guide your plan; diagnoses come from a clinician." },
    ],
    prompts: ["Could my symptoms be microbiome-related?", "When should bowel screening start?"],
    keywords: ["Microbiome", "IBS", "Reflux", "Colonoscopy", "Nutrition"],
    urgent: "Blood in the stool, black stools, vomiting blood or unexplained weight loss need prompt medical review — call 911 if severe.",
    specialist: { role: "Consultant Gastroenterologist", bio: "Over 40 years in internal medicine, gastroenterology, nutrition and cancer prevention; trained at Cambridge, Oxford and London." },
  },
  {
    id: "dental", icon: "tooth", name: "Dental", short: "Dental", group: "Precision programs",
    tag: "Oral health as part of whole health.",
    summary: "Preventive, restorative and cosmetic dentistry with oral microbiome testing — because gum health is linked to heart and metabolic health.",
    approach: ["The oral microbiome test finds harmful bacteria early, before cavities or gum disease set in.", "Care runs from check-ups to implants and smile design."],
    areas: [
      { icon: "microscope", t: "Oral microbiome", d: "Early detection of harmful bacteria." },
      { icon: "tooth", t: "Preventive care", d: "Check-ups and hygiene." },
      { icon: "shield", t: "Root canal", d: "Saving infected teeth." },
      { icon: "sparkle", t: "Cosmetic", d: "Whitening, veneers, smile design." },
      { icon: "bone", t: "Implants & restorative", d: "Replacing missing teeth." },
      { icon: "baby", t: "Children's dentistry", d: "Good habits early." },
    ],
    when: ["Bleeding gums", "Persistent bad breath", "Sensitivity or pain", "Over a year since your last check-up"],
    signs: ["Bleeding gums", "Bad breath", "Sensitivity", "Toothache"],
    services: [
      { icon: "microscope", t: "BioDental oral microbiome test", d: "A simple saliva or swab sample." },
      { icon: "tooth", t: "Check-up & hygiene", d: "Examination, cleaning and early detection." },
      { icon: "sparkle", t: "Cosmetic dentistry", d: "Whitening, veneers and smile design." },
      { icon: "bone", t: "Implants", d: "Restore function and appearance." },
    ],
    faq: [{ q: "Why does oral health matter for longevity?", a: "Gum disease is linked with heart and metabolic conditions. Healthy gums are part of a healthy body." }, { q: "How often should I visit?", a: "Most adults benefit from a check-up every 6–12 months." }],
    prompts: ["How does oral health relate to heart health?"],
    keywords: ["Oral microbiome", "Implants", "Cosmetic", "Gum health"],
  },
  {
    id: "mental-health", icon: "brain", name: "Mental Health", short: "Mental Health", group: "Precision programs", calm: true,
    tag: "Lasting emotional wellbeing.",
    summary: "Personalised mental health care — CBT, trauma-informed therapy and family counselling — with sleep and stress physiology tracked alongside therapy.",
    approach: ["Specialising in anxiety, depression, PTSD and ADHD.", "Mindfulness, lifestyle coaching and psychoeducation build lasting resilience."],
    areas: [
      { icon: "message", t: "Anxiety & depression", d: "Evidence-based therapy." },
      { icon: "shield", t: "Trauma & PTSD", d: "Paced, trauma-informed care." },
      { icon: "brain", t: "ADHD", d: "Assessment and coaching." },
      { icon: "users", t: "Family counselling", d: "Support for the people around you." },
      { icon: "bed", t: "Sleep & stress", d: "Measured physiology, not guesswork." },
    ],
    when: ["Low mood or worry for more than two weeks", "Sleep that won't settle", "Stress affecting work or relationships", "A difficult experience"],
    signs: ["Low mood", "Worry", "Poor sleep", "Irritability", "Poor focus"],
    services: [
      { icon: "message", t: "Cognitive behavioural therapy", d: "Practical tools for anxiety and depression." },
      { icon: "shield", t: "Trauma-informed therapy", d: "Safe, paced care." },
      { icon: "users", t: "Family counselling", d: "Support for families." },
      { icon: "video", t: "Virtual sessions", d: "Talk therapy from home." },
    ],
    faq: [{ q: "Can sessions be virtual?", a: "Yes — video sessions work well for talk therapy." }, { q: "How many sessions will I need?", a: "Many structured therapies run 6–12 sessions, reviewed together as you go." }],
    prompts: ["How can I manage stress better?"],
    keywords: ["Calm", "Resilience", "Support"],
    urgent: "If you are in crisis or thinking about harming yourself, call or text 9-8-8 (Canada and US) or your local emergency number.",
    specialist: { role: "Chartered Psychologist", bio: "British Chartered and UAE-licensed psychologist with 10+ years in mental health and holistic wellbeing." },
  },
];

export const deptById = (id: string) => DEPARTMENTS.find((d) => d.id === id) ?? DEPARTMENTS[0];
export const DEPT_GROUPS: DeptGroup[] = ["Specialty care", "Precision programs"];

const TRIAGE: Record<string, string[]> = {
  cardiology: ["heart", "chest", "palpitation", "blood pressure", "cholesterol", "lipid", "dizz", "faint"],
  "heart-failure": ["heart failure", "swelling", "ejection", "ankle"],
  "internal-medicine": ["general", "check", "tired", "fatigue", "blood test", "surgery", "several"],
  endocrinology: ["diabet", "sugar", "thyroid", "pcos", "hormone", "a1c", "weight"],
  "respiratory-medicine": ["breath", "snor", "sleep apnea", "cough", "asthma", "copd", "wheez"],
  "geriatric-medicine": ["memory", "fall", "elderly", "parent", "mobility"],
  nutrition: ["diet", "nutrition", "food", "eat"],
  "skin-health": ["skin", "acne", "wrinkle", "pigment", "rosacea", "laser", "scar"],
  "pediatric-rheumatology": ["child", "kid", "joint", "arthritis"],
  "womens-health": ["menopaus", "period", "fertility", "pregnan", "estrogen"],
  "mens-health": ["testosterone", "prostate", "libido"],
  "gut-health": ["gut", "bloat", "digest", "microbiome", "ibs", "reflux", "crohn", "colon", "stomach"],
  dental: ["teeth", "tooth", "gum", "dental"],
  "mental-health": ["stress", "anxi", "mood", "depress", "burnout", "adhd"],
};

export function scoreDepartments(text: string): string[] {
  const s = text.toLowerCase();
  const ranked = Object.entries(TRIAGE).map(([id, w]) => [id, w.filter((x) => s.includes(x)).length] as const).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  return ranked.length ? ranked.slice(0, 3) : ["internal-medicine"];
}
