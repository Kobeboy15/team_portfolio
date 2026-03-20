import { skills } from "@/src/data/skills";

import { Heading } from "../ui/Heading";
import { Section } from "../ui/Section";

export function SkillsSection() {
  return (
    <Section id="skills" spacing="lg">
        <Heading size="display-96" as="h1" className="mx-7">Expertise/Skills</Heading>
        {
            skills.map((skill, index) => (
                <div key={index} className="w-full min-h-screen flex justify-center items-center">
                    <div className="relative max-w-5xl w-full mx-auto h-[90vh]">
                        <div className="absolute -left-22 top-0 flex flex-col gap-0 items-center">
                            <span className="font-bebas text-display-96 leading-none justify-center">
                                {String(skill.order).padStart(2, '0')}
                            </span>
                            <span className="text-(--token-accent) font-bebas text-display-96 leading-none [writing-mode:vertical-rl] rotate-180">
                                {skill.name.toUpperCase()}
                            </span>
                        </div>


                        {/* TODO: Bento Grid will go here later */}
                        <div className="bg-indigo-200 text-black rounded-3xl flex justify-center items-center w-full h-full">Bento Grid Placeholder</div>
                    </div>
                </div>
            ))
        }
    </Section>
  );
}