import type { CSSProperties, ReactNode } from "react";

import type { Project } from "../../types/projects";
import {
  PROJECT_CARD_DESKTOP_CONTENT_HEIGHT_PX,
  PROJECT_CARD_DESKTOP_LINK_ROW_MIN_HEIGHT_PX,
} from "../../lib/projectCardLayout";
import { PROJECT_IMAGE_LAYOUT } from "../../lib/projectImageLayout";

import { Heading } from "../ui/Heading";
import { ImageFrame } from "../ui/ImageFrame";

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

type ProjectGroupProps = {
  label: string;
  items: string[];
};

const H = PROJECT_CARD_DESKTOP_CONTENT_HEIGHT_PX;

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function contentHeightStyle(px: number): CSSProperties {
  return { height: px };
}

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

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-3.5 w-3.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9L9 3M4 3H9V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkPlaceholder({ children }: { children: ReactNode }) {
  return (
    <span
      className="invisible inline-flex select-none items-center gap-2 font-sans text-sora-14 font-light"
      aria-hidden
    >
      {children}
    </span>
  );
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const titleId = `${project.id}-title`;
  const hasLinks = Boolean(project.liveUrl || project.githubUrl);

  return (
    <article
      aria-label={`${project.title}, ${project.year}`}
      className={cn(
        "flex w-full items-center justify-center lg:h-[calc(100dvh-72px)]",
        className,
      )}
    >
      {/* Below lg: fluid layout; role below description */}
      <div className="block w-full lg:hidden">
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

      {/* lg+: fixed skeleton — Cheval-style stable frame for future sticky index */}
      <div className="hidden w-full lg:block">
        <div className="mx-auto grid w-full max-w-[min(100%,90rem)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)_minmax(0,1fr)] lg:items-stretch lg:gap-y-10 lg:gap-x-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,443px)_minmax(0,1fr)] xl:gap-x-10 2xl:max-w-[min(100%,160rem)] 2xl:grid-cols-[minmax(0,1fr)_minmax(443px,var(--token-project-image-width))_minmax(0,1fr)] 2xl:gap-x-[clamp(32px,6vw,123px)]">
          <div className="flex min-h-0 min-w-0 flex-col gap-8 lg:h-full lg:justify-center lg:gap-10">
            <header aria-hidden className="shrink-0">
              <div
                className="flex flex-col justify-end overflow-hidden"
                style={contentHeightStyle(H.title)}
              >
                <Heading
                  size="display-64"
                  as="h2"
                  className="line-clamp-2 xl:text-[5rem]! xl:leading-[0.8]! 2xl:text-display-96!"
                >
                  <span>{project.title}</span>
                </Heading>
              </div>
              <div
                className="flex items-end overflow-hidden"
                style={contentHeightStyle(H.year)}
              >
                <Heading
                  size="display-48"
                  tone="accent"
                  as="p"
                  className="line-clamp-1 text-display-36! leading-none sm:text-display-48!"
                >
                  {project.year}
                </Heading>
              </div>
            </header>

            <div className="flex min-h-0 flex-col gap-3">
              <p className="font-sans text-sora-14 font-light text-accent">
                Description
              </p>
              <div
                className="min-w-0 max-w-[34ch] overflow-hidden font-sans text-sora-14 font-light leading-6 text-foreground"
                style={contentHeightStyle(H.description)}
              >
                <p className="line-clamp-8 whitespace-pre-line">
                  {project.description.join("\n\n")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-sans text-sora-14 font-light text-accent">
                Role/Project Type
              </p>
              <div
                className="min-w-0 overflow-hidden font-sans text-sora-14 font-light leading-6 text-foreground"
                style={contentHeightStyle(H.role)}
              >
                <p className="truncate">{project.role}</p>
              </div>
            </div>
          </div>

          <div className="flex h-full min-h-0 min-w-0 items-center justify-center">
            <ImageFrame
              placement="projects"
              src={project.image}
              alt={project.imageAlt}
              className={PROJECT_IMAGE_LAYOUT.frameClassName}
            />
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-8 lg:h-full lg:justify-center lg:gap-10 xl:gap-12">
            {project.techStack.length > 0 ? (
              <div className="flex min-h-0 flex-col gap-3">
                <p className="font-sans text-sora-14 font-light text-accent">
                  Tech Stack
                </p>
                <div
                  className="min-w-0 overflow-hidden font-sans text-sora-14 font-light leading-6 text-foreground"
                  style={contentHeightStyle(H.techStack)}
                >
                  <p className="line-clamp-4 whitespace-pre-line">
                    {project.techStack.join("\n")}
                  </p>
                </div>
              </div>
            ) : null}

            {project.outcomes.length > 0 ? (
              <div className="flex min-h-0 flex-col gap-3">
                <p className="font-sans text-sora-14 font-light text-accent">
                  Outcomes
                </p>
                <div
                  className="min-w-0 overflow-hidden font-sans text-sora-14 font-light leading-6 text-foreground"
                  style={contentHeightStyle(H.outcomes)}
                >
                  <ul className="space-y-1">
                    {project.outcomes.map((item, index) => (
                      <li key={`outcome-${index}`} className="line-clamp-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {hasLinks ? (
              <div
                className="flex shrink-0 flex-col gap-3 pt-1"
                style={{
                  minHeight:
                    PROJECT_CARD_DESKTOP_LINK_ROW_MIN_HEIGHT_PX * 2 + 12,
                }}
              >
                <div
                  className="flex items-center overflow-hidden"
                  style={{
                    minHeight: PROJECT_CARD_DESKTOP_LINK_ROW_MIN_HEIGHT_PX,
                  }}
                >
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
                  ) : (
                    <LinkPlaceholder>
                      <span>View more</span>
                      <ExternalLinkIcon />
                    </LinkPlaceholder>
                  )}
                </div>
                <div
                  className="flex items-center overflow-hidden"
                  style={{
                    minHeight: PROJECT_CARD_DESKTOP_LINK_ROW_MIN_HEIGHT_PX,
                  }}
                >
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
                  ) : (
                    <LinkPlaceholder>GitHub</LinkPlaceholder>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
