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
