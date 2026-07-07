import { memo } from "react";
import { cn } from "@/lib/cn";
import { accentGradients } from "@/lib/accents";
import { Card } from "@/components/ui/Card";
import type { ExploreEntity } from "@/types";

interface EntityCardProps {
  entity: ExploreEntity;
}

/** Image-led entity tile used in the "Browse by Entity" carousel. */
export const EntityCard = memo(function EntityCard({ entity }: EntityCardProps) {
  return (
    <Card
      hoverable
      className="anim-item w-44 shrink-0 cursor-pointer overflow-hidden"
    >
      <div
        className={cn(
          "relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br",
          accentGradients[entity.accent],
        )}
      >
        <div className="absolute -top-8 -right-8 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-6 size-24 rounded-full bg-white/10" />
        <span className="relative text-5xl drop-shadow-sm" aria-hidden>
          {entity.emoji}
        </span>
      </div>
      <div className="p-3.5">
        <p className="truncate text-sm font-bold text-slate-900">{entity.name}</p>
        <p className="mt-0.5 text-[11px] font-medium text-slate-400">
          {entity.type}
        </p>
        <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-[11px] font-medium text-slate-400">
          <span className="font-semibold text-slate-700">
            {entity.markets} Markets
          </span>
          <span className="mx-1">·</span>
          {entity.traders} Traders
        </p>
      </div>
    </Card>
  );
});
