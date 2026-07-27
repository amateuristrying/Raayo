import { memo } from "react";
import { cn } from "@/lib/cn";
import { accentGradients } from "@/lib/accents";
import { Card } from "@/components/ui/Card";
import { EmojiTile } from "@/components/ui/EmojiTile";
import { TrendDelta } from "@/components/ui/TrendDelta";
import { openPrediction } from "@/engine/ui";
import type { FeaturedEventData, ProbabilityTone } from "@/types";

interface FeaturedEventCardProps {
  event: FeaturedEventData;
}

const probabilityToneClasses: Record<ProbabilityTone, string> = {
  red: "text-red-500",
  amber: "text-orange-500",
  slate: "text-slate-600",
  sky: "text-sky-500",
  emerald: "text-emerald-600",
};

function CoverBadge({ badge }: { badge: FeaturedEventData["badge"] }) {
  return (
    <span
      className={cn(
        "absolute top-3 left-3 flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide text-white",
        badge.live ? "bg-emerald-500" : "bg-brand-950/80",
      )}
    >
      {badge.live && <span className="size-1 animate-pulse rounded-full bg-white" />}
      {badge.label}
    </span>
  );
}

/** Editorial event card with its top prediction and related entities. */
export const FeaturedEventCard = memo(function FeaturedEventCard({
  event,
}: FeaturedEventCardProps) {
  return (
    <Card
      hoverable
      className="anim-item cursor-pointer overflow-hidden"
      onClick={() =>
        openPrediction({
          id: `${event.id}--top`,
          title: event.mostPopular.question,
          category: event.type.label,
          probability: event.mostPopular.probability,
        })
      }
    >
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
        <CoverBadge badge={event.badge} />
        <span className="absolute top-3 right-3 flex items-center gap-0.5 rounded-md bg-emerald-500/95 px-1.5 py-0.5 text-[10px] font-bold text-white">
          <svg viewBox="0 0 8 8" className="size-1.5" aria-hidden>
            <path d="M4 0.5 7.5 6.5H0.5Z" fill="currentColor" />
          </svg>
          {event.delta.value}%
        </span>
      </div>

      <div className="p-3.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          <span aria-hidden>{event.type.emoji}</span>
          {event.type.label}
        </span>
        <h3 className="mt-2 truncate text-[15px] font-bold text-slate-900">
          {event.title}
        </h3>
        <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
          {event.meta}
        </p>
        <p className="mt-1 text-[11px] font-medium text-slate-400">
          <span className="font-semibold text-slate-700">
            {event.markets} Markets
          </span>
          <span className="mx-1">·</span>
          {event.traders} Traders
        </p>

        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
            Most Popular
          </p>
          <div className="mt-1 flex items-start justify-between gap-2">
            <p className="text-[13px] leading-snug font-medium text-slate-700">
              {event.mostPopular.question}
            </p>
            <span className="text-right">
              <span
                className={cn(
                  "block text-xl leading-tight font-bold",
                  probabilityToneClasses[event.mostPopular.tone],
                )}
              >
                {event.mostPopular.probability}%
              </span>
              <TrendDelta
                delta={event.mostPopular.delta}
                window="24h"
                className="text-[11px]"
              />
            </span>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
            Related Entities
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            {event.entities.map((entity) => (
              <span key={entity.name} className="flex items-center gap-1">
                <EmojiTile emoji={entity.emoji} accent={entity.accent} size="xs" />
                <span className="text-[11px] font-medium whitespace-nowrap text-slate-600">
                  {entity.name}
                </span>
              </span>
            ))}
            <span className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-500">
              +{event.moreEntities}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
});
