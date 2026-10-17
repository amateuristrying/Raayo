import { Fragment } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import type { Accent, TimelineSection } from "@/types";

interface EventsTimelineProps {
  sections: TimelineSection[];
}

const dotClasses: Record<Accent, string> = {
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  indigo: "bg-indigo-400",
  orange: "bg-orange-500",
  slate: "bg-slate-400",
};

function SectionDate({ section }: { section: TimelineSection }) {
  switch (section.kind) {
    case "circle":
      return (
        <span className="flex flex-col items-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-700 text-xl font-bold text-white shadow-sm">
            {section.value}
          </span>
          {section.sub && (
            <span className="mt-1 text-[10px] font-bold tracking-wide text-slate-400">
              {section.sub}
            </span>
          )}
        </span>
      );
    case "number":
      return (
        <span
          className={cn(
            "font-bold text-slate-900",
            (section.value?.length ?? 0) <= 2 ? "text-2xl" : "text-lg",
          )}
        >
          {section.value}
        </span>
      );
    case "days":
      return (
        <span className="flex gap-3">
          {section.days?.map((day) => (
            <span key={day.label} className="flex flex-col items-center">
              <span className="text-[9px] font-bold tracking-wide text-slate-400">
                {day.label}
              </span>
              <span className="mt-0.5 text-sm font-bold text-slate-800">
                {day.num}
              </span>
            </span>
          ))}
        </span>
      );
    case "icon":
      return <CalendarDays className="size-7 text-slate-300" />;
  }
}

function TimelineSectionView({ section }: { section: TimelineSection }) {
  const isToday = section.id === "today";
  return (
    <div
      className="group relative flex min-w-24 flex-col items-center rounded-xl px-2 pt-2 pb-1"
      style={{ flexGrow: section.grow ?? 1, flexBasis: 0 }}
    >
      <p className="text-[10px] font-bold tracking-[0.08em] whitespace-nowrap text-slate-700 uppercase">
        {section.label}
      </p>
      <p className="mt-0.5 text-[10px] font-medium whitespace-nowrap text-slate-400">
        {section.count}
      </p>

      <div className="flex min-h-16 flex-1 items-center">
        <SectionDate section={section} />
      </div>

      <div className="flex h-3 items-center gap-1">
        {section.dots.map((accent, index) => (
          <span
            key={index}
            className={cn("size-1.5 rounded-full", dotClasses[accent])}
          />
        ))}
      </div>

      {/* Node sitting on the connecting line below the card content. */}
      <span
        className={cn(
          "absolute -bottom-[22px] left-1/2 size-2.5 -translate-x-1/2 rounded-full transition-colors",
          isToday
            ? "bg-brand-700 ring-4 ring-brand-100"
            : "bg-brand-200 group-hover:bg-brand-400",
        )}
      />
    </div>
  );
}

/** Signature horizontal timeline organizing events by time. */
export function EventsTimeline({ sections }: EventsTimelineProps) {
  return (
    <Card className="anim-rise relative overflow-x-auto px-5 pt-4 pb-10">
      <div className="flex min-w-[760px] items-stretch">
        {sections.map((section, index) => (
          <Fragment key={section.id}>
            {index > 0 && (
              <span className="my-2 border-l border-dashed border-slate-200/90" />
            )}
            <TimelineSectionView section={section} />
          </Fragment>
        ))}
      </div>
      {/* Connecting line with a forward arrow. */}
      <div className="absolute right-12 bottom-[26px] left-6 h-0.5 rounded bg-brand-100" />
      <ArrowRight className="absolute right-5 bottom-[19px] size-4 text-brand-300" />
    </Card>
  );
}
