import { memo } from "react";
import { Card } from "@/components/ui/Card";
import { OutcomeChip } from "@/components/ui/OutcomeChip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ResolvedCard } from "@/types";

interface ResolvedStripProps {
  markets: ResolvedCard[];
}

const ResolvedArchiveCard = memo(function ResolvedArchiveCard({
  market,
}: {
  market: ResolvedCard;
}) {
  return (
    <Card hoverable className="anim-item cursor-pointer p-4">
      <div className="flex items-center justify-between gap-2">
        <OutcomeChip outcome={market.outcome} />
        <span className="text-sm font-bold text-slate-900">
          {market.probability}%
        </span>
      </div>
      <p className="mt-2.5 text-[13px] leading-snug font-medium text-slate-700">
        {market.title}
      </p>
      <p className="mt-3 border-t border-slate-100 pt-2.5 text-[11px] font-medium text-slate-400">
        Resolved {market.resolvedAgo}
        <span className="mx-1">·</span>
        {market.markets} markets
      </p>
    </Card>
  );
});

/** Row of resolved-market archive cards for historical discovery. */
export function ResolvedStrip({ markets }: ResolvedStripProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="Recently Resolved"
        subtitle="How past predictions played out"
        actionLabel="View all"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-4 gap-4">
        {markets.map((market) => (
          <ResolvedArchiveCard key={market.id} market={market} />
        ))}
      </div>
    </section>
  );
}
