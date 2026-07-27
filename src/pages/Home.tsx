import { useRef, useState } from "react";
import { LiveTicker } from "@/components/layout/LiveTicker";
import { HeroCard } from "@/components/home/HeroCard";
import { CategoryPills } from "@/components/markets/CategoryPills";
import { EventClustersSection } from "@/components/markets/EventClustersSection";
import { TrendingMarketsSection } from "@/components/markets/TrendingMarketsSection";
import { RightRail } from "@/components/rail/RightRail";
import { usePageReveal } from "@/hooks/usePageReveal";
import { categories, homeData } from "@/data";

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveal(rootRef);
  const [category, setCategory] = useState("all");

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-start gap-6 px-6 py-5"
    >
      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="anim-rise">
          <LiveTicker items={homeData.ticker} />
        </div>

        <HeroCard market={homeData.hero} />

        <div className="anim-rise">
          <CategoryPills
            categories={categories}
            value={category}
            onChange={setCategory}
          />
        </div>

        <EventClustersSection categoryFilter={category} />
        <TrendingMarketsSection categoryFilter={category} />
      </main>

      <RightRail />
    </div>
  );
}
