import { pushNotification } from "./notifications";
import { createStore } from "./store";

/*
 * User-submitted market drafts (client-side stand-in for the Market Engine's
 * creation + review queue). Every market names its resolution source up
 * front — the contract the future Resolution Engine will verify against.
 */

export interface MarketDraft {
  id: string;
  question: string;
  category: string;
  event: string;
  closesOn: string;
  resolutionSource: string;
  status: "in-review";
  at: number;
}

export const userMarketsStore = createStore<MarketDraft[]>([], "raayo:my-markets");

export function submitMarketDraft(
  draft: Omit<MarketDraft, "id" | "status" | "at">,
): void {
  userMarketsStore.set((prev) => [
    { ...draft, id: crypto.randomUUID(), status: "in-review", at: Date.now() },
    ...prev,
  ]);
  pushNotification("info", `Market submitted for review: “${draft.question}”`);
}
