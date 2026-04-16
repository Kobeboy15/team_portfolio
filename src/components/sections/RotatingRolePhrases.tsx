"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

import type { HeroData } from "../../types/hero";

/** Time between phrase changes; keep well above {@link ROLE_PHRASE_TRANSITION} duration for readable dwell. */
const ROTATION_MS = 5000;

/** Same cubic-bezier as `projectCardDesktopTransition` in projectCardDesktopMotion.tsx (duplicated here to avoid extra module coupling). */
const ROLE_PHRASE_EASE = [0.22, 1, 0.36, 1] as const;

const ROLE_PHRASE_TRANSITION = {
  duration: 0.52,
  ease: ROLE_PHRASE_EASE,
} as const;

function subscribePrefersReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getPrefersReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getPrefersReducedMotionServerSnapshot() {
  return false;
}

type RotatingRolePhrasesProps = {
  phrases: HeroData["rolePhrases"];
  className?: string;
};

export function RotatingRolePhrases({
  phrases,
  className,
}: RotatingRolePhrasesProps) {
  const [index, setIndex] = useState(0);
  const [announcedPhrase, setAnnouncedPhrase] = useState(phrases[0] ?? "");
  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot,
  );

  useEffect(() => {
    if (phrases.length <= 1 || prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [phrases, prefersReducedMotion]);

  if (phrases.length === 0) return null;

  const useMotion = phrases.length > 1 && !prefersReducedMotion;

  if (!useMotion) {
    const text = phrases[0];
    return (
      <h2 className={className}>
        <span aria-live="polite" aria-atomic="true">
          {text}
        </span>
      </h2>
    );
  }

  const currentPhrase = phrases[index % phrases.length];

  return (
    <h2 className={className}>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcedPhrase}
      </span>
      <span
        aria-hidden
        className="relative mt-0 block w-full overflow-hidden pt-1.5 pb-2 min-h-[calc(1lh+0.625rem)] sm:py-1.5 sm:min-h-[calc(1lh+0.5rem)] 2xl:py-[0.08em] 2xl:min-h-[calc(1lh+0.12em)]"
      >
        <AnimatePresence
          initial={false}
          mode="sync"
          onExitComplete={() => {
            const safePhrase =
              phrases[index] ?? phrases[phrases.length - 1] ?? "";
            setAnnouncedPhrase(safePhrase);
          }}
        >
          <motion.span
            key={index}
            className="absolute inset-x-0 top-2 block w-full will-change-transform sm:top-2.5 2xl:top-[0.08em]"
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            transition={ROLE_PHRASE_TRANSITION}
          >
            {currentPhrase}
          </motion.span>
        </AnimatePresence>
      </span>
    </h2>
  );
}
