import type { Skill, GridVariants } from "../types/skills";

export const skills: Skill[] = [
  { 
    order: 1,
    name: "Design", 
    bento: [
      {
        slot: "card1",
        test: 1,
        content: 
        {
          type: "heading",
          value: "Translating Complex Ideas into Intuitive User Experiences",
        }
      },
      {
        slot: "card3",
        test: 3,
        cardVariant: "gradient",
        content: 
        {
          type: "paragraph",
          heading: "Responsive UI/UX Design",
          value: "Specializing in UI/UX design with a focus on responsive, mobile-first interfaces and reusable design systems. Collaborating closely with product teams to deliver user-friendly solutions.",
        }
      },
      {
        slot: "card4",
        test: 4,
        content: 
        {
          type: "icon",
          icon: {
            name: "Figma",
            path: "/images/icons/figma.svg",
          },
        }
      },
      {
        slot: "card5",
        test: 5,
        content: 
        {
          type: "icon-carousel",
          heading: "Framer, Photoshop, Wireframing",
          caption: "Designing and prototyping interfaces with modern tools to rapidly iterate, refine user flows, and deliver polished visual experiences.",
          icons: [
            {
              name: "Framer",
              path: "/images/icons/framer.svg",
            },
            {
              name: "Photoshop",
              path: "/images/icons/photoshop.svg",
            },
            {
              name: "Figma",
              path: "/images/icons/figma.svg",
            },
          ]
        }
      },
      {
        slot: "card6",
        test: 6,
        content: 
        {
          type: "sub-heading",
          value: "Design systems · Reusable UI components · Responsive design",
        }
      },
    ],
  },
  { 
    order: 2,
    name: "Development", 
    // gridVariant: 3,
    bento: [
      {
        slot: "card1",
        content: 
        {
          type: "heading",
          value: "Building Scalable, High-Performance Web Applications",
        }
      },
      {
        slot: "card7",
        cardVariant: "gradient",
        content: 
        {
          type: "paragraph",
          value: "8+ years building modern frontend systems using React, Next.js, and TypeScript. Focused on performance, accessibility, and component-driven architecture.",
        }
      },
      {
        slot: "card4",
        content: 
        {
          type: "sub-heading",
          value: "Web3 · REST APIs · PostgreSQL · SEO",
        }
      },
      {
        slot: "card6",
        content: 
        {
          type: "sub-heading",
          value: "React.js, Next.js, TypeScript, GraphQL",
        }
      },
      {
        slot: "card2",
        content: 
        {
          type: "icon-carousel",
          icons: [
            {
              name: "React",
              path: "/images/icons/react.svg",
            },
            {
              name: "NextJS",
              path: "/images/icons/nextdotjs.svg",
            },
            {
              name: "GraphQL",
              path: "/images/icons/graphql.svg",
            },
          ]
        }
      },
    ],
  },
  { 
    order: 3,
    name: "Operations", 
    // gridVariant: 2,
    bento: [
      {
        slot: "card1",
        content: 
        {
          type: "heading",
          value: "Delivering Reliable Systems Across Teams and Platforms",
        }
      },
      {
        slot: "card3",
        cardVariant: "gradient",
        content: 
        {
          type: "paragraph",
          heading: "Performance & Collaboration",
          value: "Experienced in cross-functional collaboration with designers, backend engineers, and product teams. Driving performance optimization and maintainable code standards at scale.",
        }
      },
      {
        slot: "card6",
        content: 
        {
          type: "sub-heading",
          value: "Performance optimization · Accessibility · CMS integration",
        }
      },
      {
        slot: "card5",
        content: 
        {
          type: "icon-carousel",
          heading: "Vue.js, Tailwind CSS, JavaScript, REST APIs",
          caption: "Building and integrating scalable frontends with modern frameworks and APIs to ensure performance, consistency, and maintainability.",
          icons: [
            {
              name: "Vue",
              path: "/images/icons/vuedotjs.svg",
            },
            {
              name: "Tailwind",
              path: "/images/icons/tailwindcss.svg",
            },
            {
              name: "Javascript",
              path: "/images/icons/javascript.svg",
            },
          ]
        }
      },
    ],
  },
];

