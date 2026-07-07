import { cn } from "@/lib/cn";
import { heatmapIntensityClasses as intensityClasses } from "@/lib/heatmap";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CategoryHeatmapData } from "@/types";

interface CategoryHeatmapProps {
  heatmap: CategoryHeatmapData;
}

/** GitHub-style activity grid — one row per category, two cells per day. */
export function CategoryHeatmap({ heatmap }: CategoryHeatmapProps) {
  return (
    <Card className="anim-rise min-w-0 p-4">
      <SectionHeader
        variant="title"
        title="Category Activity Heatmap"
        actionLabel="View full heatmap"
      />

      <div className="mt-3 flex items-center gap-1">
        <span className="w-[70px] shrink-0" />
        {heatmap.days.map((day) => (
          <span
            key={day}
            className="flex-[2] text-center text-[8px] font-bold tracking-wide text-slate-400"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="mt-1 flex flex-col gap-1">
        {heatmap.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-1">
            <span className="w-[70px] shrink-0 truncate text-[10px] font-semibold text-slate-500">
              {row.label}
            </span>
            {row.cells.map((value, index) => (
              <span
                key={index}
                title={value === 0 ? "No activity" : `${value * 4} predictions`}
                className={cn(
                  "h-3.5 flex-1 rounded-[3px] transition-transform hover:scale-110",
                  intensityClasses[value],
                )}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
        <span>Less Activity</span>
        {intensityClasses.map((cls) => (
          <span key={cls} className={cn("size-2.5 rounded-[3px]", cls)} />
        ))}
        <span>More Activity</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] border border-slate-200 bg-white" />
          No Activity
        </span>
      </div>
    </Card>
  );
}
