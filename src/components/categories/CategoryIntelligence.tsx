import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrendDelta } from "@/components/ui/TrendDelta";
import type { CategoryInsight } from "@/types";

interface CategoryIntelligenceProps {
  insights: CategoryInsight[];
}

function InsightCard({ insight }: { insight: CategoryInsight }) {
  return (
    <div className="flex flex-col rounded-xl bg-slate-50 p-2.5">
      <p className="text-[10px] font-bold text-slate-700">{insight.category}</p>
      <p className="truncate text-[9px] font-medium text-slate-400">
        {insight.metric}
      </p>
      <div className="mt-auto flex items-end justify-between gap-1 pt-1.5">
        <span>
          <span className="block text-lg leading-tight font-bold text-slate-900">
            {insight.value}
          </span>
          <span className="block text-[9px] leading-tight font-medium text-slate-400">
            {insight.label}
          </span>
        </span>
        <TrendDelta delta={insight.delta} className="pb-0.5 text-[10px]" />
      </div>
    </div>
  );
}

/** Lightweight analytics strip embedded in the All Categories grid. */
export function CategoryIntelligence({ insights }: CategoryIntelligenceProps) {
  return (
    <Card className="anim-item col-span-3 flex flex-col p-3.5">
      <SectionHeader
        variant="title"
        title="Category Intelligence"
        actionLabel="View full insights"
      />
      <div className="mt-2.5 grid flex-1 grid-cols-4 gap-2">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </Card>
  );
}
