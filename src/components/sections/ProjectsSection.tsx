import { projects } from "../../data/projects";

import { Section } from "../ui/Section";

import { DesktopStickyProjects } from "./DesktopStickyProjects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  return (
    <Section id="projects" spacing="sm" className="w-full bg-background" withSectionGap>
      <div className="mx-5 flex flex-col gap-10 md:mx-7 lg:mx-10 xl:mx-20 lg:gap-16">
        <div className="flex flex-col gap-16 lg:gap-24">
          <div className="flex flex-col lg:hidden">
            {projects.map((project, index) => (
              <div key={project.id} className="flex flex-col">
                <ProjectCard project={project} />
                {index < projects.length - 1 ? (
                  <div
                    className="mx-auto my-8 h-px w-[94%] max-w-[46rem] bg-border md:my-10"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <DesktopStickyProjects projects={projects} />
          </div>
        </div>
      </div>
    </Section>
  );
}
