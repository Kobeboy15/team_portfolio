import { skills } from "@/src/data/skills";

import { Heading } from "../ui/Heading";
import { Section } from "../ui/Section";
import { BentoGrid } from "../ui/BentoGrid";

export function SkillsSection() {
  return (
    <Section id="skills" spacing="sm" className="bg-(--token-background)">
        <Heading size="display-48" as="h1" className="mx-5 md:mx-7 text-display-48! md:text-display-96!">Expertise/Skills</Heading>
        {
            skills.map((skill) => (
                <div key={skill.order} className="w-full mb-7 md:mb-0 md:h-screen pr-2 flex justify-end md:justify-center items-start md:items-center">
                    <div className="relative w-full md:w-[75vw] md:mx-auto md:h-[90vh]">
                        { /* TODO: style proplerly*/}
                        <div className="flex md:hidden flex-row items-baseline gap-1 mb-3 font-bebas text-display-48 leading-none mt-10 mx-5">
                            <span>{String(skill.order).padStart(2, '0')}</span>
                            <span className="text-(--token-accent)">{skill.name.toUpperCase()}</span>
                        </div>

                        <div className="font-bebas text-display-48 md:text-display-96 leading-none absolute -left-11 md:-left-22 top-0 hidden md:flex flex-col gap-0 items-center">
                            <span>
                                {String(skill.order).padStart(2, '0')}
                            </span>
                            <span className="text-(--token-accent) [writing-mode:vertical-rl] rotate-180">
                                {skill.name.toUpperCase()}
                            </span>
                        </div>

                        <div className="flex justify-center items-center w-full h-full p-2 md:px-0">
                            <BentoGrid items={skill.bento}/>
                        </div>
                    </div>
                </div>
            ))
        }
    </Section>
  );
}
