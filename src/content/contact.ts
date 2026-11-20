/**
 * Contact details. UAE = the Dubai clinic (shown on /uae pages). International = no clinic, basic contact only.
 * WhatsApp: NEXT_PUBLIC_WHATSAPP_NUMBER (digits with country code) overrides the default business number.
 */
export const UAE_CLINIC = {
  name: "Biongevity Precision Health and Longevity Clinic",
  short: "Biongevity Dubai",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971505282566").replace(/\D/g, ""),
  whatsappDisplay: "+971 50 528 2566",
  phone: "+971 4 379 6393",
  tel: "tel:+97143796393",
  email: "infodxb@biongevity.com",
  address: ["AB Center, 3rd floor, Office 302", "Sheikh Zayed Road, Al Barsha 1", "Dubai, United Arab Emirates"],
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