export const desktopGridVariants : GridVariants[] = [
  {
    card1: { gridColumn: "1 / span 2", gridRow: "1 / span 4" },
    card2: { gridColumn: "3 / span 1", gridRow: "1 / span 4" },
    card3: { gridColumn: "1 / span 1", gridRow: "5 / span 5" },
    card4: { gridColumn: "2 / span 1", gridRow: "5 / span 3" },
    card5: { gridColumn: "3 / span 1", gridRow: "5 / span 7" },
    card6: { gridColumn: "1 / span 1", gridRow: "10 / span 2" },
    card7: { gridColumn: "2 / span 1", gridRow: "8 / span 4" },
  },
  {
    card1: { gridColumn: "2 / span 2", gridRow: "8 / span 4" },
    card2: { gridColumn: "1 / span 1", gridRow: "1 / span 4" },
    card3: { gridColumn: "3 / span 1", gridRow: "3 / span 5" },
    card4: { gridColumn: "1 / span 1", gridRow: "5 / span 3" },
    card5: { gridColumn: "2 / span 1", gridRow: "1 / span 7" },
    card6: { gridColumn: "3 / span 1", gridRow: "1 / span 2" },
    card7: { gridColumn: "1 / span 1", gridRow: "8 / span 4" },
  },
  {
    card1: { gridColumn: "2 / span 2", gridRow: "1 / span 4" },
    card2: { gridColumn: "2 / span 1", gridRow: "5 / span 4" },
    card3: { gridColumn: "1 / span 1", gridRow: "3 / span 5" },
    card4: { gridColumn: "2 / span 1", gridRow: "9 / span 3" },
    card5: { gridColumn: "3 / span 1", gridRow: "7 / span 7" },
    card6: { gridColumn: "1 / span 1", gridRow: "1 / span 2" },
    card7: { gridColumn: "1 / span 1", gridRow: "8 / span 4" },
    card8: { gridColumn: "3 / span 1", gridRow: "5 / span 2" },
  },
];

export const mobileGridVariants: GridVariants[] = [
  {
    card1: { gridColumn: "1 / span 2", gridRow: "1 / span 1" },
    card2: { gridColumn: "1 / span 1", gridRow: "2 / span 1" },
    card3: { gridColumn: "1 / span 2", gridRow: "3 / span 1" },
    card4: { gridColumn: "2 / span 1", gridRow: "2 / span 1" },
    card5: { gridColumn: "1 / span 2", gridRow: "5 / span 1" },
    card6: { gridColumn: "1 / span 1", gridRow: "4 / span 1" },
    card7: { gridColumn: "2 / span 1", gridRow: "4 / span 1" },
  },
  {
    card1: { gridColumn: "1 / span 2", gridRow: "5 / span 1" },
    card2: { gridColumn: "1 / span 1", gridRow: "4 / span 1" },
    card3: { gridColumn: "1 / span 2", gridRow: "3 / span 1" },
    card4: { gridColumn: "2 / span 1", gridRow: "4 / span 1" },
    card5: { gridColumn: "1 / span 2", gridRow: "1 / span 1" },
    card6: { gridColumn: "1 / span 1", gridRow: "2 / span 1" },
    card7: { gridColumn: "2 / span 1", gridRow: "2 / span 1" },
  },
  {
    card1: { gridColumn: "1 / span 2", gridRow: "2 / span 1" },
    card2: { gridColumn: "1 / span 2", gridRow: "5 / span 1" },
    card3: { gridColumn: "2 / span 1", gridRow: "4 / span 1" },
    card4: { gridColumn: "1 / span 1", gridRow: "4 / span 1" },
    card5: { gridColumn: "1 / span 1", gridRow: "1 / span 1" },
    card6: { gridColumn: "2 / span 1", gridRow: "1 / span 1" },
    card7: { gridColumn: "1 / span 2", gridRow: "3 / span 1" },
  },
];