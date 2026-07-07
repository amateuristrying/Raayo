export type TrendDirection = "up" | "down";

export interface Delta {
  direction: TrendDirection;
  value: number;
}

/** Named gradient accent used for covers, tiles and avatars. */
export type Accent =
  | "emerald"
  | "violet"
  | "rose"
  | "amber"
  | "sky"
  | "indigo"
  | "orange"
  | "slate";

/* ---------------------------------- User --------------------------------- */

export interface User {
  name: string;
  handle: string;
  verified: boolean;
  rank: string;
  accuracy: string;
  winStreak: number;
  pointsBalance: number;
  notifications: number;
}

/* --------------------------------- Ticker -------------------------------- */

export type TickerDot = "green" | "indigo" | "purple" | "blue";

export interface TickerItem {
  id: string;
  text: string;
  dot: TickerDot;
  delta?: Delta;
}

/* ---------------------------------- Hero ---------------------------------- */

export interface HeroPoint {
  hour: number;
  value: number;
}

export interface HeroMarket {
  eyebrow: string;
  headline: string;
  category: string;
  closesIn: string;
  probability: number;
  outcome: string;
  delta: Delta;
  deltaWindow: string;
  traders: number;
  volume: string;
  liquidity: string;
  whyItMoved: string;
  series: HeroPoint[];
}

/* -------------------------------- AI Pulse -------------------------------- */

export interface AiPulse {
  updated: string;
  points: string[];
}

/* ------------------------------- Categories ------------------------------- */

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  count?: number;
}

/* ----------------------------- Event clusters ----------------------------- */

export type ClusterTheme = "cricket" | "elections" | "bollywood";

export interface ClusterMarket {
  title: string;
  probability: number;
  delta: Delta;
}

export interface EventCluster {
  id: string;
  title: string;
  emoji: string;
  theme: ClusterTheme;
  activeMarkets: number;
  markets: ClusterMarket[];
}

/* ----------------------------- Trending markets ---------------------------- */

export type MarketStatusTone = "breaking" | "rising" | "ending";
export type MarketIcon = "chart" | "flame" | "hourglass";

export interface TrendingMarket {
  id: string;
  status: { label: string; tone: MarketStatusTone };
  icon: MarketIcon;
  title: string;
  category: string;
  closes: string;
  probability: number;
  delta: Delta;
  sparkline: number[];
  volume: string;
  traders: string;
}

/* ------------------------------- Right rail -------------------------------- */

export type AlertTone = "up" | "down" | "spike";

export interface LiveAlert {
  id: string;
  tone: AlertTone;
  /** Market name rendered in quotes and bold. */
  quoted?: string;
  text: string;
  /** Trailing fragment colored by tone, e.g. "8%". */
  emphasis?: string;
  time: string;
}

export interface EndingSoonMarket {
  id: string;
  title: string;
  timeLeft: string;
}

export interface TopMover {
  id: string;
  rank: number;
  emoji: string;
  title: string;
  delta: Delta;
}

export interface ResolvedMarket {
  id: string;
  emoji: string;
  title: string;
  outcome: "Yes" | "No";
  probability: number;
}

/* ------------------------------- Page metrics ------------------------------ */

export type MetricIcon =
  | "activity"
  | "calendar"
  | "target"
  | "compass"
  | "play"
  | "flame"
  | "grid"
  | "bars"
  | "trending";

/** Metric shown in the hero strip of Explore/Events pages. */
export interface PageMetric {
  id: string;
  icon: MetricIcon;
  value: string;
  label: string;
}

/* --------------------------------- Explore --------------------------------- */

export interface TrendingSearch {
  id: string;
  emoji: string;
  label: string;
}

export interface AiPrompt {
  id: string;
  text: string;
}

export interface ExploreEntity {
  id: string;
  name: string;
  type: string;
  emoji: string;
  accent: Accent;
  markets: number;
  traders: string;
}

export interface ExploreCategory {
  id: string;
  name: string;
  emoji: string;
  accent: Accent;
  markets: number;
  traders: string;
  topics: string[];
}

export interface FeaturedEvent {
  id: string;
  title: string;
  emoji: string;
  accent: Accent;
  date: string;
  topPrediction: { title: string; probability: number };
  markets: number;
  traders: string;
}

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  emoji: string;
  accent: Accent;
}

export type ProbabilityTone = "red" | "amber" | "slate" | "sky" | "emerald";

export interface ProbabilityBucket {
  id: string;
  range: string;
  label: string;
  markets: number;
  tone: ProbabilityTone;
  spark: number[];
}

export interface ResolvedCard {
  id: string;
  title: string;
  outcome: "Yes" | "No";
  probability: number;
  resolvedAgo: string;
  markets: number;
}

export interface RailTrendingSearch {
  id: string;
  rank: number;
  name: string;
  delta: Delta;
}

export interface RecommendedEntity {
  id: string;
  name: string;
  emoji: string;
  accent: Accent;
  markets: number;
}

export interface Collection {
  id: string;
  title: string;
  emoji: string;
  accent: Accent;
  markets: number;
}

export interface ViewedMarket {
  id: string;
  title: string;
  probability: number;
  outcome: "Yes" | "No";
}

/* --------------------------------- Events ---------------------------------- */

export interface TimelineDay {
  label: string;
  num: string;
}

export type TimelineKind = "circle" | "number" | "days" | "icon";

export interface TimelineSection {
  id: string;
  label: string;
  count: string;
  kind: TimelineKind;
  /** Big value for "circle"/"number" kinds, e.g. "24", "2–8", "NOV+". */
  value?: string;
  /** Small caption under the circle, e.g. "OCT". */
  sub?: string;
  days?: TimelineDay[];
  /** Decorative event-density dots, colored by accent. */
  dots: Accent[];
  /** Relative width of the section in the timeline row. */
  grow?: number;
}

