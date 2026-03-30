export type AboutData = {
  bio: string;
  profileImage: string;
  profileImageAlt: string;

  pointsImage: string;
  pointsImageAlt: string;
  points: AboutPoint[];

  separatorImage: string;
  separatorImageAlt: string;

  /** Flat gallery/timeline slides from CMS (grouped by `year` in the builder). */
  timeline: AboutSlide[];
  /** Per-year full-width separator before each wall; fallback if missing: last slide image for that year. */
  timelineSeparators: AboutTimelineSeparator[];
};

export type AboutPoint = {
  title: string;
  description: string;
};

/** PM contract: one gallery slide row. */
export type AboutSlide = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  year?: string;
};

export type AboutTimelineSeparator = {
  year: string;
  src: string;
  alt: string;
};

export type AboutGalleryHall = {
  /** Visible year label on the wall (e.g. "2023", "Other"). */
  year: string;
  yearId: string;
  separator: { src: string; alt: string };
  slides: AboutSlide[];
  backgroundClassName: string;
};
