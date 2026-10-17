import { useRef, useState } from "react";
import { PageHero } from "@/components/common/PageHero";
import { EventFilters } from "@/components/events/EventFilters";
import { EventHeatmap } from "@/components/events/EventHeatmap";
import { EventsTimeline } from "@/components/events/EventsTimeline";
import { FeaturedEvents } from "@/components/events/FeaturedEvents";
import { LiveNowStrip } from "@/components/events/LiveNowStrip";
import { StartingSoon } from "@/components/events/StartingSoon";
import { EventsRail } from "@/components/rail/EventsRail";
import { usePageReveal } from "@/hooks/usePageReveal";
import { eventsPageData } from "@/data";

export function EventsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveal(rootRef);
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const categoryTypes: Record<string, string[]> = {
    sports: ["International Cricket"],
    finance: ["Monetary Policy"],
    govt: ["Monetary Policy", "Election"],
    movies: ["Film Release"],
    entertainment: ["Film Release"],
    politics: ["Election"],
  };
  const filtered = eventsPageData.featured.filter(
    (event) =>
      (status === "all" ||
        (event.badge.live ? "live" : "upcoming") === status) &&
      (category === "all" ||
        categoryTypes[category]?.includes(event.type.label)),
  );

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-start gap-6 px-6 py-5"
    >
      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHero
          title="Events"
          subtitle="The context behind the probability. Follow the moments that move India's collective outlook."
          metrics={eventsPageData.metrics}
        />

        <EventsTimeline sections={eventsPageData.timeline} />

        <EventFilters
          statusFilters={eventsPageData.statusFilters}
          categoryFilters={eventsPageData.categoryFilters}
          activeStatus={status}
          activeCategory={category}
          onStatus={setStatus}
          onCategory={setCategory}
        />

        <p className="text-sm text-slate-500" role="status">
          {filtered.length} featured{" "}
          {filtered.length === 1 ? "event" : "events"} match your filters
        </p>
        {filtered.length > 0 ? (
          <FeaturedEvents events={filtered} />
        ) : (
          <div className="border-y border-slate-200 py-10 text-center">
            <p className="text-slate-600">
              No featured events in this selection.
            </p>
            <button
              className="mt-3 text-sm font-semibold text-brand-700"
              onClick={() => {
                setStatus("all");
                setCategory("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        <LiveNowStrip items={eventsPageData.liveNow} />
        <StartingSoon items={eventsPageData.startingSoon} />

        <div className="grid items-start gap-6">
          <EventHeatmap heatmap={eventsPageData.heatmap} />
        </div>
      </main>

      <EventsRail />
    </div>
  );
}
