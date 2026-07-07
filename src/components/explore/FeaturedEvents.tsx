import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FeaturedEvent } from "@/types";
import { FeaturedEventCard } from "./FeaturedEventCard";

interface FeaturedEventsProps {
  events: FeaturedEvent[];
}

export function FeaturedEvents({ events }: FeaturedEventsProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="Featured Events"
        subtitle="Editorial picks from across Raayo"
        actionLabel="View all"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-2 gap-5">
        {events.map((event) => (
          <FeaturedEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
