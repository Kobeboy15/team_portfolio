"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const scrollRevealEase = [0.22, 1, 0.36, 1] as const;

const scrollRevealDuration = 1.42;
const scrollRevealDurationReduced = 0.14;

export type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds; added to transition (skipped when reduced motion is preferred). */
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  const transition = {
    duration: reduceMotion ? scrollRevealDurationReduced : scrollRevealDuration,
    ease: scrollRevealEase,
    delay: reduceMotion ? 0 : delay,
  };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
