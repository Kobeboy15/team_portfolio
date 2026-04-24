"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MilestoneConfig = {
  blocking?: boolean;
  targetCount?: number;
  weight?: number;
};

type MilestoneState = {
  blocking: boolean;
  targetCount: number;
  weight: number;
  readyKeys: Set<string>;
};

type HomepageReadinessContextValue = {
  dismiss: () => void;
  isBlocking: boolean;
  isReady: boolean;
  progress: number;
  registerMilestone: (id: string, config?: MilestoneConfig) => void;
  markReady: (id: string, key?: string) => void;
};

const DEFAULT_MILESTONES: Record<string, MilestoneConfig> = {
  "dom-mounted": { blocking: true, weight: 1 },
  "about-mounted": { blocking: true, weight: 3 },
  "hero-image-ready": { blocking: true, weight: 4 },
  "layout-mode-ready": { blocking: true, weight: 1 },
  "scroll-reveal-ready": { blocking: true, targetCount: 3, weight: 3 },
};

const HomepageReadinessContext =
  createContext<HomepageReadinessContextValue | null>(null);

function buildInitialMilestones() {
  return Object.fromEntries(
    Object.entries(DEFAULT_MILESTONES).map(([id, config]) => [
      id,
      {
        blocking: config.blocking ?? true,
        targetCount: config.targetCount ?? 1,
        weight: config.weight ?? 1,
        readyKeys:
          id === "dom-mounted"
            ? new Set<string>(["default"])
            : new Set<string>(),
      },
    ]),
  ) as Record<string, MilestoneState>;
}

function createMilestoneState(config: MilestoneConfig = {}, readyKeys?: Set<string>) {
  return {
    blocking: config.blocking ?? true,
    targetCount: config.targetCount ?? 1,
    weight: config.weight ?? 1,
    readyKeys: readyKeys ?? new Set<string>(),
  };
}

function isMilestoneComplete(milestone: MilestoneState) {
  return milestone.readyKeys.size >= milestone.targetCount;
}

function toProgressValue(milestones: Record<string, MilestoneState>) {
  const blockingMilestones = Object.values(milestones).filter(
    (milestone) => milestone.blocking,
  );
  const totalWeight = blockingMilestones.reduce(
    (sum, milestone) => sum + milestone.weight,
    0,
  );

  if (totalWeight <= 0) return 1;

  const completedWeight = blockingMilestones.reduce((sum, milestone) => {
    const ratio = Math.min(milestone.readyKeys.size / milestone.targetCount, 1);
    return sum + (ratio * milestone.weight);
  }, 0);

  return Math.max(0, Math.min(completedWeight / totalWeight, 1));
}

function areBlockingMilestonesReady(milestones: Record<string, MilestoneState>) {
  return Object.values(milestones)
    .filter((milestone) => milestone.blocking)
    .every(isMilestoneComplete);
}

export function HomepageReadinessProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [milestones, setMilestones] = useState(buildInitialMilestones);
  const [isBlocking, setIsBlocking] = useState(true);

  const registerMilestone = useCallback(
    (id: string, config: MilestoneConfig = {}) => {
      setMilestones((current) => {
        const nextMilestone = createMilestoneState(
          {
            blocking: config.blocking ?? current[id]?.blocking,
            targetCount: config.targetCount ?? current[id]?.targetCount,
            weight: config.weight ?? current[id]?.weight,
          },
          current[id]?.readyKeys ? new Set(current[id].readyKeys) : undefined,
        );

        if (current[id]) {
          const milestone = current[id];

          if (
            milestone.blocking === nextMilestone.blocking &&
            milestone.targetCount === nextMilestone.targetCount &&
            milestone.weight === nextMilestone.weight
          ) {
            return current;
          }
        }

        return {
          ...current,
          [id]: nextMilestone,
        };
      });
    },
    [],
  );

  const markReady = useCallback((id: string, key = "default") => {
    setMilestones((current) => {
      const milestone = current[id];

      if (!milestone) {
        return {
          ...current,
          [id]: createMilestoneState({}, new Set<string>([key])),
        };
      }

      if (milestone.readyKeys.has(key)) {
        return current;
      }

      const nextKeys = new Set(milestone.readyKeys);
      nextKeys.add(key);

      return {
        ...current,
        [id]: {
          ...milestone,
          readyKeys: nextKeys,
        },
      };
    });
  }, []);

  const progress = useMemo(() => toProgressValue(milestones), [milestones]);
  const isReady = useMemo(
    () => areBlockingMilestonesReady(milestones),
    [milestones],
  );

  const dismiss = useCallback(() => {
    setIsBlocking(false);
  }, []);

  const value = useMemo(
    () => ({
      dismiss,
      isBlocking,
      isReady,
      progress,
      registerMilestone,
      markReady,
    }),
    [dismiss, isBlocking, isReady, progress, registerMilestone, markReady],
  );

  return (
    <HomepageReadinessContext.Provider value={value}>
      {children}
    </HomepageReadinessContext.Provider>
  );
}

export function useHomepageReadiness() {
  const context = useContext(HomepageReadinessContext);

  if (!context) {
    throw new Error(
      "useHomepageReadiness must be used within HomepageReadinessProvider.",
    );
  }

  return context;
}

export function useOptionalHomepageReadiness() {
  return useContext(HomepageReadinessContext);
}
