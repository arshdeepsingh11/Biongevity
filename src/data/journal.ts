export interface Article { slug: string; t: string; cat: string; min: number; source: "BioAro Drugs Science" | "Biongevity sample"; url?: string; sum: string[] }

export const JOURNAL_CATEGORIES = ["All", "Longevity", "Genomics", "Microbiome", "AI", "Sleep", "Protocols", "Recovery"];

export const ARTICLES: Article[] = [
  { slug: "what-are-bioactives", t: "What Are Bioactives?", cat: "Protocols", min: 6, source: "BioAro Drugs Science", url: "https://bioarodrugs.com/us/journal/what-are-bioactives", sum: ["A beginner-friendly guide to bioactive compounds.", "Why evidence-based ingredients matter.", "How to read an ingredient label."] },
  { slug: "morning-longevity-stack", t: "The Morning LONgevity+ Stack", cat: "Protocols", min: 8, source: "BioAro Drugs Science", url: "https://bioarodrugs.com/us/journal/morning-longevity-stack", sum: ["Simple daily routines help consistency.", "Combine formulas into one protocol.", "Anchor supplements to existing habits."] },
  { slug: "recovery-is-where-progress-happens", t: "Recovery Is Where Progress Happens", cat: "Recovery", min: 10, source: "BioAro Drugs Science", url: "https://bioarodrugs.com/us/journal/recovery-is-where-progress-happens", sum: ["Recovery drives long-term performance.", "Sleep, hydration and load all matter.", "Resilience is built between sessions."] },
  { slug: "what-biological-age-measures", t: "What biological age actually measures", cat: "Longevity", min: 6, source: "Biongevity sample", sum: ["Biological age estimates how fast the body is ageing.", "Different methods capture different signals.", "Your own trend matters most."] },
  { slug: "wgs-explained", t: "Whole genome sequencing, explained simply", cat: "Genomics", min: 7, source: "Biongevity sample", sum: ["A genome test reads your DNA sequence.", "Variants indicate risk, not certainty.", "Results are best read with a clinician or counsellor."] },
  { slug: "microbiome-beyond-gut", t: "The microbiome beyond the gut", cat: "Microbiome", min: 5, source: "Biongevity sample", sum: ["Microbes live in the gut, mouth and on the skin.", "Diversity is one useful measure.", "Diet and medication change composition."] },
  { slug: "epigenetics-lifestyle", t: "What epigenetics means for lifestyle", cat: "Longevity", min: 6, source: "Biongevity sample", sum: ["Epigenetic marks affect how genes are used.", "Some are influenced by lifestyle.", "Methylation is one way to measure them."] },
  { slug: "ai-health-data", t: "How AI can help read health data", cat: "AI", min: 8, source: "Biongevity sample", sum: ["AI can organise and summarise large datasets.", "It supports, not replaces, clinical judgement.", "Good systems state what they do not know."] },
  { slug: "sleep-recovery", t: "Sleep and recovery as longevity habits", cat: "Sleep", min: 5, source: "Biongevity sample", sum: ["Consistent timing supports better sleep.", "Wearables show trends, not diagnoses.", "Recovery depends on stress and training load."] },
];
