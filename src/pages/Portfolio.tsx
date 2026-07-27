import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OutcomeChip } from "@/components/ui/OutcomeChip";
import { RailCard } from "@/components/rail/RailCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrendDelta } from "@/components/ui/TrendDelta";
import { homeData } from "@/data";
import { marketsStore } from "@/engine/markets";
import {
  potentialPayout,
  predictionsStore,
  type Position,
} from "@/engine/predictions";
import { useStore } from "@/engine/store";
import { showToast } from "@/engine/toasts";
import { walletStore } from "@/engine/wallet";
import { usePageReveal } from "@/hooks/usePageReveal";
import type { Delta, PageMetric } from "@/types";

function formatDate(at: number): string {
  return new Date(at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function positionDelta(position: Position, currentProbability: number): Delta {
  const signed =
    position.side === "yes"
      ? currentProbability - position.entryProbability
      : position.entryProbability - currentProbability;
  return { direction: signed < 0 ? "down" : "up", value: Math.abs(signed) };
}

function PositionRow({ position }: { position: Position }) {
  const live = useStore(marketsStore)[position.marketId];
  const current = live?.probability ?? position.entryProbability;
  const payout = potentialPayout(
    position.stake,
    position.entryProbability,
    position.side,
  );

  return (
    <Card className="anim-item flex items-center gap-4 p-4">
      <OutcomeChip outcome={position.side === "yes" ? "Yes" : "No"} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-slate-900">
          {position.title}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-slate-400">
          {position.stake.toLocaleString("en-IN")} pts
          <span className="mx-1.5">•</span>
          Entry {position.entryProbability}%
          <span className="mx-1.5">•</span>
          {formatDate(position.at)}
        </p>
      </div>
      <div className="w-20 shrink-0 text-center">
        <p className="text-lg leading-tight font-bold text-slate-900">{current}%</p>
        <TrendDelta
          delta={positionDelta(position, current)}
          className="justify-center text-xs"
        />
      </div>
      <div className="w-28 shrink-0 text-right">
        <p className="text-sm font-bold text-slate-900">
          {payout.toLocaleString("en-IN")} pts
        </p>
        <p className="text-[11px] font-medium text-slate-400">Potential payout</p>
      </div>
    </Card>
  );
}

export function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveal(rootRef);
  const navigate = useNavigate();

  const wallet = useStore(walletStore);
  const positions = useStore(predictionsStore);
  const invested = positions.reduce((sum, position) => sum + position.stake, 0);

  const metrics: PageMetric[] = [
    {
      id: "balance",
      icon: "target",
      value: wallet.balance.toLocaleString("en-IN"),
      label: "Points Balance",
    },
    {
      id: "invested",
      icon: "bars",
      value: invested.toLocaleString("en-IN"),
      label: "Points Invested",
    },
    {
      id: "positions",
      icon: "activity",
      value: String(positions.length),
      label: "Active Positions",
    },
    {
      id: "accuracy",
      icon: "trending",
      value: homeData.user.accuracy,
      label: "Accuracy",
    },
  ];

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-start gap-6 px-6 py-5"
    >
      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHero
          title="Portfolio"
          subtitle="Track your predictions, points and forecasting performance."
          metrics={metrics}
        />

        <section>
          <SectionHeader
            title="Active Positions"
            actionLabel={positions.length > 0 ? "View history" : undefined}
            className="anim-rise mb-3"
          />
          <div className="flex flex-col gap-3">
            {positions.map((position) => (
              <PositionRow key={position.id} position={position} />
            ))}
            {positions.length === 0 && (
              <Card className="anim-item flex flex-col items-center gap-3 p-10 text-center">
                <p className="text-sm text-slate-400">
                  No predictions yet — pick a market and take a side.
                </p>
                <Button size="sm" onClick={() => navigate("/")}>
                  Explore markets
                </Button>
              </Card>
            )}
          </div>
        </section>
      </main>

      <aside className="anim-rail flex w-80 shrink-0 flex-col gap-5">
        <RailCard variant="title" title="Wallet">
          <p className="text-2xl font-bold text-slate-900">
            {wallet.balance.toLocaleString("en-IN")}
            <span className="ml-1.5 text-xs font-semibold text-slate-400">pts</span>
          </p>
          <p className="mt-1 text-[11px] leading-relaxed font-medium text-slate-400">
            Beta accounts trade virtual points. INR deposits via Razorpay arrive
            with the public launch.
          </p>
          <Button
            size="sm"
            className="mt-3 w-full"
            onClick={() =>
              showToast("Razorpay deposits arrive with the public beta.", "info")
            }
          >
            Add Points
          </Button>
        </RailCard>

        <RailCard variant="title" title="Recent Transactions">
          <ul className="flex flex-col gap-3">
            {wallet.transactions.slice(0, 8).map((transaction) => (
              <li key={transaction.id} className="flex items-center gap-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-slate-700">
                    {transaction.label}
                  </span>
                  <span className="block text-[10px] font-medium text-slate-400">
                    {formatDate(transaction.at)}
                  </span>
                </span>
                <span
                  className={
                    transaction.amount >= 0
                      ? "text-[13px] font-bold text-emerald-600"
                      : "text-[13px] font-bold text-red-500"
                  }
                >
                  {transaction.amount >= 0 ? "+" : ""}
                  {transaction.amount.toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </RailCard>
      </aside>
    </div>
  );
}
