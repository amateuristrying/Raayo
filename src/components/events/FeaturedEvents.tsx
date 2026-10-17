import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FeaturedEventData } from "@/types";
import { FeaturedEventCard } from "./FeaturedEventCard";

interface FeaturedEventsProps {
  events: FeaturedEventData[];
}

/** Hero content of the Events page — large editorial cards. */
export function FeaturedEvents({ events }: FeaturedEventsProps) {
  return (
    <section className="relative">
      <SectionHeader
        variant="title"
        title="Featured Events"
        actionLabel="View all events"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-4 gap-5">
        {events.map((event) => (
          <FeaturedEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
