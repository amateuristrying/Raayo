import type {
  AlertsData,
  CategoriesData,
  Category,
  EventCluster,
  EventsData,
  ExploreData,
  HomeData,
  TrendingMarket,
} from "@/types";

import alertsJson from "./alerts.json";
import categoriesJson from "./categories.json";
import categoriesPageJson from "./categoriesPage.json";
import eventsJson from "./events.json";
import eventsPageJson from "./eventsPage.json";
import exploreJson from "./explore.json";
import homeJson from "./home.json";
import marketsJson from "./markets.json";

/*
 * JSON imports widen string literals (e.g. "up" -> string), so the mock
 * payloads are asserted against the app types at this single boundary.
 */
export const homeData = homeJson as unknown as HomeData;
export const categories = categoriesJson as unknown as Category[];
export const eventClusters = eventsJson as unknown as EventCluster[];
export const trendingMarkets = marketsJson as unknown as TrendingMarket[];
export const alertsData = alertsJson as unknown as AlertsData;
export const exploreData = exploreJson as unknown as ExploreData;
export const eventsPageData = eventsPageJson as unknown as EventsData;
export const categoriesPageData = categoriesPageJson as unknown as CategoriesData;
