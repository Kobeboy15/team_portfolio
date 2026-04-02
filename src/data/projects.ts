import type { Project } from "../types/projects";

export const projects: Project[] = [
  {
    id: "cubi-commerce",
    year: "2024",
    title: "Cubi Commerce",
    role: "Full-Stack Software Developer",
    slug: "cubi-commerce",
    description: [
      "Built an ecommerce experience focused on fast browsing, expressive product storytelling, and a cleaner path from product discovery to checkout across desktop and mobile.",
      "Created reusable frontend and backend patterns so new campaign drops, merchandising updates, and content changes could be shipped quickly without reworking the entire application.",
    ],
    techStack: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    outcomes: [
      "Reusable merchandising system for future launches",
      "Faster content updates for marketing campaigns",
    ],
    image: "/images/projects/project-1.webp",
    imageAlt: "Cubi Commerce product showcase",
    liveUrl: "https://example.com/cubi-commerce",
    githubUrl: "https://github.com/example/cubi-commerce",
  },
  {
    id: "pulse-scheduler",
    year: "2023",
    title: "Pulse Scheduler",
    role: "Frontend Developer",
    slug: "pulse-scheduler",
    description: [
      "Designed a scheduling dashboard that makes dense booking information easier to scan, helping teams manage appointments, availability, and changes without getting lost in the interface.",
      "Focused on translating product requirements into a calmer editorial layout with flexible content blocks, predictable interactions, and a component structure that could scale as the platform grew.",
    ],
    techStack: ["Next.js", "TypeScript", "Framer Motion", "PostgreSQL"],
    outcomes: [
      "Reduced clutter in multi-step booking flows",
      "Created a scalable component base for future scheduling features",
    ],
    image: "/images/projects/project-1.webp",
    imageAlt: "Pulse Scheduler dashboard preview",
    githubUrl: "https://github.com/example/pulse-scheduler",
  },
];
