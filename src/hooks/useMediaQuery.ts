import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia(query);

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", onStoreChange);

    return () => {
      mediaQuery.removeEventListener("change", onStoreChange);
    };
  }

  mediaQuery.addListener(onStoreChange);

  return () => {
    mediaQuery.removeListener(onStoreChange);
  };
}

function getMediaQuerySnapshot(query: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string, serverSnapshot = false) {
  return useSyncExternalStore(
    (onStoreChange) => subscribeToMediaQuery(query, onStoreChange),
    () => getMediaQuerySnapshot(query),
    () => serverSnapshot,
  );
}
