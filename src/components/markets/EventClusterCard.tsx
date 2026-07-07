import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { accentGradients } from "@/lib/accents";
import { Card } from "@/components/ui/Card";
import { TrendDelta } from "@/components/ui/TrendDelta";
import type { Accent, ClusterTheme, EventCluster } from "@/types";

interface EventClusterCardProps {
  cluster: EventCluster;
}

const themeAccents: Record<ClusterTheme, Accent> = {
  cricket: "emerald",
  elections: "violet",
  bollywood: "rose",
};

function ClusterCover({ cluster }: { cluster: EventCluster }) {
  return (
    <div
      className={cn(
        "relative flex h-[88px] flex-col justify-center overflow-hidden bg-gradient-to-br px-4",
        accentGradients[themeAccents[cluster.theme]],
      )}
    >
      {/* Decorative shapes standing in for editorial cover art. */}
      <div className="absolute -top-10 -right-6 size-28 rounded-full bg-white/10" />
      <div className="absolute -right-12 bottom-[-3.5rem] size-32 rounded-full bg-white/10" />
      <span className="absolute right-5 text-4xl opacity-25" aria-hidden>
        {cluster.emoji}
      </span>
      <p className="relative flex items-center gap-2 text-sm font-bold tracking-wide text-white uppercase">
        <span aria-hidden>{cluster.emoji}</span>
        {cluster.title}
      </p>
      <p className="relative mt-1 text-xs font-medium text-white/80">
        {cluster.activeMarkets} Active Markets
      </p>
    </div>
  );
}

export function EventClusterCard({ cluster }: EventClusterCardProps) {
  return (
    <Card hoverable className="overflow-hidden">
      <ClusterCover cluster={cluster} />
      <div className="px-4 pt-1 pb-4">
        <ul className="divide-y divide-slate-100">
          {cluster.markets.map((market) => (
            <li key={market.title} className="flex items-center gap-2 py-2.5">
              <p className="flex-1 pr-1 text-[13px] leading-snug text-slate-600">
                {market.title}
              </p>
              <span className="text-sm font-bold text-slate-900">
                {market.probability}%
              </span>
              <TrendDelta
                delta={market.delta}
                className="min-w-12 justify-end text-xs"
              />
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            className="group flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-brand-600 transition-colors hover:text-brand-800"
          >
            View all {cluster.activeMarkets} markets
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
