/**
 * PHOTOS — one place for every photo on the site.
 *
 * Free stock photos from Pexels (pexels.com/license: free for commercial use, no attribution required),
 * chosen for warm, real moments and people of many backgrounds. To use the clinic's own photos, put the
 * file in /public/photos and replace `src` below with "/photos/<file>.jpg" — every page that uses the key updates.
 */
export interface Photo { src: string; alt: string; /** Focus point for object-position, e.g. "50% 30%". */ focus?: string }

const pexels = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop`;

export const PHOTOS = {
  // Our Dubai clinic (frames from the clinic film in /public/media)
  clinicEntrance: { src: "/photos/clinic-entrance.jpg", alt: "Entrance of Biongevity Precision Health and Longevity Clinic, Dubai", focus: "50% 45%" },
  clinicLounge: { src: "/photos/clinic-lounge.jpg", alt: "The patient lounge at Biongevity Dubai", focus: "50% 55%" },
  clinicCorridor: { src: "/photos/clinic-corridor.jpg", alt: "Treatment rooms at Biongevity Dubai", focus: "50% 50%" },
  clinicDental: { src: "/photos/clinic-dental.jpg", alt: "Dental treatment room at Biongevity Dubai", focus: "50% 50%" },
  clinicTreatment: { src: "/photos/clinic-treatment-room.jpg", alt: "Skin treatment room at Biongevity Dubai", focus: "40% 50%" },
  clinicLaser: { src: "/photos/clinic-laser.jpg", alt: "Medical laser in a treatment room at Biongevity Dubai", focus: "40% 40%" },
  clinicFractional: { src: "/photos/clinic-fractional-laser.jpg", alt: "Fractional laser device at Biongevity Dubai", focus: "40% 40%" },

  // People and families
  hijabPortrait: { src: pexels(3748399), alt: "Smiling woman wearing a red hijab", focus: "50% 30%" },
  womanFloral: { src: pexels(1764564), alt: "Smiling woman in a floral blouse", focus: "50% 25%" },
  womanGreen: { src: pexels(4511649), alt: "Smiling woman in a green sweater", focus: "50% 30%" },
  womanShortHair: { src: pexels(4992382), alt: "Woman with short hair and a bright smile", focus: "50% 30%" },
  womanPortrait: { src: pexels(1068207), alt: "Smiling woman in a floral top", focus: "50% 25%" },

  // Departments and services
  derma: { src: pexels(4586713), alt: "Woman receiving a skin treatment in a clinic", focus: "50% 40%" },
  iv: { src: pexels(3845126), alt: "IV drip set up for a patient", focus: "50% 50%" },
  gp: { src: pexels(5215016), alt: "Doctor listening to a smiling patient's heart with a stethoscope", focus: "50% 35%" },
  gpTalk: { src: pexels(4266944), alt: "Doctor and patient discussing a plan in a modern clinic", focus: "50% 40%" },
  welcome: { src: pexels(8313224), alt: "Doctor shaking hands with a smiling patient", focus: "50% 40%" },
  checkup: { src: pexels(5215012), alt: "Doctor examining a smiling patient", focus: "50% 35%" },
  dental: { src: pexels(3845553), alt: "Smiling man in a dental chair talking with his dentist", focus: "50% 40%" },
  dentalSmile: { src: pexels(3845810), alt: "Dentist and patient smiling during a check-up", focus: "50% 40%" },
  lab: { src: pexels(3735747), alt: "Scientist examining samples in a laboratory", focus: "50% 40%" },
  blood: { src: pexels(8533143), alt: "Laboratory technician handling blood sample tubes", focus: "50% 45%" },
  bloodTube: { src: pexels(8539061), alt: "Technician holding a blood sample tube", focus: "50% 40%" },
  home: { src: pexels(7345465), alt: "Nurse checking an older man's health at home", focus: "50% 40%" },
  homeBp: { src: pexels(7345467), alt: "Nurse measuring an older man's blood pressure at home", focus: "50% 40%" },
  vitals: { src: pexels(7659565), alt: "Doctor checking a patient's blood pressure", focus: "50% 50%" },
  tele: { src: pexels(8376282), alt: "Doctor on a video consultation from his clinic", focus: "50% 35%" },
  teleTalk: { src: pexels(8376264), alt: "Doctor explaining results on a video call", focus: "50% 35%" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export const photo = (key?: string): Photo | undefined => (key && key in PHOTOS ? PHOTOS[key as PhotoKey] : undefined);

/** Responsive src/srcset for a photo at a given layout width. Local files are returned as-is. */
export function photoSrc(p: Photo, w = 1200) {
  if (!p.src.startsWith("https://images.pexels.com")) return { src: p.src, srcSet: undefined as string | undefined };
  const at = (x: number) => `${p.src}&w=${x}`;
  return { src: at(w), srcSet: [Math.round(w / 2), w, Math.min(w * 2, 2400)].map((x) => `${at(x)} ${x}w`).join(", ") };
}
