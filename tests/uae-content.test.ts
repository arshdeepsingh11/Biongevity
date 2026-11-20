import { describe, expect, it } from "vitest";
import { ALL_SERVICES, DEPARTMENTS } from "@/content/uae";
import { NOT_IN_UAE, UAE_SUPPLEMENTS } from "@/content/supplements";

/**
 * The clinic's official list (Adil, Nov 2026), word for word: every department has an overview page and every
 * item below has its own page. If the clinic changes the list, update it here and in src/content/uae.
 */
const OFFICIAL: Record<string, string[]> = {
  "General Practice & Preventive Health": ["GP Consultation", "Acute Illness & Common Conditions", "Chronic Disease Management", "Preventive Health Consultation", "Standard Health Check", "Women's Health Assessment", "Men's Health Assessment", "Vitamin & Mineral Assessment", "Comprehensive Health Assessment", "Vaccinations"],
  "Dermatology & Aesthetic Medicine": ["HydraFacial", "Chemical Peels", "Skin Boosters", "Facial Mesotherapy", "Facial PRP", "Facial Exosome Therapy", "HIFU", "Fractional CO2 Laser", "Q-Switch Laser", "Laser Skin Rejuvenation", "Laser Hair Removal", "Tattoo Removal", "Botox", "Dermal Fillers", "Fat-Dissolving Treatments", "Lip Rejuvenation", "PRP Hair Treatment", "Hair Mesotherapy", "Hair Exosome Therapy", "Dermatologist Consultation", "Acne Treatment", "Pigmentation Treatment", "Hair & Scalp Consultation"],
  "IV Therapy & Wellness": ["Immunity IV Drip", "Skin Glow IV Drip", "Energy IV Drip", "Hydration IV Drip", "General Wellness IV Drip", "Functional Medicine Consultation", "Wellness Assessment", "Nutritional Consultation", "Weight Management", "Personalised Wellness Programmes", "Vitamin & Mineral Injections"],
  "Dental Care": ["Dental Consultation", "Scaling & Polishing", "Complete Smile Care", "Family Dental Package"],
  "Longevity & Precision Health": ["Longevity Consultation", "Healthy Ageing Assessment", "Biological Age Assessment", "Epigenetic Age Testing", "Personalised Longevity Programmes", "Whole Genome Sequencing (WGS)", "Whole Exome Sequencing (WES)", "Disease-Focused Exome Testing", "Pharmacogenomic Testing", "Microbiome Testing", "Cell-Free DNA Testing", "Comprehensive Cell-Free DNA Testing", "Tissue Biopsy Analysis"],
  "Diagnostics & Laboratory": ["General Blood Tests", "Basic Wellness Panel", "Standard Wellness Panel", "Comprehensive Wellness Panel", "Hormone Testing", "Thyroid Testing", "Vitamin & Mineral Testing"],
  "Home Healthcare": ["Doctor Home Visit", "Nurse Home Visit", "Home Blood Testing", "Vital Signs Monitoring", "Wound Dressing", "Home IV Therapy", "Post-Procedure & Post-Surgical Home Care"],
  "Telehealth": ["Online GP Consultation", "Medical Follow-Up Consultation", "Test Results Review", "Chronic Disease Follow-Up", "Dermatology Consultation", "Women's Health Consultation", "Hormone & Wellness Follow-Up", "Functional Medicine Follow-Up"],
};

const SUBHEADINGS: Record<string, string[]> = {
  "Dermatology & Aesthetic Medicine": ["Skin Rejuvenation", "Laser & Energy Treatments", "Injectables & Aesthetic Treatments", "Hair & Scalp Treatments", "Medical Dermatology"],
  "IV Therapy & Wellness": ["IV Therapy", "Wellness Services"],
  "Longevity & Precision Health": ["Longevity & Preventive Medicine", "Genetic & Advanced Testing"],
  "Diagnostics & Laboratory": ["Laboratory Testing"],
};

describe("UAE departments and services", () => {
  it("has exactly the 8 official departments", () => {
    expect(DEPARTMENTS.map((d) => d.name).sort()).toEqual(Object.keys(OFFICIAL).sort());
  });

  it("has every official service, word for word, in the right department, and nothing extra", () => {
    for (const d of DEPARTMENTS) {
      const names = d.groups.flatMap((g) => g.services.map((s) => s.name));
      expect(names, d.name).toEqual(OFFICIAL[d.name]);
    }
    expect(ALL_SERVICES.length).toBe(83);
  });

  it("keeps the official sub-headings", () => {
    for (const [dept, subs] of Object.entries(SUBHEADINGS)) {
      expect(DEPARTMENTS.find((d) => d.name === dept)!.groups.map((g) => g.name)).toEqual(subs);
    }
  });

  it("puts skin first (half of Dubai revenue)", () => {
    expect(DEPARTMENTS[0].id).toBe("dermatology-aesthetics");
  });

  it("has unique, URL-safe slugs and full content for every service", () => {
    const urls = new Set<string>();
    for (const { dept, service } of ALL_SERVICES) {
      expect(service.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      const url = `${dept.id}/${service.slug}`;
      expect(urls.has(url), url).toBe(false);
      urls.add(url);
      expect(service.short.length, service.name).toBeLessThanOrEqual(110);
      expect(service.about.length, service.name).toBeGreaterThan(60);
      expect(service.forWho.length, service.name).toBeGreaterThanOrEqual(2);
      expect(service.includes.length, service.name).toBeGreaterThanOrEqual(2);
    }
  });

  it("never mentions removed or wrong content", () => {
    const text = JSON.stringify(DEPARTMENTS);
    for (const word of ["Calgary", "Alberta", "CAD", "BioAro", "Geriatric", "geriatric", "Cardiology", "cardiology", "Heart Failure", "AED ", "$"]) {
      expect(text.includes(word), word).toBe(false);
    }
  });
});

describe("UAE supplements", () => {
  it("never lists formulas that are not approved in the UAE", () => {
    const text = JSON.stringify(UAE_SUPPLEMENTS).toLowerCase();
    for (const name of NOT_IN_UAE) expect(text.includes(name.toLowerCase()), name).toBe(false);
  });

  it("lists the CellOmega+ fish-oil version, not the vegan one", () => {
    const cell = UAE_SUPPLEMENTS.find((s) => s.id === "cellomega-plus")!;
    expect(cell.detail.toLowerCase()).toContain("fish");
    expect(JSON.stringify(cell).toLowerCase()).not.toContain("vegan");
    expect(JSON.stringify(cell).toLowerCase()).not.toContain("algae");
  });

  it("shows no prices", () => {
    expect(JSON.stringify(UAE_SUPPLEMENTS)).not.toMatch(/\$|AED|USD|price/i);
  });
});
