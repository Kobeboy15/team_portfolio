import type { AboutData } from "../types/about";

const TIMELINE_BASE = "/images/about/timeline";

export const aboutData: AboutData = {
  // Placeholder data, to be replaced with actual content in the future
  bio: "I’m a frontend engineer with over 8 years of experience building scalable, high-performance web applications and SaaS platforms. I specialize in modern frontend development using React, Next.js, and TypeScript, with a strong focus on performance, accessibility, and creating intuitive user experiences.",
  profileImage: "/images/about/about-profile.webp",
  profileImageAlt: "Profile picture of me",

  pointsImage: "/images/about/about-points.webp",
  pointsImageAlt: "Photograph by me",
  points: [
    {
      title: "Core Focus",
      description:
        "Currently, I’m working at Yield Guild Games, where I develop Web3 interfaces that support gaming experiences within a global blockchain ecosystem. My work sits at the intersection of product design and engineering — translating complex ideas into resilient, user-friendly interfaces.",
    },
    {
      title: "Technical Philosophy",
      description:
        "I’m particularly passionate about building scalable frontend architectures, crafting reusable design systems, and optimizing applications for speed and discoverability. From responsive, mobile-first experiences to performance and SEO improvements, I aim to create products that are both efficient and enjoyable to use.",
    },
    {
      title: "Creative Outlook",
      description:
        "Outside of work, I’m a bit of a creative nerd — I love movies and cinematography, spend time exploring photography, and often dive into new creative hobbies just to see where they go. I’m also into gaming and occasionally find myself deep in the world of crypto, experimenting and learning along the way.",
    },
    {
      title: "Collaboration",
      description:
        "I enjoy collaborating with designers, backend engineers, and product teams to build thoughtful, impactful digital experiences that scale.",
    },
  ],

  separatorImage: "/images/about/about-separator.webp",
  separatorImageAlt: "Photograph by me",

  timeline: [
    {
      image: `${TIMELINE_BASE}/timeline-2023-03.webp`,
      imageAlt: "Gallery photograph",
      title: "Opening wall",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
      year: "2023",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2023-02.webp`,
      imageAlt: "Gallery photograph",
      title: "Evening walk",
      description: "Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.",
      year: "2023",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2024-01.webp`,
      imageAlt: "Gallery photograph",
      title: "Spring corridor",
      description: "Placeholder copy for a slide without a prior caption; replace when content is ready.",
      year: "2024",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2024-02.webp`,
      imageAlt: "Gallery photograph",
      title: "Studio notes",
      description: "Auctor augue mauris augue neque gravida in fermentum et sollicitudin.",
      year: "2024",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2024-03.webp`,
      imageAlt: "Gallery photograph",
      title: "City rhythm",
      description: "Placeholder copy for a slide without a prior caption; replace when content is ready.",
      year: "2024",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2024-04.webp`,
      imageAlt: "Gallery photograph",
      title: "Late train",
      description: "Placeholder copy for a slide without a prior caption; replace when content is ready.",
      year: "2024",
    },
    // 2025 — no timelineSeparators entry: separator should use last slide after sort by image (timeline-2024-03).
    {
      image: `${TIMELINE_BASE}/timeline-2023-01.webp`,
      imageAlt: "Gallery photograph",
      title: "2025 test — early path",
      description: "Placeholder slide for 2025; separator falls back to last image in sorted order.",
      year: "2025",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2024-03.webp`,
      imageAlt: "Gallery photograph",
      title: "2025 test — mid sort order",
      description: "Uses a 2024 asset path with year 2025 for CMS-style testing.",
      year: "2025",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2023-02.webp`,
      imageAlt: "Gallery photograph",
      title: "2025 test — another asset",
      description: "Mixed timeline folder assets assigned to 2025.",
      year: "2025",
    },
    // 2026 — explicit separator below in timelineSeparators.
    {
      image: `${TIMELINE_BASE}/timeline-2024-01.webp`,
      imageAlt: "Gallery photograph",
      title: "2026 test — corridor",
      description: "Placeholder slide for 2026 gallery hall.",
      year: "2026",
    },
    {
      image: `${TIMELINE_BASE}/timeline-2023-03.webp`,
      imageAlt: "Gallery photograph",
      title: "2026 test — closing beat",
      description: "Second 2026 slide; separator uses dedicated row, not this image.",
      year: "2026",
    },
  ],

  timelineSeparators: [
    {
      year: "2023",
      src: `${TIMELINE_BASE}/timeline-2023-01.webp`,
      alt: "Full-width photograph separating gallery sections",
    },
    {
      year: "2024",
      src: `${TIMELINE_BASE}/timeline-2024-02.webp`,
      alt: "Full-width photograph separating gallery sections",
    },
    // Intentionally no entry for 2025 — tests last-slide separator fallback.
    {
      year: "2026",
      src: `${TIMELINE_BASE}/timeline-2024-04.webp`,
      alt: "Full-width photograph separating gallery sections (2026 test)",
    },
  ],
};
