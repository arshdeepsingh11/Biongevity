/**
 * BioAro Drugs label details — from each product page on bioarodrugs.com (October 2026): pack format, how to use,
 * servings per container and the main active ingredients with their amounts per serving. Shown in the formula book.
 * Keyed by product handle (see drugShop.ts). Supplements are not intended to diagnose, treat, cure or prevent disease.
 */
export interface DrugDetail { format: string; use: string; servings: string; actives: [string, string][] }

const R: Record<string, [string, string, string, [string, string][]]> = {
  "longevity-plus": ["60 vegan capsules", "Take 2 capsules daily with food.", "30", [["NMN", "500 mg"], ["Resveratrol", "200 mg"], ["CoQ10", "100 mg"], ["Curcumin", "100 mg"], ["Vitamin B12", "250 µg"], ["Vitamin D3", "25 µg / 1,000 IU"]]],
  "cellomega-plus": ["60 vegan capsules", "Take 2 capsules daily with meals.", "30", [["Algae omega-3", "1,000 mg"], ["Magnesium bisglycinate", "170 mg"], ["CoQ10", "50 mg"], ["Astaxanthin", "8 mg"], ["Spermidine", "2 mg"], ["Vitamin E", "6 mg"]]],
  "creagen-brain-boost": ["20 × 5 g sachets", "Mix 1 sachet with water daily.", "20", [["Creatine monohydrate", "3 g"], ["Magnesium glycinate", "100 mg"], ["Vitamin B12", "2.4 mcg"]]],
  "creagen-femme-energy": ["20 × 5 g sachets", "Mix 1 sachet with water daily.", "20", [["Creatine monohydrate", "3.5 g"], ["Ferrous bisglycinate (iron)", "8 mg"], ["Vitamin B12", "200 mcg"]]],
  "creagen-raw-power": ["20 × 7.5 g sachets", "Mix 1 sachet with water daily, before or after training.", "20", [["Creatine monohydrate", "6 g"]]],
  "creagen-pro-power": ["20 × 10 g sachets", "Mix 1 sachet with water daily, during or after training.", "20", [["Creatine monohydrate", "6 g"], ["Beta-alanine", "1.6 g"], ["Electrolytes (K, Na, Mg)", "300 mg"]]],
  glutara: ["10 × 5 g sachets", "Mix 1 sachet with water daily.", "10", [["Liposomal glutathione", "500 mg"], ["Vitamin C", "200 mg"], ["Hyaluronic acid", "150 mg"], ["Vitamin B1", "20 mg"], ["Vitamin B6", "5 mg"], ["Piperine", "5 mg"]]],
  sleepo: ["60 mL oral spray", "Adults: 1–2 sprays once a day, 30–60 minutes before bed.", "≈300 sprays", [["Melatonin", "1.25 mg per spray"]]],
  "energized-aminos": ["360 g · peach mango", "1 scoop in 6–8 oz cold water, morning or between meals; also before or after training.", "40", [["Amino blend", "5,000 mg"], ["Energy blend", "175 mg"]]],
  "ultra-test": ["90 capsules", "Take 3 capsules before bedtime.", "30", [["Tribulus terrestris", "750 mg"], ["Magnesium", "200 mg"], ["Chrysin", "75 mg"], ["Horny goat weed", "50 mg"], ["Longjack", "50 mg"], ["Zinc", "30 mg"]]],
  biocollagen: ["350 g · grass-fed type I & III", "Mix 10 g (2 scoops) into a warm drink; add ice after mixing.", "35", [["Hydrolyzed bovine collagen peptides", "10 g"]]],
  "digestive-enzyme": ["60 veggie capsules", "1 capsule twice a day, 20–30 minutes before a meal.", "60", [["Makzyme-Pro enzyme blend", "400 mg"], ["Papain", "2,670 TU"], ["Fungal lipase", "1,500 FIP"], ["Fungal lactase", "600 LACU"], ["Alpha-galactosidase", "300 GALU"], ["Bromelain", "90 GDU"]]],
  bioignite: ["300 g · honeydew watermelon", "Start with 1 scoop to test tolerance; 1–2 scoops 30 minutes before training. Max 2 scoops a day.", "30", [["L-arginine AKG", "1,500 mg"], ["Dicreatine malate", "1,500 mg"], ["Beta-alanine", "750 mg"], ["Energy/focus matrix", "550 mg"], ["Caffeine", "175 mg"]]],
  "bioprotein-pro": ["1 lb 2 oz · vanilla whey isolate", "Mix 1 scoop with 4–6 oz of water, milk or a drink.", "16", [["Whey protein isolate", "25 g"], ["Digestive enzyme blend", "included"]]],
  "vitamin-k2-d3": ["60 capsules", "1 capsule twice a day, 20–30 minutes before a meal with water.", "60", [["Vitamin D3", "125 mcg"], ["Vitamin K2 (MK-7)", "100 mcg"], ["Calcium", "210 mg"], ["BioPerine®", "5 mg"]]],
  "joint-flex": ["60 capsules", "3 capsules daily before a meal (6 a day for the first two weeks for a loading dose).", "20", [["Glucosamine sulfate", "1,500 mg"], ["Boswellia extract", "200 mg"], ["Chondroitin sulfate", "150 mg"], ["Turmeric", "150 mg"], ["Quercetin", "25 mg"], ["Methionine", "25 mg"]]],
  "natural-pct": ["60 capsules", "2 capsules at night for 4–8 weeks; no more than 8 weeks in a row.", "30", [["TestSupport blend", "720 mg"], ["LivSupport blend", "300 mg"], ["EstroControl blend", "105 mg"]]],
  hydrareload: ["1,365 g · summer punch", "1 scoop (27.3 g) in 8 oz cold water, before or after training.", "50", [["Carbohydrate matrix", "24 g"], ["Electrolyte blend", "200 mg"]]],
  magbalance: ["90 capsules", "2 capsules once a day.", "30", [["Magnesium (as glycinate)", "275 mg"]]],
  "mens-vitalprime": ["60 capsules", "2 capsules in the morning with a meal.", "30", [["Male support blend", "170 mg"], ["Vitamin C", "150 mg"], ["Immune support blend", "110 mg"], ["Calcium", "50 mg"], ["Vitamin B12", "27 mcg"], ["Vitamin A", "600 mcg RAE"]]],
  mindsync: ["60 capsules", "2 capsules once a day, 20–30 minutes before a meal with water.", "30", [["Nootropic blend (DMAE, bacopa, choline…)", "692 mg"], ["Vitamin C", "125 mg"], ["Magnesium", "50 mg"], ["Vitamin B6", "12 mg"]]],
  musclerecover: ["346.5 g · fruit punch", "1 scoop in 8–12 oz of water.", "45", [["BCAA 2:1:1", "4,000 mg"], ["L-glutamine", "1,000 mg"], ["Vitamin B6", "2.5 mg"]]],
  "nitric-roots": ["60 veggie capsules", "2 capsules once a day, 20–30 minutes before a meal with water.", "30", [["Organic beetroot powder", "1,300 mg"]]],
  nitricflow: ["Georgia peach rings pre-workout", "1 scoop (12.5 g) in 8 oz water, 20–30 minutes before training; start with half.", "25", [["Citrulline malate", "5,000 mg"], ["Beta-alanine", "2,000 mg"], ["Caffeine", "250 mg"], ["Electrolyte blend", "250 mg"], ["Taurine", "250 mg"], ["Betaine anhydrous", "250 mg"]]],
  plantcore: ["662 g · vanilla plant protein", "1 scoop (33.1 g) with 8 oz of water or in a recipe.", "20", [["Plant protein (organic pea + rice)", "20 g"], ["Dietary fibre", "4 g"]]],
  "adrenal-support-plus": ["60 capsules", "2 capsules at breakfast or before 2 p.m.", "30", [["Fermented organic cordyceps", "475 mg"], ["Eleuthero root", "126 mg"], ["Rhodiola extract", "122 mg"], ["Organic chlorella", "54 mg"], ["Bromelain enzyme blend", "38 mg"], ["Organic burdock root", "36 mg"]]],
  vitalgreens: ["Strawberry watermelon greens", "1 scoop in 8–12 oz of water.", "30", [["Organic wheat grass", "6,000 mg"], ["Organic spirulina", "1,000 mg"], ["Fruit & beet powders", "10 mg each"], ["L. acidophilus", "1 mg"]]],
  "womens-vitalprime": ["60 capsules", "2 capsules in the morning with a meal.", "30", [["Female support blend", "192 mg"], ["Vitamin C", "150 mg"], ["Immune support blend", "115 mg"], ["Calcium", "50 mg"], ["Vitamin B12", "27 mcg"], ["Vitamin A", "600 mcg RAE"]]],
};

export const DRUG_DETAILS: Record<string, DrugDetail> = Object.fromEntries(Object.entries(R).map(([k, [format, use, servings, actives]]) => [k, { format, use, servings, actives }]));
export const drugDetail = (handle: string): DrugDetail | undefined => DRUG_DETAILS[handle];
