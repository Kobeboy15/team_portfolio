import { aboutData } from "../../data/about";

import { Heading } from "../ui/Heading";
import { ImageFrame } from "../ui/ImageFrame";

export function AboutBio() {
  return (
        <div className="flex items-center justify-center md:justify-between max-w-screen">
            <div className="mx-5 hidden md:block">
                <ImageFrame
                    placement="about"
                    src={aboutData.profileImage}
                    alt={aboutData.profileImageAlt}
                />
            </div>
            <div className="flex-1 p-5 md:mx-5 md:px-20 h-full flex flex-col md:gap-4 min-w-0 max-w-full">
                <Heading size="display-96" as="h1" className="text-display-48! md:text-display-96!">About Me</Heading>
                <hr className="border-none h-1 md:h-2 w-40 md:w-80 bg-(--token-accent)"/>
                <p className="mt-12 max-w-full">{aboutData.bio}</p>
            </div>
        </div>
  );
}