import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { trendingMarkets } from "@/data";
import { marketCategoryId, matchesCategory } from "./categoryFilter";
import { TrendingMarketRow } from "./TrendingMarketRow";

interface TrendingMarketsSectionProps {
  /** Category pill id; "all"/"following"/undefined shows everything. */
  categoryFilter?: string;
}

/** "Trending Markets" table-style list. */
export function TrendingMarketsSection({
  categoryFilter,
}: TrendingMarketsSectionProps) {
  const visible = trendingMarkets.filter((market) =>
    matchesCategory(categoryFilter, marketCategoryId(market.category)),
  );

  return (
    <section className="anim-rise">
      <SectionHeader
        title="Trending Markets"
        actionLabel="View all"
        className="mb-3"
      />
      <div className="flex flex-col gap-3">
        {visible.map((market) => (
          <TrendingMarketRow key={market.id} market={market} />
        ))}
        {visible.length === 0 && (
          <Card className="p-6 text-center text-sm text-slate-400">
            No trending markets in this category yet.
          </Card>
        )}
      </div>
    </section>
  );
}
