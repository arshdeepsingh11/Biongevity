/**
 * MEDIA SLOTS — files live in /public/media. Set `video` / `image` to use them.
 * Any slot without a src renders a labelled placeholder.
 */
export interface MediaSlot { label: string; video?: string; image?: string; poster?: string }

export const MEDIA: Record<string, MediaSlot> = {
  brandFilm: { label: "Biongevity · brand film", video: "/media/brand-film.mp4", poster: "/media/brand-film.jpg" },
  brandLoop: { label: "Biongevity · brand loop", video: "/media/brand-loop.mp4", poster: "/media/brand-film.jpg" },
  clinicFilm: { label: "Biongevity Clinic Dubai", video: "/media/clinic-film.mp4", poster: "/media/clinic-film.jpg" },
  clinicLoop: { label: "Biongevity Clinic Dubai", video: "/media/clinic-loop.mp4", poster: "/media/clinic-film.jpg" },
  appVideo: { label: "Biongevity App · screen recording" },
  founder: { label: "Founder portrait · approved image only" },
};
