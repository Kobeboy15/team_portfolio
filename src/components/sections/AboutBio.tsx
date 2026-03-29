import { aboutData } from "../../data/about";

import { Heading } from "../ui/Heading";
import { ImageFrame } from "../ui/ImageFrame";

/**
 * Image display width per min-width tier: round(viewport × 594/1280), so 1280px → 594px.
 * Tailwind `className` below must list these literals so JIT can emit rules.
 */
const ABOUT_IMAGE_WIDTHS = {
  1024: 475,
  1280: 594,
  1600: 743,
  1920: 891,
  2160: 1001,
  2500: 1160,
  3000: 1392,
  3400: 1578,
  3800: 1763,
  4200: 1949,
  4600: 2135,
  5060: 2348,
} as const;

const aboutImageSizes = [
  `(min-width: 5060px) ${ABOUT_IMAGE_WIDTHS[5060]}px`,
  `(min-width: 4600px) ${ABOUT_IMAGE_WIDTHS[4600]}px`,
  `(min-width: 4200px) ${ABOUT_IMAGE_WIDTHS[4200]}px`,
  `(min-width: 3800px) ${ABOUT_IMAGE_WIDTHS[3800]}px`,
  `(min-width: 3400px) ${ABOUT_IMAGE_WIDTHS[3400]}px`,
  `(min-width: 3000px) ${ABOUT_IMAGE_WIDTHS[3000]}px`,
  `(min-width: 2500px) ${ABOUT_IMAGE_WIDTHS[2500]}px`,
  `(min-width: 2160px) ${ABOUT_IMAGE_WIDTHS[2160]}px`,
  `(min-width: 1920px) ${ABOUT_IMAGE_WIDTHS[1920]}px`,
  `(min-width: 1600px) ${ABOUT_IMAGE_WIDTHS[1600]}px`,
  `(min-width: 1280px) ${ABOUT_IMAGE_WIDTHS[1280]}px`,
  `(min-width: 1024px) ${ABOUT_IMAGE_WIDTHS[1024]}px`,
  "100vw",
].join(", ");

export function AboutBio() {
  return (
        <div className="w-screen max-h-dvh shrink-0 flex items-center justify-center md:justify-between bg-bio-background text-bio-text">
            {/* Wrapper mx: round(vp × 20/1280) per side — same scale as image (mx-5 ≈ 20px at 1280px). */}
            <div className="hidden lg:block min-[1024px]:mx-[16px] min-[1280px]:mx-[20px] min-[1600px]:mx-[25px] min-[1920px]:mx-[30px] min-[2160px]:mx-[34px] min-[2500px]:mx-[39px] min-[3000px]:mx-[47px] min-[3400px]:mx-[53px] min-[3800px]:mx-[59px] min-[4200px]:mx-[66px] min-[4600px]:mx-[72px] min-[5060px]:mx-[79px]">
                <ImageFrame
                    placement="about"
                    src={aboutData.profileImage}
                    alt={aboutData.profileImageAlt}
                    sizes={aboutImageSizes}
                    className="h-auto min-[1024px]:w-[475px] min-[1280px]:w-[594px] min-[1600px]:w-[743px] min-[1920px]:w-[891px] min-[2160px]:w-[1001px] min-[2500px]:w-[1160px] min-[3000px]:w-[1392px] min-[3400px]:w-[1578px] min-[3800px]:w-[1763px] min-[4200px]:w-[1949px] min-[4600px]:w-[2135px] min-[5060px]:w-[2348px]"
                />
            </div>
            <div
                className={`
                flex-1 p-5 md:mx-5 lg:px-3 lg:py-0 flex flex-col md:gap-4 min-w-0
                h-[528px]
                min-[1024px]:h-[511px]
                min-[1280px]:h-[640px]
                min-[1600px]:h-[801px]
                min-[1920px]:h-[960px]
                min-[2160px]:h-[1079px]
                min-[2500px]:h-[1249px]
                min-[3000px]:h-[1500px]
                min-[3400px]:h-[1700px]
                min-[3800px]:h-[1900px]
                min-[4200px]:h-[2100px]
                min-[4600px]:h-[2300px]
                min-[5060px]:h-[2530px]
            `}
            >
                <Heading size="display-96" as="h1" className="text-display-48! md:text-display-96! lg:text-display-48! xl:text-display-128! text-bio-text!">About Me</Heading>
                <hr className="border-none h-1 md:h-2 w-40 md:w-80 bg-accent" aria-hidden="true"/>
                <p className="mt-12 lg:mt-4 xl:mt-12 max-w-[1000px]">{aboutData.bio}</p>
            </div>
        </div>
  );
}
