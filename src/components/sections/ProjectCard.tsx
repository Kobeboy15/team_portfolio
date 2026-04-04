import type { Project } from "../../types/projects";
import { PROJECT_IMAGE_LAYOUT } from "../../lib/projectImageLayout";

import { Heading } from "../ui/Heading";
import { ImageFrame } from "../ui/ImageFrame";

import { cn, ExternalLinkIcon } from "./projectCardShared";

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

type ProjectGroupProps = {
  label: string;
  items: string[];
};

function ProjectGroup({ label, items }: ProjectGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans text-sora-14 font-light text-accent">{label}</p>
      <ul className="space-y-1 font-sans text-sora-14 font-light leading-6 text-foreground">
        {items.map((item, index) => (
          <li key={`${label}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const titleId = `${project.id}-title`;
  const hasLinks = Boolean(project.liveUrl || project.githubUrl);

  return (
    <article
      aria-label={`${project.title}, ${project.year}`}
      className={cn("flex w-full items-center justify-center", className)}
    >
      {/* Below lg: fluid layout; role below description — desktop uses ProjectCardDesktop in DesktopStickyProjects */}
      <div className="block w-full">
        <div className="grid gap-8 lg:grid-cols-[minmax(270px,1fr)_minmax(280px,360px)_minmax(0,220px)] lg:items-center lg:gap-y-10 lg:gap-x-6 xl:grid-cols-[minmax(240px,350px)_minmax(320px,443px)_minmax(180px,280px)] xl:gap-x-10 2xl:grid-cols-[minmax(260px,350px)_minmax(443px,var(--token-project-image-width))_minmax(260px,350px)] 2xl:gap-x-[clamp(32px,6vw,123px)]">
          <div className="min-w-0 flex flex-col gap-8 lg:gap-10">
            <header className="-space-y-2">
              <Heading
                size="display-96"
                as="h2"
                className="text-display-48! leading-[0.8] sm:text-display-96!"
              >
                <span id={titleId}>{project.title}</span>
              </Heading>
              <Heading
                size="display-48"
                tone="accent"
                as="p"
                className="text-display-36! leading-none sm:text-display-48!"
              >
                {project.year}
              </Heading>
            </header>

            <div className="flex flex-col gap-3">
              <p className="font-sans text-sora-14 font-light text-accent">
                Description
              </p>
              <div className="space-y-4 font-sans text-sora-14 font-light leading-6 text-foreground lg:max-w-[34ch]">
                {project.description.map((paragraph, index) => (
                  <p key={`${project.id}-description-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-sans text-sora-14 font-light text-accent">
                Role/Project Type
              </p>
              <p className="font-sans text-sora-14 font-light leading-6 text-foreground">
                {project.role}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex justify-center">
            <ImageFrame
              placement="projects"
              src={project.image}
              alt={project.imageAlt}
              className={PROJECT_IMAGE_LAYOUT.frameClassName}
            />
          </div>

          <div className="min-w-0 flex flex-col gap-8 lg:gap-10 xl:gap-12">
            <ProjectGroup label="Tech Stack" items={project.techStack} />
            <ProjectGroup label="Outcomes" items={project.outcomes} />

            {hasLinks ? (
              <div className="flex flex-col items-start gap-3 pt-1">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-sans text-sora-14 font-light text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`${project.title} live demo`}
                  >
                    <span>View more</span>
                    <ExternalLinkIcon />
                  </a>
                ) : null}

                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-sora-14 font-light text-foreground/75 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`${project.title} GitHub repository`}
                  >
                    GitHub
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
