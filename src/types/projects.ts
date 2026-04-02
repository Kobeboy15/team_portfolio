export type Project = {
  id: string;
  year: string; // Display only (e.g. "2023")
  title: string;
  role: string;
  slug: string;
  description: string[];
  techStack: string[];
  outcomes: string[];
  image: string;
  imageAlt: string;
  liveUrl?: string;
  githubUrl?: string;
};
