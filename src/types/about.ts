export type AboutData = {
  bio: string;
  profileImage: string;
  profileImageAlt: string;

  pointsImage: string;
  pointsImageAlt: string;
  points: AboutPoint[];

  separatorImage: string;
  separatorImageAlt: string;
  timeline: TimelineYear[];
}

export type AboutPoint = {
  title: string;
  description: string;
}

export type TimelineYear = {
  year: string;               // Display only (e.g. "2023")
  entries: TimelineEntry[];
}

export type TimelineEntry = {
  image: string;
  imageAlt: string;
  description?: string;
}