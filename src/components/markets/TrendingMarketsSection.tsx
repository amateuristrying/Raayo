import { SectionHeader } from "@/components/ui/SectionHeader";
import { trendingMarkets } from "@/data";
import { TrendingMarketRow } from "./TrendingMarketRow";

/** "Trending Markets" table-style list. */
export function TrendingMarketsSection() {
  return (
    <section className="anim-rise">
      <SectionHeader
        title="Trending Markets"
        actionLabel="View all"
        className="mb-3"
      />
      <div className="flex flex-col gap-3">
        {trendingMarkets.map((market) => (
          <TrendingMarketRow key={market.id} market={market} />
        ))}
      </div>
    </section>
  );
}
