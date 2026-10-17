import { useRef, useState } from "react";
import { BrowseCategories } from "@/components/explore/BrowseCategories";
import { BrowseEntities } from "@/components/explore/BrowseEntities";
import { DiscoveryCard } from "@/components/explore/DiscoveryCard";
import { ExploreGraph } from "@/components/explore/ExploreGraph";
import { FeaturedEvents } from "@/components/explore/FeaturedEvents";
import { PageHero } from "@/components/common/PageHero";
import { ProbabilityBuckets } from "@/components/explore/ProbabilityBuckets";
import { ResolvedStrip } from "@/components/explore/ResolvedStrip";
import { CategoryPills } from "@/components/markets/CategoryPills";
import { EventClustersSection } from "@/components/markets/EventClustersSection";
import { TrendingMarketsSection } from "@/components/markets/TrendingMarketsSection";
import { ExploreRail } from "@/components/rail/ExploreRail";
import { usePageReveal } from "@/hooks/usePageReveal";
import { categories, exploreData } from "@/data";

export function ExplorePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveal(rootRef);
  const [category, setCategory] = useState("all");

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-start gap-6 px-6 py-5"
    >
      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHero
          title="Explore"
          subtitle="Follow the connections. Find the people, events and questions shaping India's next chapter."
          metrics={exploreData.metrics}
        />

        <DiscoveryCard
          searches={exploreData.trendingSearches}
        />

        <div className="anim-rise">
          <CategoryPills
            categories={categories}
            value={category}
            onChange={setCategory}
          />
        </div>

        <EventClustersSection categoryFilter={category} />
        <TrendingMarketsSection categoryFilter={category} />

        <BrowseEntities entities={exploreData.entities} />
        <BrowseCategories categories={exploreData.categories} />
        <FeaturedEvents events={exploreData.featuredEvents} />
        <ExploreGraph nodes={exploreData.graph} />
        <ProbabilityBuckets buckets={exploreData.probabilityBuckets} />
        <ResolvedStrip markets={exploreData.recentlyResolved} />
      </main>

      <ExploreRail />
    </div>
  );
}
