import { createStore } from "./store";

/* Bookmark engine (client-side stand-in). Stores market ids. */

export const bookmarksStore = createStore<string[]>([], "raayo:bookmarks");

export function isBookmarked(bookmarks: string[], marketId: string): boolean {
  return bookmarks.includes(marketId);
}

/** Returns the new bookmarked state for the market. */
export function toggleBookmark(marketId: string): boolean {
  let added = false;
  bookmarksStore.set((prev) => {
    if (prev.includes(marketId)) {
      return prev.filter((id) => id !== marketId);
    }
    added = true;
    return [...prev, marketId];
  });
  return added;
}
