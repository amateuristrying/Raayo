import {
  categoriesPageData,
  eventClusters,
  eventsPageData,
  exploreData,
  trendingMarkets,
} from "@/data";
import type { MarketIcon } from "@/types";
import { clusterMarketId, marketsStore } from "./markets";

/*
 * Search engine (client-side stand-in). Builds an in-memory index over every
 * market, event, entity and category in the mock dataset.
 */

export type SearchResultType = "Market" | "Event" | "Entity" | "Category";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  emoji: string;
  /** Present on market results so the UI can open the prediction modal. */
  probability?: number;
}

const marketEmoji: Record<MarketIcon, string> = {
  chart: "📈",
  flame: "🔥",
  hourglass: "⏳",
};

function buildIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  for (const market of trendingMarkets) {
    index.push({
      id: market.id,
      type: "Market",
      title: market.title,
      subtitle: `${market.category} · ${market.closes}`,
      emoji: marketEmoji[market.icon],
      probability: market.probability,
    });
  }

  for (const cluster of eventClusters) {
    index.push({
      id: cluster.id,
      type: "Event",
      title: cluster.title,
      subtitle: `${cluster.activeMarkets} active markets`,
      emoji: cluster.emoji,
    });
    for (const market of cluster.markets) {
      index.push({
        id: clusterMarketId(cluster.id, market.title),
        type: "Market",
        title: market.title,
        subtitle: cluster.title,
        emoji: cluster.emoji,
        probability: market.probability,
      });
    }
  }

  for (const event of eventsPageData.featured) {
    index.push({
      id: `event-${event.id}`,
      type: "Event",
      title: event.title,
      subtitle: event.meta,
      emoji: event.emoji,
    });
  }

  for (const entity of exploreData.entities) {
    index.push({
      id: `entity-${entity.id}`,
      type: "Entity",
      title: entity.name,
      subtitle: `${entity.type} · ${entity.markets} markets`,
      emoji: entity.emoji,
    });
  }

  for (const category of categoriesPageData.all) {
    index.push({
      id: `category-${category.id}`,
      type: "Category",
      title: category.name,
      subtitle: category.description,
      emoji: category.emoji,
    });
  }

  for (const event of eventsPageData.rail.mostFollowed) {
    index.push({
      id: `event-${event.id}`,
      type: "Event",
      title: event.title,
      subtitle: `${event.markets} markets`,
      emoji: event.emoji,
    });
  }
  for (const entity of exploreData.rail.recommendedEntities) {
    index.push({
      id: `entity-${entity.id}`,
      type: "Entity",
      title: entity.name,
      subtitle: `${entity.markets} markets`,
      emoji: entity.emoji,
    });
  }
  return index.filter(
    (item, position) =>
      index.findIndex(
        (other) => other.id === item.id && other.type === item.type,
      ) === position,
  );
}

const searchIndex = buildIndex();

export function browseAll(): SearchResult[] {
  const nonMarkets = searchIndex.filter((item) => item.type !== "Market");
  return [
    ...Object.values(marketsStore.get()).map((market): SearchResult => ({
      id: market.id,
      type: "Market",
      title: market.title,
      subtitle: market.category ?? "Prediction market",
      emoji: "",
      probability: market.probability,
    })),
    ...nonMarkets,
  ];
}

export function followKey(result: SearchResult): string {
  return result.id.replace(/^(event|entity|category)-/, "");
}

function score(result: SearchResult, query: string): number {
  const title = result.title.toLowerCase();
  if (title.startsWith(query)) return 3;
  if (title.includes(query)) return 2;
  if (result.subtitle?.toLowerCase().includes(query)) return 1;
  return 0;
}

export function searchAll(rawQuery: string, limit = 8): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];
  return browseAll()
    .map((result) => ({ result, rank: score(result, query) }))
    .filter((entry) => entry.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map((entry) => entry.result);
}
