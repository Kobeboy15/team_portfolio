import type { Skill } from "../types/skills";

// PLACEHOLDER DATA
export const skills: Skill[] = [
  { 
    order: 1,
    name: "Design", 
    bento: [
      {
        slot: "card1",
        content: 
        {
          type: "heading",
          value: "Translating Complex Ideas into Intuitive User Experiences",
        }
      },
      {
        slot: "card3",
        cardVariant: "gradient",
        content: 
        {
          type: "paragraph",
          value: "Specializing in UI/UX design with a focus on responsive, mobile-first interfaces and reusable design systems. Collaborating closely with product teams to deliver user-friendly solutions.",
        }
      },
      {
        slot: "card4",
        content: 
        {
          type: "icon",
          icon: {
            name: "Figma",
            path: "images/icons/figma.svg",
          },
        }
      },
      {
        slot: "card5",
        content: 
        {
          type: "icon-carousel",
          heading: "Framer, Photoshop, Wireframing",
          icons: [
            {
              name: "Framer",
              path: "images/icons/framer.svg",
            },
            {
              name: "Photoshop",
              path: "images/icons/photoshop.svg",
            },
            {
              name: "Figma",
              path: "images/icons/figma.svg",
            },
          ]
        }
      },
      {
        slot: "card6",
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
              path: "images/icons/react.svg",
            },
            {
              name: "NextJS",
              path: "images/icons/nextdotjs.svg",
            },
            {
              name: "GraphQL",
              path: "images/icons/graphql.svg",
            },
          ]
        }
      },
    ],
  },
  { 
    order: 3,
    name: "Operations", 
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
          icons: [
            {
              name: "Vue",
              path: "images/icons/vuedotjs.svg",
            },
            {
              name: "Tailwind",
              path: "images/icons/tailwindcss.svg",
            },
            {
              name: "Javascript",
              path: "images/icons/javascript.svg",
            },
          ]
        }
      },
    ],
  },
];