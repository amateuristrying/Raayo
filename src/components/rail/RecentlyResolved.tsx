import { OutcomeChip } from "@/components/ui/OutcomeChip";
import type { ResolvedMarket } from "@/types";
import { RailCard } from "./RailCard";

interface RecentlyResolvedProps {
  markets: ResolvedMarket[];
}

export function RecentlyResolved({ markets }: RecentlyResolvedProps) {
  return (
    <RailCard title="Recently Resolved" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {markets.map((market) => (
          <li key={market.id} className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-base">
              {market.emoji}
            </span>
            <p className="flex-1 text-[13px] leading-snug font-medium text-slate-700">
              {market.title}
            </p>
            <OutcomeChip outcome={market.outcome} />
            <span className="text-[13px] font-bold text-slate-900">
              {market.probability}%
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}
