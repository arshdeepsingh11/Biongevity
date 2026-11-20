/**
 * Contact details. UAE = the Dubai clinic (shown on /uae pages). International = no clinic, basic contact only.
 * WhatsApp: NEXT_PUBLIC_WHATSAPP_NUMBER (digits with country code) overrides the default business number.
 */
export const UAE_CLINIC = {
  name: "Biongevity Precision Health and Longevity Clinic",
  short: "Biongevity Dubai",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971505282566").replace(/\D/g, ""),
  whatsappDisplay: "+971\u00A050\u00A0528\u00A02566", // non-breaking spaces: the number never splits over two lines
  phone: "+971\u00A04\u00A0379\u00A06393",
  tel: "tel:+97143796393",
  email: "infodxb@biongevity.com",
  address: ["AB Center, 3rd floor, Office 302", "Sheikh Zayed Road, Al Barsha 1", "Dubai, United Arab Emirates"],
  addressAr: ["مركز AB، الطابق الثالث، مكتب 302", "شارع الشيخ زايد، البرشاء 1", "دبي، الإمارات العربية المتحدة"],
  nameAr: "عيادة بيونجيفيتي للصحة الدقيقة وطول العمر الصحي",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=AB+Center+Sheikh+Zayed+Road+Al+Barsha+1+Dubai",
  emergency: "In an emergency, call 998 (ambulance) or 999.",
  vatNote: "5% VAT applies and is added at booking and check-in.",
};

export const INTERNATIONAL = {
  email: "info@biongevity.com",
  usLaunch: "March 2027",
};

/** WhatsApp link with a pre-filled message. */
export const waLink = (text: string) => `https://wa.me/${UAE_CLINIC.whatsapp}?text=${encodeURIComponent(text)}`;

/** Standard WhatsApp openers, so every page sends a message the team can act on. */
export const WA = {
  general: "Hi Biongevity Dubai, I'd like to book an appointment.",
  book: (what: string) => `Hi Biongevity Dubai, I'd like to book: ${what}.`,
  price: (what: string) => `Hi Biongevity Dubai, could you share the price and any current offers for ${what}?`,
  help: (where?: string) => `Hi Biongevity Dubai, can you help me choose the right ${where ? `${where} ` : ""}treatment?`,
};

/** Address lines in the page language. */
export const addressOf = (l: "en" | "ar") => (l === "ar" ? UAE_CLINIC.addressAr : UAE_CLINIC.address);

/** What goes into a WhatsApp message: on Arabic pages the Arabic name plus the English name, so the team can act fast. */
export const waItem = (l: "en" | "ar", local: string, en?: string) => (l === "ar" && en && en !== local ? `${local} (${en})` : local);
