import { Bookmark, Flame, Hourglass, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { StatusChip } from "@/components/ui/StatusChip";
import { TrendDelta } from "@/components/ui/TrendDelta";
import { bookmarksStore, isBookmarked, toggleBookmark } from "@/engine/bookmarks";
import { liveDelta, marketsStore } from "@/engine/markets";
import { useStore } from "@/engine/store";
import { showToast } from "@/engine/toasts";
import { openPrediction } from "@/engine/ui";
import type { MarketIcon, TrendingMarket } from "@/types";

interface TrendingMarketRowProps {
  market: TrendingMarket;
}

const iconStyles: Record<MarketIcon, { classes: string; icon: LucideIcon }> = {
  chart: { classes: "bg-emerald-50 text-emerald-600", icon: TrendingUp },
  flame: { classes: "bg-orange-50 text-orange-500", icon: Flame },
  hourglass: { classes: "bg-amber-50 text-amber-600", icon: Hourglass },
};

interface MetricProps {
  value: string;
  label: string;
}

function Metric({ value, label }: MetricProps) {
  return (
    <div className="w-16 text-center">
      <p className="text-sm font-bold text-slate-900">{value}</p>
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
    </div>
  );
}

export function TrendingMarketRow({ market }: TrendingMarketRowProps) {
  const { classes, icon: Icon } = iconStyles[market.icon];
  const live = useStore(marketsStore)[market.id];
  const bookmarks = useStore(bookmarksStore);

  const probability = live?.probability ?? market.probability;
  const delta = live ? liveDelta(live) : market.delta;
  const spark = live && live.spark.length > 0 ? live.spark : market.sparkline;
  const bookmarked = isBookmarked(bookmarks, market.id);

  const openTradeModal = () =>
    openPrediction({
      id: market.id,
      title: market.title,
      category: market.category,
      probability,
    });

  return (
    <Card
      hoverable
      className="market-row flex cursor-pointer items-center gap-5 py-3.5 pr-3 pl-4"
      onClick={openTradeModal}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          classes,
        )}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <StatusChip label={market.status.label} tone={market.status.tone} />
          <h3 className="truncate text-[15px] font-semibold text-slate-900">
            {market.title}
          </h3>
        </div>
        <p className="mt-1 text-xs font-medium text-slate-400">
          {market.category}
          <span className="mx-1.5">•</span>
          {market.closes}
        </p>
      </div>

      <div className="w-16 shrink-0 text-center">
        <p className="text-[22px] leading-tight font-bold text-slate-900">
          {probability}%
        </p>
        <TrendDelta delta={delta} className="justify-center text-xs" />
      </div>

      <div className="shrink-0">
        <Sparkline data={spark} direction={delta.direction} />
      </div>

      <Metric value={market.volume} label="Volume" />
      <Metric value={market.traders} label="Traders" />

      <button
        type="button"
        aria-label={
          bookmarked
            ? `Remove bookmark for "${market.title}"`
            : `Bookmark "${market.title}"`
        }
        aria-pressed={bookmarked}
        onClick={(event) => {
          event.stopPropagation();
          const added = toggleBookmark(market.id);
          showToast(added ? "Added to bookmarks" : "Removed from bookmarks", "info");
        }}
        className={cn(
          "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors",
          bookmarked
            ? "text-brand-700 hover:bg-brand-50"
            : "text-slate-300 hover:bg-brand-50 hover:text-brand-700",
        )}
      >
        <Bookmark className={cn("size-[18px]", bookmarked && "fill-current")} />
      </button>
    </Card>
  );
}
