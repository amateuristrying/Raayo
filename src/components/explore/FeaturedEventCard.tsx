import { memo } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/cn";
import { accentGradients } from "@/lib/accents";
import { Card } from "@/components/ui/Card";
import type { FeaturedEvent } from "@/types";

interface FeaturedEventCardProps {
  event: FeaturedEvent;
}

/** Large editorial event card with its top prediction. */
export const FeaturedEventCard = memo(function FeaturedEventCard({
  event,
}: FeaturedEventCardProps) {
  return (
    <Card hoverable className="anim-item cursor-pointer overflow-hidden">
      <div
        className={cn(
          "relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br",
          accentGradients[event.accent],
        )}
      >
        <div className="absolute -top-10 -right-8 size-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-8 size-28 rounded-full bg-white/10" />
        <span className="relative text-5xl drop-shadow-sm" aria-hidden>
          {event.emoji}
        </span>
        <span className="absolute top-3 right-3 rounded-lg bg-white/95 px-2 py-1 text-sm font-bold text-slate-900 shadow-float">
          {event.topPrediction.probability}%
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-slate-900">{event.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Calendar className="size-3.5" />
          {event.date}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
              Top Prediction
            </p>
            <p className="truncate text-[13px] font-medium text-slate-700">
              {event.topPrediction.title}
            </p>
          </div>
          <span className="text-base font-bold text-slate-900">
            {event.topPrediction.probability}%
          </span>
        </div>
        <p className="mt-3 text-[11px] font-medium text-slate-400">
          <span className="font-semibold text-slate-700">
            {event.markets} Markets
          </span>
          <span className="mx-1">·</span>
          {event.traders} Traders
        </p>
      </div>
    </Card>
  );
});
