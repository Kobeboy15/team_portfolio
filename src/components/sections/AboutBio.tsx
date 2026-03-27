import { aboutData } from "../../data/about";

import { Heading } from "../ui/Heading";
import { ImageFrame } from "../ui/ImageFrame";

export function AboutBio() {
  return (
        <div className="w-screen max-h-dvh shrink-0 flex items-center justify-center md:justify-between">
            <div className="mx-5 hidden lg:block">
                <ImageFrame
                    placement="about"
                    src={aboutData.profileImage}
                    alt={aboutData.profileImageAlt}
                />
            </div>
            <div className="flex-1 p-5 md:mx-5 md:px-20 lg:px-3 lg:pt-5 h-full flex flex-col md:gap-4 min-w-0">
                <Heading size="display-96" as="h1" className="text-display-48! md:text-display-96! lg:text-display-48! xl:text-display-96!">About Me</Heading>
                <hr className="border-none h-1 md:h-2 w-40 md:w-80 bg-accent" aria-hidden="true"/>
                <p className="mt-12 lg:mt-4 xl:mt-12">{aboutData.bio}</p>
            </div>
        </div>
  );
}