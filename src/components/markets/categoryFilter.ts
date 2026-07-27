import type { ClusterTheme } from "@/types";

/* Maps between category pill ids and the category labels used by content. */

export const clusterThemeCategory: Record<ClusterTheme, string> = {
  cricket: "cricket",
  elections: "politics",
  bollywood: "bollywood",
};

const marketCategoryIds: Record<string, string> = {
  Finance: "finance",
  Bollywood: "bollywood",
  Cricket: "cricket",
  Politics: "politics",
  Tech: "tech",
  IPL: "ipl",
};

export function marketCategoryId(category: string): string {
  return marketCategoryIds[category] ?? category.toLowerCase();
}

/** "all" and "following" show everything. */
export function matchesCategory(filter: string | undefined, id: string): boolean {
  return !filter || filter === "all" || filter === "following" || filter === id;
}
