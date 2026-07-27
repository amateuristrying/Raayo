import {
  eventClusters,
  eventsPageData,
  exploreData,
  homeData,
  trendingMarkets,
} from "@/data";
import type { Delta } from "@/types";
import { createStore } from "./store";

/*
 * Live market registry — the client-side stand-in for the Market + Pricing
 * engines. Seeds every market visible in the UI with its design-time state,
 * then lets the simulation and user trades move probabilities.
 */

export const HERO_MARKET_ID = "hero-india-vs-australia";

export interface LiveMarket {
  id: string;
  title: string;
  category?: string;
  /** Design-time values used as the baseline for displayed deltas. */
  baseProbability: number;
  baseDelta: number;
  probability: number;
  spark: number[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function signedDelta(delta: Delta): number {
  return delta.direction === "up" ? delta.value : -delta.value;
}

export function clusterMarketId(clusterId: string, title: string): string {
  return `${clusterId}--${slugify(title)}`;
}

function seedMarkets(): Record<string, LiveMarket> {
  const map: Record<string, LiveMarket> = {};
  const add = (market: LiveMarket) => {
    map[market.id] = market;
  };

  const { hero } = homeData;
  add({
    id: HERO_MARKET_ID,
    title: hero.headline,
    category: hero.category,
    baseProbability: hero.probability,
    baseDelta: signedDelta(hero.delta),
    probability: hero.probability,
    spark: hero.series.map((point) => point.value),
  });

  for (const market of trendingMarkets) {
    add({
      id: market.id,
      title: market.title,
      category: market.category,
      baseProbability: market.probability,
      baseDelta: signedDelta(market.delta),
      probability: market.probability,
      spark: [...market.sparkline],
    });
  }

  for (const cluster of eventClusters) {
    for (const market of cluster.markets) {
      add({
        id: clusterMarketId(cluster.id, market.title),
        title: market.title,
        baseProbability: market.probability,
        baseDelta: signedDelta(market.delta),
        probability: market.probability,
        spark: [],
      });
    }
  }

  for (const event of eventsPageData.featured) {
    add({
      id: `${event.id}--top`,
      title: event.mostPopular.question,
      baseProbability: event.mostPopular.probability,
      baseDelta: signedDelta(event.mostPopular.delta),
      probability: event.mostPopular.probability,
      spark: [],
    });
  }

  for (const event of exploreData.featuredEvents) {
    add({
      id: `${event.id}--explore-top`,
      title: event.topPrediction.title,
      baseProbability: event.topPrediction.probability,
      baseDelta: 0,
      probability: event.topPrediction.probability,
      spark: [],
    });
  }

  return map;
}

/** Session-only: probabilities reset to the seeded state on reload. */
export const marketsStore = createStore<Record<string, LiveMarket>>(seedMarkets());

const clampProbability = (value: number) => Math.min(97, Math.max(3, value));

function withProbability(market: LiveMarket, probability: number): LiveMarket {
  const next = clampProbability(probability);
  return {
    ...market,
    probability: next,
    spark: market.spark.length > 0 ? [...market.spark.slice(1), next] : market.spark,
  };
}

/** Displayed 24h delta = design baseline + live drift since page load. */
export function liveDelta(market: LiveMarket): Delta {
  const signed = market.baseDelta + (market.probability - market.baseProbability);
  return { direction: signed < 0 ? "down" : "up", value: Math.abs(signed) };
}

/** Price impact of a user prediction: nudges the market toward the side taken. */
export function nudgeMarket(id: string, direction: 1 | -1): void {
  marketsStore.set((prev) => {
    const market = prev[id];
    if (!market) return prev;
    return { ...prev, [id]: withProbability(market, market.probability + direction) };
  });
}

/**
 * Internal liveness simulation (client-side counterpart of the future AI
 * Simulation Engine): a small random walk so probabilities, deltas and
 * sparklines keep moving while the app is open.
 */
export function startMarketSimulation(intervalMs = 8000): () => void {
  const timer = setInterval(() => {
    marketsStore.set((prev) => {
      const next: Record<string, LiveMarket> = {};
      for (const market of Object.values(prev)) {
        const step = Math.round((Math.random() - 0.5) * 4);
        next[market.id] =
          step === 0 ? market : withProbability(market, market.probability + step);
      }
      return next;
    });
  }, intervalMs);
  return () => clearInterval(timer);
}
