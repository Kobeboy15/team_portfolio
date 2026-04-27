"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

import { ImageFrame } from "../ui/ImageFrame";

import { cn } from "./projectCardShared";

export const projectCardDesktopTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const,
};

export type RollingTextSlotProps = {
  projectId: string;
  slotId: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function RollingTextSlot({
  projectId,
  slotId,
  className,
  style,
  children,
}: RollingTextSlotProps) {
  const reduceMotion = useReducedMotion();
  const key = `${projectId}-${slotId}`;

  const transition = {
    duration: reduceMotion ? 0.14 : projectCardDesktopTransition.duration,
    ease: projectCardDesktopTransition.ease,
  };

  return (
    <div className={cn("overflow-hidden", className)} style={style}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { y: "25%", opacity: 0 }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { y: "-25%", opacity: 0 }
          }
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export type ProjectImageTransitionProps = {
  projectId: string;
  src: string;
  alt: string;
  className: string;
};

export function ProjectImageTransition({
  projectId,
  src,
  alt,
  className,
}: ProjectImageTransitionProps) {
  const reduceMotion = useReducedMotion();

  const transition = {
    duration: reduceMotion ? 0.16 : 0.45,
    ease: projectCardDesktopTransition.ease,
  };

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={projectId}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 0.52,
                  x: "18%",
                  y: "18%",
                  transformOrigin: "100% 100%",
                }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                  transformOrigin: "50% 50%",
                }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 0.52,
                  x: "-18%",
                  y: "-18%",
                  transformOrigin: "0% 0%",
                }
          }
          transition={transition}
          className="h-full w-full"
        >
          <ImageFrame placement="projects" src={src} alt={alt} className="w-full" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
