import { useSyncExternalStore } from "react";

/*
 * Minimal observable store used by every client-side engine. Each store is a
 * stand-in for a future backend engine: when the real API exists, only the
 * mutation functions in each engine module change — components keep reading
 * through useStore().
 */

type Listener = () => void;
type Updater<T> = T | ((prev: T) => T);

export interface Store<T> {
  get: () => T;
  set: (updater: Updater<T>) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore<T>(initial: T, persistKey?: string): Store<T> {
  let state = initial;

  if (persistKey && typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(persistKey);
      if (raw !== null) state = JSON.parse(raw) as T;
    } catch {
      // Corrupted storage falls back to the seed state.
    }
  }

  const listeners = new Set<Listener>();

  return {
    get: () => state,
    set: (updater) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(state)
          : updater;
      if (Object.is(next, state)) return;
      state = next;
      if (persistKey && typeof localStorage !== "undefined") {
        try {
          localStorage.setItem(persistKey, JSON.stringify(state));
        } catch {
          // Storage may be full or blocked; in-memory state still works.
        }
      }
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** Subscribe a component to a store's full state. */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
