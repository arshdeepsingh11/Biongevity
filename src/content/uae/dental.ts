import type { Department } from "../types";

export const DENTAL: Department = {
  id: "dental-care",
  name: "Dental Care",
  short: "Dental Care",
  icon: "tooth",
  tagline: "Healthy teeth and a confident smile, for the whole family.",
  intro:
    "Gentle dental care for adults and families: check-ups, cleaning and smile care, with clear advice to keep your teeth and gums healthy for life.",
  longevity: "Longevity for your smile: healthy gums and teeth support your health at every age.",
  photo: "dental",
  why: [
    { t: "Gentle care", d: "A calm, unhurried approach, with every step explained." },
    { t: "Prevention first", d: "Regular check-ups and cleaning to avoid problems later." },
    { t: "Family friendly", d: "Care for the whole family, with family packages." },
  ],
  steps: [
    { t: "Message or book", d: "Tell us what you need and choose a time." },
    { t: "Examination", d: "A dentist checks your teeth and gums and explains what they see." },
    { t: "Treatment plan", d: "Clear options, with what each one involves." },
    { t: "Care and follow-up", d: "Treatment, home-care advice and your next check-up." },
  ],
  faqs: [
    { q: "How often should I see a dentist?", a: "Most people benefit from a check-up and cleaning every six months. Your dentist will advise what suits you." },
    { q: "Do you treat children?", a: "Ask our team on WhatsApp about family appointments and the Family Dental Package." },
    { q: "How much does it cost?", a: "Prices depend on the treatment. Message us on WhatsApp for today's price. 5% VAT applies." },
  ],
  groups: [
    {
      id: "dental-services",
      name: "Dental Services",
      services: [
        {
          slug: "dental-consultation",
          photo: "clinicDental",
          name: "Dental Consultation",
          short: "A full check of your teeth and gums, with a clear plan.",
          about: "A dental examination to check your teeth, gums and bite, answer your questions and agree any treatment you need.",
          forWho: ["Routine check-up", "Tooth pain or sensitivity", "A second opinion", "New patients"],
          includes: ["Dental examination", "X-rays where needed", "Explanation of findings", "Treatment plan"],
          facts: { time: "Around 30 min", where: "In clinic" },
        },
        {
          slug: "scaling-polishing",
          photo: "dentalSmile",
          name: "Scaling & Polishing",
          short: "Professional cleaning to remove tartar and stains.",
          about: "A professional clean that removes plaque and tartar above and just below the gum line, then polishes the teeth to reduce staining and keep gums healthy.",
          forWho: ["Regular six-monthly cleaning", "Tartar build-up", "Stained teeth", "Bleeding gums"],
          includes: ["Scaling of plaque and tartar", "Polishing", "Gum and home-care advice"],
          facts: { time: "Around 30–45 min", downtime: "None", sessions: "Every 6 months", where: "In clinic" },
        },
        {
          slug: "complete-smile-care",
          photo: "dental",
          name: "Complete Smile Care",
          short: "Check-up, cleaning and a personal plan for a healthy smile.",
          about: "A complete visit combining a dental examination, professional cleaning and a personal plan for any treatment or cosmetic goals you have.",
          forWho: ["A full dental refresh", "New patients", "People with cosmetic goals"],
          includes: ["Dental examination", "Scaling and polishing", "Personal smile plan"],
          facts: { time: "Around 60 min", where: "In clinic" },
        },
        {
          slug: "family-dental-package",
          photo: "dentalSmile",
          name: "Family Dental Package",
          short: "Check-ups and cleaning for the whole family, booked together.",
          about: "Dental check-ups and cleaning for family members, booked together for convenience, with advice for every age.",
          forWho: ["Families", "Parents and children", "Back-to-back family appointments"],
          includes: ["Check-ups for each family member", "Cleaning where suitable", "Home-care advice for all ages"],
          facts: { where: "In clinic" },
        },
      ],
    },
  ],
};
