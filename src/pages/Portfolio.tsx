import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OutcomeChip } from "@/components/ui/OutcomeChip";
import { RailCard } from "@/components/rail/RailCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrendDelta } from "@/components/ui/TrendDelta";
import { marketsStore } from "@/engine/markets";
import {
  potentialPayout,
  predictionsStore,
  type Position,
} from "@/engine/predictions";
import { useStore } from "@/engine/store";
import { userMarketsStore } from "@/engine/userMarkets";
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
    <Card className="position-row anim-item flex items-center gap-4 p-4">
      <OutcomeChip outcome={position.side === "yes" ? "Yes" : "No"} />
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold text-slate-900">
          {position.title}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-slate-400">
          {position.stake.toLocaleString("en-IN")} pts
          <span className="mx-1.5">•</span>
          Entry {position.entryProbability}%<span className="mx-1.5">•</span>
          {formatDate(position.at)}
        </p>
      </div>
      <div className="w-20 shrink-0 text-center">
        <p className="text-lg leading-tight font-bold text-slate-900">
          {current}%
        </p>
        <TrendDelta
          delta={positionDelta(position, current)}
          className="justify-center text-xs"
        />
      </div>
      <div className="w-28 shrink-0 text-right">
        <p className="text-sm font-bold text-slate-900">
          {payout.toLocaleString("en-IN")} pts
        </p>
        <p className="text-[11px] font-medium text-slate-400">
          Potential payout
        </p>
      </div>
    </Card>
  );
}

export function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveal(rootRef);
  const navigate = useNavigate();
  const [tab, setTab] = useState("Predictions");
  const drafts = useStore(userMarketsStore);

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
      value: "--",
      label: "Settled Accuracy",
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
          subtitle="Your forecasts, your conviction, and how they change over time."
          metrics={metrics}
        />

        <div className="flex flex-wrap gap-2">
          {["Predictions", "Activity", "My markets"].map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-3 py-2 text-sm ${tab === item ? "bg-brand-700 text-white" : "bg-white text-slate-600"}`}
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "Predictions" && (
          <section>
            <SectionHeader
              title="Active Positions"
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
                  <Button
                    size="sm"
                    onClick={() => navigate("/search?type=Market")}
                  >
                    Explore markets
                  </Button>
                </Card>
              )}
            </div>
          </section>
        )}
        {tab === "Activity" && (
          <section aria-label="Points activity">
            {wallet.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-4 border-b border-slate-200 py-4 text-sm"
              >
                <span>
                  {transaction.label}
                  <span className="mt-1 block text-xs text-slate-500">
                    {formatDate(transaction.at)}
                  </span>
                </span>
                <strong
                  className={
                    transaction.amount > 0
                      ? "text-emerald-600"
                      : "text-slate-700"
                  }
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toLocaleString("en-IN")} pts
                </strong>
              </div>
            ))}
          </section>
        )}
        {tab === "My markets" && (
          <section aria-label="Submitted markets">
            {drafts.map((draft) => (
              <article
                key={draft.id}
                className="border-b border-slate-200 py-4"
              >
                <span className="text-xs font-semibold text-amber-700">
                  In review
                </span>
                <h2 className="mt-1 text-sm font-semibold">{draft.question}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {draft.event} · Closes {draft.closesOn}
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Resolution source: {draft.resolutionSource}
                </p>
              </article>
            ))}
            {!drafts.length && (
              <p className="py-10 text-sm text-slate-500">
                No markets submitted yet.
              </p>
            )}
          </section>
        )}
      </main>

      <aside className="anim-rail flex w-80 shrink-0 flex-col gap-5">
        <RailCard variant="title" title="Wallet">
          <p className="text-2xl font-bold text-slate-900">
            {wallet.balance.toLocaleString("en-IN")}
            <span className="ml-1.5 text-xs font-semibold text-slate-400">
              pts
            </span>
          </p>
          <p className="mt-1 text-[11px] leading-relaxed font-medium text-slate-400">
            Virtual points only. No deposits, withdrawals or cash value.
          </p>
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
