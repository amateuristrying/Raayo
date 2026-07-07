import { Plus } from "lucide-react";
import { EmojiTile } from "@/components/ui/EmojiTile";
import { OutcomeChip } from "@/components/ui/OutcomeChip";
import { TrendDelta } from "@/components/ui/TrendDelta";
import { exploreData } from "@/data";
import type {
  Collection,
  RailTrendingSearch,
  RecommendedEntity,
  ViewedMarket,
} from "@/types";
import { RailCard } from "./RailCard";

function TrendingSearchesCard({ items }: { items: RailTrendingSearch[] }) {
  return (
    <RailCard variant="title" title="Trending Searches" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5">
            <span className="w-4 text-center text-[13px] font-semibold text-slate-400">
              {item.rank}
            </span>
            <span className="flex-1 text-[13px] font-semibold text-slate-800">
              {item.name}
            </span>
            <TrendDelta delta={item.delta} className="text-xs" />
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function RecommendedEntitiesCard({ items }: { items: RecommendedEntity[] }) {
  return (
    <RailCard variant="title" title="Recommended Entities" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {items.map((entity) => (
          <li key={entity.id} className="flex items-center gap-2.5">
            <EmojiTile emoji={entity.emoji} accent={entity.accent} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-slate-800">
                {entity.name}
              </span>
              <span className="block text-[11px] font-medium text-slate-400">
                {entity.markets} Markets
              </span>
            </span>
            <button
              type="button"
              className="flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-brand-700 transition-colors hover:border-brand-200 hover:bg-brand-50"
            >
              <Plus className="size-3" />
              Follow
            </button>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function PopularCollectionsCard({ items }: { items: Collection[] }) {
  return (
    <RailCard variant="title" title="Popular Collections" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {items.map((collection) => (
          <li key={collection.id} className="flex items-center gap-2.5">
            <EmojiTile
              emoji={collection.emoji}
              accent={collection.accent}
              shape="rounded"
            />
            <span className="flex-1 text-[13px] font-semibold text-slate-800">
              {collection.title}
            </span>
            <span className="text-[11px] font-medium whitespace-nowrap text-slate-400">
              {collection.markets} Markets
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function RecentlyViewedCard({ items }: { items: ViewedMarket[] }) {
  return (
    <RailCard variant="title" title="Recently Viewed" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {items.map((market) => (
          <li key={market.id} className="flex items-center gap-2.5">
            <span className="flex-1 text-[13px] leading-snug font-medium text-slate-700">
              {market.title}
            </span>
            <span className="text-[13px] font-bold text-slate-900">
              {market.probability}%
            </span>
            <OutcomeChip
              outcome={market.outcome}
              className="text-[10px] uppercase"
            />
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function SavedSearchesCard({ items }: { items: string[] }) {
  return (
    <RailCard variant="title" title="Saved Searches" actionLabel="View all">
      <div className="flex flex-wrap gap-2">
        {items.map((search) => (
          <button
            key={search}
            type="button"
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            {search}
          </button>
        ))}
      </div>
    </RailCard>
  );
}

/** Right-rail column for the Explore page. */
export function ExploreRail() {
  const { rail } = exploreData;
  return (
    <aside className="anim-rail flex w-80 shrink-0 flex-col gap-5">
      <TrendingSearchesCard items={rail.trendingSearches} />
      <RecommendedEntitiesCard items={rail.recommendedEntities} />
      <PopularCollectionsCard items={rail.collections} />
      <RecentlyViewedCard items={rail.recentlyViewed} />
      <SavedSearchesCard items={rail.savedSearches} />
    </aside>
  );
}
