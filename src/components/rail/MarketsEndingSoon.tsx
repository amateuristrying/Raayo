import { Hourglass } from "lucide-react";
import type { EndingSoonMarket } from "@/types";
import { RailCard } from "./RailCard";

interface MarketsEndingSoonProps {
  markets: EndingSoonMarket[];
}

export function MarketsEndingSoon({ markets }: MarketsEndingSoonProps) {
  return (
    <RailCard title="Markets Ending Soon" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {markets.map((market) => (
          <li key={market.id} className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Hourglass className="size-4" />
            </span>
            <p className="flex-1 text-[13px] leading-snug font-medium text-slate-700">
              {market.title}
            </p>
            <span className="text-[13px] font-bold whitespace-nowrap text-amber-600">
              {market.timeLeft}
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}
