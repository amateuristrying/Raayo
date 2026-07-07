import { Flame, Hourglass, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { MarketStatusTone } from "@/types";

interface StatusChipProps {
  label: string;
  tone: MarketStatusTone;
  className?: string;
}

const toneStyles: Record<MarketStatusTone, { classes: string; icon: LucideIcon }> = {
  breaking: { classes: "bg-red-50 text-red-600", icon: Zap },
  rising: { classes: "bg-orange-50 text-orange-600", icon: Flame },
  ending: { classes: "bg-amber-50 text-amber-700", icon: Hourglass },
};

/** Small colored market-status pill, e.g. "Breaking" / "Ending Soon". */
export function StatusChip({ label, tone, className }: StatusChipProps) {
  const { classes, icon: Icon } = toneStyles[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold",
        classes,
        className,
      )}
    >
      <Icon className="size-3" fill="currentColor" strokeWidth={0} />
      {label}
    </span>
  );
}