export interface EventStatusFilter {
  id: string;
  label: string;
  dot?: Accent;
}

export interface EventCategoryFilter {
  id: string;
  label: string;
  emoji?: string;
  /** Renders a chevron for the overflow pill. */
  more?: boolean;
}

export interface RelatedEntity {
  name: string;
  emoji: string;
  accent: Accent;
}

export interface FeaturedEventData {
  id: string;
  title: string;
  emoji: string;
  accent: Accent;
  badge: { label: string; live?: boolean };
  delta: Delta;
  type: { emoji: string; label: string };
  meta: string;
  markets: number;
  traders: string;
  mostPopular: {
    question: string;
    probability: number;
    delta: Delta;
    tone: ProbabilityTone;
  };
  entities: RelatedEntity[];
  moreEntities: number;
}

export interface LiveEventData {
  id: string;
  title: string;
  emoji: string;
  accent: Accent;
  traders: string;
}

export interface CountdownTile {
  emoji: string;
  accent: Accent;
}

export interface CountdownEventData {
  id: string;
  title: string;
  tiles: CountdownTile[];
  countdown: string;
  time: string;
  location: string;
  traders: string;
}

export interface MonthCardData {
  id: string;
  name: string;
  events: number;
  icons: string[];
  current?: boolean;
}

export interface HeatmapData {
  days: string[];
  /** Rows of intensity values 0 (none) – 4 (busiest). */
  rows: number[][];
}

export interface CalendarEntry {
  id: string;
  time: string;
  emoji: string;
  accent: Accent;
  title: string;
  location: string;
  status: "live" | "starting";
}

export interface RecentEvent {
  id: string;
  emoji: string;
  accent: Accent;
  title: string;
  meta: string;
  traders: string;
}

export interface FollowedEvent {
  id: string;
  emoji: string;
  accent: Accent;
  title: string;
  markets: number;
  followers: string;
}

/* -------------------------------- Categories -------------------------------- */

export interface FeaturedCategory {
  id: string;
  name: string;
  emoji: string;
  accent: Accent;
  description: string;
  markets: number;
  events: number;
  predictions: string;
  trending: string[];
}

export interface CategoryGridItem {
  id: string;
  name: string;
  emoji: string;
  accent: Accent;
  description: string;
  markets: number;
  events: number;
  predictions: number;
  /** Predictions-today metric shown next to the flame. */
  today: string;
}

export interface CategoryInsight {
  id: string;
  category: string;
  metric: string;
  value: string;
  label: string;
  delta: Delta;
}

export interface CategoryComparisonRow {
  id: string;
  emoji: string;
  name: string;
  markets: number;
  events: number;
  predictions30d: string;
  accuracy: string;
  spark: number[];
  delta: Delta;
}

export interface CategoryHeatmapRow {
  label: string;
  cells: number[];
}

export interface CategoryHeatmapData {
  days: string[];
  rows: CategoryHeatmapRow[];
}

export interface TrendingTopic {
  id: string;
  rank: number;
  emoji: string;
  name: string;
  status: "live" | "starting";
}

export interface UpcomingEvent {
  id: string;
  emoji: string;
  accent: Accent;
  title: string;
  starts: string;
}

export interface TopEntity {
  id: string;
  emoji: string;
  accent: Accent;
  name: string;
  type: string;
}

export interface ResolvedTopic {
  id: string;
  title: string;
  outcome: "Yes" | "No";
  probability: number;
}

export interface CategoriesData {
  metrics: PageMetric[];
  featured: FeaturedCategory[];
  all: CategoryGridItem[];
  intelligence: CategoryInsight[];
  comparison: CategoryComparisonRow[];
  heatmap: CategoryHeatmapData;
  rail: {
    trendingTopics: TrendingTopic[];
    upcomingEvents: UpcomingEvent[];
    topEntities: TopEntity[];
    recentlyResolved: ResolvedTopic[];
    aiSummary: { updated: string; text: string };
  };
}

export interface EventsData {
  metrics: PageMetric[];
  timeline: TimelineSection[];
  statusFilters: EventStatusFilter[];
  categoryFilters: EventCategoryFilter[];
  featured: FeaturedEventData[];
  liveNow: LiveEventData[];
  startingSoon: CountdownEventData[];
  months: MonthCardData[];
  heatmap: HeatmapData;
  rail: {
    calendar: CalendarEntry[];
    recentlyAdded: RecentEvent[];
    mostFollowed: FollowedEvent[];
    aiPrompts: string[];
  };
}

/* ------------------------------ Data payloads ------------------------------ */

export interface HomeData {
  user: User;
  ticker: TickerItem[];
  hero: HeroMarket;
  aiPulse: AiPulse;
}

export interface AlertsData {
  liveAlerts: LiveAlert[];
  endingSoon: EndingSoonMarket[];
  topMovers: TopMover[];
  recentlyResolved: ResolvedMarket[];
}

export interface ExploreData {
  metrics: PageMetric[];
  trendingSearches: TrendingSearch[];
  aiPrompts: AiPrompt[];
  entities: ExploreEntity[];
  categories: ExploreCategory[];
  featuredEvents: FeaturedEvent[];
  graph: GraphNode[];
  probabilityBuckets: ProbabilityBucket[];
  recentlyResolved: ResolvedCard[];
  rail: {
    trendingSearches: RailTrendingSearch[];
    recommendedEntities: RecommendedEntity[];
    collections: Collection[];
    recentlyViewed: ViewedMarket[];
    savedSearches: string[];
  };
}
