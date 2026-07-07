import { cn } from "@/lib/cn";
import { heatmapIntensityClasses as intensityClasses } from "@/lib/heatmap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { HeatmapData } from "@/types";

interface EventHeatmapProps {
  heatmap: HeatmapData;
}

/** GitHub-style density grid of event activity over time. */
export function EventHeatmap({ heatmap }: EventHeatmapProps) {
  return (
    <section className="anim-rise min-w-0">
      <SectionHeader
        variant="title"
        title="Event Heatmap"
        actionLabel="View full heatmap"
        className="mb-3.5"
      />
      <div className="grid grid-cols-7 gap-1.5">
        {heatmap.days.map((day) => (
          <span
            key={day}
            className="pb-0.5 text-center text-[9px] font-bold tracking-wide text-slate-400"
          >
            {day}
          </span>
        ))}
        {heatmap.rows.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => (
            <span
              key={`${rowIndex}-${colIndex}`}
              title={value === 0 ? "No events" : `${value * 3} events`}
              className={cn(
                "h-4 w-full rounded transition-transform hover:scale-110",
                intensityClasses[value],
              )}
            />
          )),
        )}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
        <span>Less Events</span>
        {intensityClasses.map((cls) => (
          <span key={cls} className={cn("size-2.5 rounded-[3px]", cls)} />
        ))}
        <span>More Events</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] border border-slate-200 bg-white" />
          No Events
        </span>
      </div>
    </section>
  );
}
