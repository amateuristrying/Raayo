import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { eventClusters } from "@/data";
import { EventClusterCard } from "./EventClusterCard";

/** "Event Clusters" grid with its floating scroll affordance. */
export function EventClustersSection() {
  return (
    <section className="anim-rise relative">
      <SectionHeader title="Event Clusters" actionLabel="View all" className="mb-3" />
      <div className="grid grid-cols-3 gap-5">
        {eventClusters.map((cluster) => (
          <EventClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
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
