import type { ReactNode } from "react";
import { ChartNoAxesColumn, Droplets, Users } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { TrendDelta } from "@/components/ui/TrendDelta";
import { HERO_MARKET_ID, liveDelta, marketsStore } from "@/engine/markets";
import { useStore } from "@/engine/store";
import { openPrediction } from "@/engine/ui";
import type { HeroMarket } from "@/types";
import { HeroChart } from "./HeroChart";

interface HeroCardProps {
  market: HeroMarket;
}

interface HeroStatProps {
  icon: ReactNode;
  value: string;
  label: string;
}

function HeroStat({ icon, value, label }: HeroStatProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-white/40">{icon}</span>
      <span>
        <span className="block text-[15px] leading-tight font-bold">{value}</span>
        <span className="block text-[11px] leading-tight font-medium text-white/50">
          {label}
        </span>
      </span>
    </div>
  );
}

/** "India's Pulse" — the signature dark hero market card. */
export function HeroCard({ market }: HeroCardProps) {
  const live = useStore(marketsStore)[HERO_MARKET_ID];
  const probability = live?.probability ?? market.probability;
  const delta = live ? liveDelta(live) : market.delta;
  const series =
    live && live.spark.length > 0
      ? live.spark.map((value, index) => ({ hour: index, value }))
      : market.series;

  return (
    <section
      onClick={() =>
        openPrediction({
          id: HERO_MARKET_ID,
          title: market.headline,
          category: market.category,
          probability,
        })
      }
      className="anim-hero relative cursor-pointer overflow-hidden rounded-3xl bg-brand-950 p-7 text-white shadow-hero"
    >
      {/* Soft glow behind the chart, subtle depth on the left. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_460px_at_80%_-10%,rgba(106,82,212,0.4),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(39,24,126,0.55),transparent_55%)]" />

      <div className="relative grid grid-cols-[minmax(0,10fr)_minmax(0,11fr)] gap-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">
              {market.eyebrow}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-emerald-400 uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              Simulated
            </p>
          </div>

          <h1 className="mt-4 max-w-md text-[38px] leading-[1.15] font-bold tracking-tight text-balance">
            {market.headline}
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold">
              🏏 {market.category}
            </span>
            <span className="text-[13px] font-medium text-white/60">
              Closes in {market.closesIn}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-4">
            <CountUp
              value={probability}
              suffix="%"
              className="text-[64px] leading-none font-bold tracking-tight"
            />
            <div className="pb-1.5">
              <p className="text-xl leading-tight font-bold text-brand-300">
                {market.outcome}
              </p>
              <TrendDelta
                delta={delta}
                window={market.deltaWindow}
                onDark
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6 border-t border-white/10 pt-5">
            <HeroStat
              icon={<Users className="size-[18px]" />}
              value={market.traders.toLocaleString("en-IN")}
              label="Participants"
            />
            <span className="h-8 w-px bg-white/10" />
            <HeroStat
              icon={<ChartNoAxesColumn className="size-[18px]" />}
              value={market.volume}
              label="Volume"
            />
            <span className="h-8 w-px bg-white/10" />
            <HeroStat
              icon={<Droplets className="size-[18px]" />}
              value={market.liquidity}
              label="Liquidity"
            />
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-[13px] leading-relaxed text-white/75">
            <span className="font-semibold text-white">Why it moved: </span>
            {market.whyItMoved}
          </div>
        </div>

        <HeroChart series={series} probability={probability} />
      </div>
    </section>
  );
}
