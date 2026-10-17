import {
  Activity,
  Calendar,
  ChartNoAxesColumn,
  CirclePlay,
  Compass,
  Flame,
  LayoutGrid,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import type { MetricIcon, PageMetric } from "@/types";

interface PageHeroProps {
  title: string;
  subtitle: string;
  metrics: PageMetric[];
  /** Widens the subtitle column for longer editorial copy. */
  wideSubtitle?: boolean;
}

const metricIcons: Record<MetricIcon, LucideIcon> = {
  activity: Activity,
  calendar: Calendar,
  target: Target,
  compass: Compass,
  play: CirclePlay,
  flame: Flame,
  grid: LayoutGrid,
  bars: ChartNoAxesColumn,
  trending: TrendingUp,
};

function MetricCard({ metric }: { metric: PageMetric }) {
  const Icon = metricIcons[metric.icon];
  return (
    <div className="anim-metric flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-lg leading-tight font-bold text-slate-900">
          {metric.value}
        </span>
        <span className="block text-[11px] leading-tight font-medium text-slate-400">
          {metric.label}
        </span>
      </span>
    </div>
  );
}

/** Editorial page heading with a lightweight metrics strip on the right. */
export function PageHero({
  title,
  subtitle,
  metrics,
  wideSubtitle = false,
}: PageHeroProps) {
  return (
    <section className="page-heading flex flex-wrap items-start justify-between gap-6">
      <div className="anim-hero">
        <h1 className="text-4xl font-bold tracking-tight text-brand-800">
          {title}
        </h1>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed text-slate-500",
            wideSubtitle ? "max-w-md" : "max-w-xs",
          )}
        >
          {subtitle}
        </p>
      </div>
      {metrics.length > 0 && <Card className="anim-hero flex flex-wrap items-center gap-6 px-5 py-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </Card>}
    </section>
  );
}
