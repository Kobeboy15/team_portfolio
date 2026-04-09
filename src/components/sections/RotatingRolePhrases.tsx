"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import type { HeroData } from "../../types/hero";

const ROTATION_MS = 5000;

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

  const text =
    phrases.length === 1 || prefersReducedMotion
      ? phrases[0]
      : phrases[index % phrases.length];

  return (
    <h2 className={className}>
      <span aria-live="polite" aria-atomic="true">
        {text}
      </span>
    </h2>
  );
}
