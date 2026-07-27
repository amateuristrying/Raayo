import { createStore } from "./store";

/* Follow engine (client-side stand-in). Stores entity/event ids. */

export const followsStore = createStore<string[]>([], "raayo:follows");

export function isFollowing(follows: string[], id: string): boolean {
  return follows.includes(id);
}

export function toggleFollow(id: string): void {
  followsStore.set((prev) =>
    prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
  );
}
