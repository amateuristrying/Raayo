import { memo } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import type { ProbabilityBucket, ProbabilityTone } from "@/types";

interface ProbabilityCardProps {
  bucket: ProbabilityBucket;
}

const toneStyles: Record<ProbabilityTone, { text: string; stroke: string }> = {
  red: { text: "text-red-500", stroke: "#ef4444" },
  amber: { text: "text-amber-500", stroke: "#f59e0b" },
  slate: { text: "text-slate-500", stroke: "#64748b" },
  sky: { text: "text-sky-500", stroke: "#0ea5e9" },
  emerald: { text: "text-emerald-600", stroke: "#10b981" },
};

/** Lightweight probability-bucket tile with a tiny sparkline. */
export const ProbabilityCard = memo(function ProbabilityCard({
  bucket,
}: ProbabilityCardProps) {
  const tone = toneStyles[bucket.tone];
  return (
    <Card className="anim-item p-4">
      <p className={cn("text-lg leading-tight font-bold", tone.text)}>
        {bucket.range}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-700">{bucket.label}</p>
      <p className="mt-1 text-[11px] font-medium text-slate-400">
        {bucket.markets} markets
      </p>
      <Sparkline
        data={bucket.spark}
        stroke={tone.stroke}
        className="mt-2 h-8 w-full"
      />
    </Card>
  );
});
