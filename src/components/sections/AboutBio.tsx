import { aboutData } from "../../data/about";

import { Heading } from "../ui/Heading";
import { ImageFrame } from "../ui/ImageFrame";

export function AboutBio() {
  return (
        <div className="flex items-center justify-center md:justify-between">
            <div className="mx-5">
                <ImageFrame
                    placement="about"
                    src={aboutData.profileImage}
                    alt={aboutData.profileImageAlt}
                />
            </div>
            <div className="flex-1 mx-5 px-20 h-full flex flex-col gap-4">
                <Heading size="display-96" as="h1">About Me</Heading>
                <hr className="border-none h-2 w-80 bg-[var(--token-accent)]"/>
                <p className="mt-12">{aboutData.bio}</p>
            </div>
        </div>
  );
}