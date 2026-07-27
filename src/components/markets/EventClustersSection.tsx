import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { eventClusters } from "@/data";
import { clusterThemeCategory, matchesCategory } from "./categoryFilter";
import { EventClusterCard } from "./EventClusterCard";

interface EventClustersSectionProps {
  /** Category pill id; "all"/"following"/undefined shows everything. */
  categoryFilter?: string;
}

/** "Event Clusters" grid with its floating scroll affordance. */
export function EventClustersSection({
  categoryFilter,
}: EventClustersSectionProps) {
  const visible = eventClusters.filter((cluster) =>
    matchesCategory(categoryFilter, clusterThemeCategory[cluster.theme]),
  );

  return (
    <section className="anim-rise relative">
      <SectionHeader title="Event Clusters" actionLabel="View all" className="mb-3" />
      {visible.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {visible.map((cluster) => (
            <EventClusterCard key={cluster.id} cluster={cluster} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-sm text-slate-400">
          No event clusters in this category yet.
        </Card>
      )}
      <button
        type="button"
        aria-label="Scroll event clusters"
        className="absolute top-[55%] -right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-float transition-all hover:-translate-y-px hover:text-brand-700"
      >
        <ChevronRight className="size-4" />
      </button>
    </section>
  );
}
