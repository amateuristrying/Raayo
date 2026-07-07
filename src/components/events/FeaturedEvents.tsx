import { ChevronRight } from "lucide-react";
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
      <button
        type="button"
        aria-label="Scroll featured events"
        className="absolute top-1/2 -right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-float transition-all hover:-translate-y-px hover:text-brand-700"
      >
        <ChevronRight className="size-4" />
      </button>
    </section>
  );
}
