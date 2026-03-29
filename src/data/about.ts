import type { AboutData } from "../types/about";

const TIMELINE_BASE = "/images/about/timeline";

export const aboutData: AboutData = {
  // Placeholder data, to be replaced with actual content in the future
  bio: "Placeholder: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
  profileImage: "/images/about/about-profile.webp",
  profileImageAlt: "Profile picture of me",

  pointsImage: "/images/about/about-points.webp",
  pointsImageAlt: "Photograph by me",
  points: [
    {
      title: "Placeholder Title",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
    },
    {
      title: "Placeholder Title",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
    },
    {
      title: "Placeholder Title",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
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
