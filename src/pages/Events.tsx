import { useRef } from "react";
import { PageHero } from "@/components/common/PageHero";
import { BrowseByMonth } from "@/components/events/BrowseByMonth";
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

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-start gap-6 px-6 py-5"
    >
      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHero
          title="Events"
          subtitle="Every real-world event shaping India's future."
          metrics={eventsPageData.metrics}
        />

        <EventsTimeline sections={eventsPageData.timeline} />

        <EventFilters
          statusFilters={eventsPageData.statusFilters}
          categoryFilters={eventsPageData.categoryFilters}
        />

        <FeaturedEvents events={eventsPageData.featured} />
        <LiveNowStrip items={eventsPageData.liveNow} />
        <StartingSoon items={eventsPageData.startingSoon} />

        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start gap-6">
          <BrowseByMonth months={eventsPageData.months} />
          <EventHeatmap heatmap={eventsPageData.heatmap} />
        </div>
      </main>

      <EventsRail />
    </div>
  );
}
