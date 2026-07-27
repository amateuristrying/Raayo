import type { PredictionTarget } from "./predictions";
import { createStore } from "./store";

/* Global UI state: which modal is open, and for what. */

interface UiState {
  predictionTarget: PredictionTarget | null;
  createMarketOpen: boolean;
}

export const uiStore = createStore<UiState>({
  predictionTarget: null,
  createMarketOpen: false,
});

export function openPrediction(target: PredictionTarget): void {
  uiStore.set((prev) => ({ ...prev, predictionTarget: target }));
}

export function closePrediction(): void {
  uiStore.set((prev) => ({ ...prev, predictionTarget: null }));
}

export function openCreateMarket(): void {
  uiStore.set((prev) => ({ ...prev, createMarketOpen: true }));
}

export function closeCreateMarket(): void {
  uiStore.set((prev) => ({ ...prev, createMarketOpen: false }));
}
