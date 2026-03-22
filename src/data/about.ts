import type { AboutData } from "../types/about";

import { timelineData } from "./timeline";

export const aboutData: AboutData = {   // Placeholder data, to be replaced with actual content in the future
  bio: "Placeholder: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
  profileImage: "/images/about/about-profile.webp",
  profileImageAlt: "Profile picture of me",

  pointsImage: "/images/about/about-points.webp",
  pointsImageAlt: "Photograph by me",
  points: [
    {
      title: "Placeholder Title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
    },
    {
      title: "Placeholder Title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
    },
    {
      title: "Placeholder Title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam elementum purus turpis, a dignissim tortor blandit sit amet. Aliquam consectetur tempor nisi et commodo. Cras auctor diam purus, id ornare enim tempus nec. Aliquam non nisl ut turpis interdum pharetra. Curabitur sodales ut odio malesuada posuere. Pellentesque dolor dolor, consectetur non orci et, rhoncus fringilla erat. Vivamus ultricies mauris eget tellus accumsan blandit convallis vel eros. In ut accumsan nulla. Nunc ut eleifend lacus, eu feugiat orci. Cras vitae elementum odio. Sed laoreet dui ac facilisis vulputate. Mauris ultrices placerat ligula, in feugiat eros fermentum in. Phasellus finibus enim dui, ut convallis quam auctor nec. Donec hendrerit ac ipsum id aliquet.",
    },
  ],
  
  separatorImage: "/images/about/about-separator.webp",
  separatorImageAlt: "Photograph by me",

  timeline: timelineData,
};