/**
 * MEDIA SLOTS — drop files into /public/media and set the paths here.
 * Every slot renders a labelled placeholder until a src is provided.
 * Videos: use .mp4 (H.264) + optional poster .jpg. Keep hero videos < 8 MB.
 */
export interface MediaSlot { label: string; video?: string; image?: string; poster?: string }

export const MEDIA: Record<string, MediaSlot> = {
  heroVideo: { label: "Hero film · Biongevity brand video" },
  videoText: { label: "Video Text fill · abstract cells / DNA footage" },
  labsVideo: { label: "BioAro Labs · lab process film" },
  drugsVideo: { label: "BioAro Drugs · sachet / product film" },
  clinicHero: { label: "Clinic interior" },
  appVideo: { label: "ELR App · screen recording" },
  homeLabs: { label: "Lab or test kit image" },
  homeDrugs: { label: "Product photography" },
  lifeHome: { label: "Home setting" },
  lifeOffice: { label: "Office setting" },
  lifeTravel: { label: "Travel setting" },
  founder: { label: "Founder portrait · approved image only" },
};
