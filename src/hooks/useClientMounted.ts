import { useSyncExternalStore } from "react";

let clientMounted = false;
let mountScheduled = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((cb) => cb());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (typeof window !== "undefined" && !mountScheduled) {
    mountScheduled = true;
    setTimeout(() => {
      clientMounted = true;
      emit();
    }, 0);
  }
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return clientMounted;
}

function getServerSnapshot() {
  return false;
}

/** True after the first client commit; false on server and on first client paint (matches next-themes hydration guards). */
export function useClientMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
