/** Languages Biongevity SI reads, writes and translates. Arabic and Persian render right-to-left. */
export type SILanguage = "en" | "fr" | "ar" | "fa";

export const LANGUAGES: { id: SILanguage; label: string; native: string; dir: "ltr" | "rtl"; speech: string }[] = [
  { id: "en", label: "English", native: "English", dir: "ltr", speech: "en-CA" },
  { id: "fr", label: "French", native: "Français", dir: "ltr", speech: "fr-CA" },
  { id: "ar", label: "Arabic", native: "العربية", dir: "rtl", speech: "ar-AE" },
  { id: "fa", label: "Persian", native: "فارسی", dir: "rtl", speech: "fa-IR" },
];
export const langById = (id: SILanguage) => LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
export const isLanguage = (v: unknown): v is SILanguage => LANGUAGES.some((l) => l.id === v);

/** Small interface strings for the chat panel (answers themselves come from Biongevity SI). */
export const UI: Record<SILanguage, { hi: string; intro: string; placeholder: string; listening: string; translate: string; thinking: string; online: string }> = {
  en: { hi: "Hi, I'm Biongevity SI.", intro: "Your guide to Biongevity, BioAro tests, programs and results. I explain and guide — your clinician decides.", placeholder: "Message Biongevity SI", listening: "Listening…", translate: "Translate", thinking: "Thinking…", online: "Online · cites our pages" },
  fr: { hi: "Bonjour, je suis Biongevity SI.", intro: "Votre guide pour Biongevity, les tests BioAro, les programmes et vos résultats. J'explique et j'oriente — votre clinicien décide.", placeholder: "Écrire à Biongevity SI", listening: "À l'écoute…", translate: "Traduire", thinking: "Réflexion…", online: "En ligne · cite nos pages" },
  ar: { hi: "مرحبًا، أنا Biongevity SI.", intro: "دليلك إلى Biongevity وفحوصات BioAro والبرامج والنتائج. أشرح وأرشد — والقرار لطبيبك.", placeholder: "اكتب رسالة إلى Biongevity SI", listening: "جارٍ الاستماع…", translate: "ترجمة", thinking: "جارٍ التفكير…", online: "متصل · يستشهد بصفحاتنا" },
  fa: { hi: "سلام، من Biongevity SI هستم.", intro: "راهنمای شما برای Biongevity، آزمایش‌های BioAro، برنامه‌ها و نتایج. توضیح می‌دهم و راهنمایی می‌کنم — تصمیم با پزشک شماست.", placeholder: "به Biongevity SI پیام دهید", listening: "در حال گوش دادن…", translate: "ترجمه", thinking: "در حال فکر کردن…", online: "آنلاین · با ارجاع به صفحات ما" },
};
