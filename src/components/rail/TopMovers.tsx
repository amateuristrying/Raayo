import { TrendDelta } from "@/components/ui/TrendDelta";
import type { TopMover } from "@/types";
import { RailCard } from "./RailCard";

interface TopMoversProps {
  movers: TopMover[];
}

export function TopMovers({ movers }: TopMoversProps) {
  return (
    <RailCard title="Top Movers (24h)" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {movers.map((mover) => (
          <li key={mover.id} className="flex items-center gap-2.5">
            <span className="w-4 text-center text-[13px] font-semibold text-slate-400">
              {mover.rank}
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-base">
              {mover.emoji}
            </span>
            <p className="flex-1 text-[13px] leading-snug font-medium text-slate-700">
              {mover.title}
            </p>
            <TrendDelta delta={mover.delta} className="text-xs" />
          </li>
        ))}
      </ul>
    </RailCard>
  );
}
