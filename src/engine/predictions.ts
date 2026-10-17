import { marketsStore, nudgeMarket } from "./markets";
import { pushNotification } from "./notifications";
import { createStore } from "./store";
import { spendPoints } from "./wallet";

/*
 * Prediction engine (client-side stand-in). Positions are priced against the
 * live probability at entry; a binary share pays 1 point if correct, so
 * potential payout = stake / entry price.
 */

export type PredictionSide = "yes" | "no";

export interface PredictionTarget {
  id: string;
  title: string;
  category?: string;
  probability: number;
}

export interface Position {
  id: string;
  marketId: string;
  title: string;
  side: PredictionSide;
  stake: number;
  entryProbability: number;
  at: number;
}

export const predictionsStore = createStore<Position[]>([], "raayo:predictions");

export const MIN_STAKE = 10;

/** Price per share (in points) for a side at a given probability. */
export function sharePrice(probability: number, side: PredictionSide): number {
  const yes = Math.min(0.99, Math.max(0.01, probability / 100));
  return side === "yes" ? yes : 1 - yes;
}

/** Points paid out if the position resolves in the user's favour. */
export function potentialPayout(
  stake: number,
  probability: number,
  side: PredictionSide,
): number {
  return Math.round(stake / sharePrice(probability, side));
}

export function placePrediction(
  target: PredictionTarget,
  side: PredictionSide,
  stake: number,
): boolean {
  const live = marketsStore.get()[target.id];
  const probability = live?.probability ?? target.probability;

  if (!live || !Number.isFinite(stake) || !Number.isInteger(stake) || stake < MIN_STAKE) return false;
  if (!spendPoints(stake, `Prediction placed · ${target.title}`)) return false;

  predictionsStore.set((prev) => [
    {
      id: crypto.randomUUID(),
      marketId: target.id,
      title: target.title,
      side,
      stake,
      entryProbability: probability,
      at: Date.now(),
    },
    ...prev,
  ]);

  nudgeMarket(target.id, side === "yes" ? 1 : -1);
  pushNotification(
    "info",
    `Prediction placed: ${side.toUpperCase()} on “${target.title}” for ${stake} pts`,
  );
  return true;
}
