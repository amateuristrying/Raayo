import { TrendingDown, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AlertTone, LiveAlert } from "@/types";
import { RailCard } from "./RailCard";

interface LiveAlertsProps {
  alerts: LiveAlert[];
}

const toneStyles: Record<
  AlertTone,
  { iconClasses: string; emphasisClasses: string; icon: LucideIcon }
> = {
  up: {
    iconClasses: "bg-emerald-50 text-emerald-600",
    emphasisClasses: "text-emerald-600",
    icon: TrendingUp,
  },
  down: {
    iconClasses: "bg-red-50 text-red-500",
    emphasisClasses: "text-red-500",
    icon: TrendingDown,
  },
  spike: {
    iconClasses: "bg-amber-50 text-amber-500",
    emphasisClasses: "text-amber-600",
    icon: Zap,
  },
};

function AlertRow({ alert }: { alert: LiveAlert }) {
  const { iconClasses, emphasisClasses, icon: Icon } = toneStyles[alert.tone];
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          iconClasses,
        )}
      >
        <Icon className="size-4" />
      </span>
      <p className="flex-1 text-[13px] leading-snug text-slate-500">
        {alert.quoted && (
          <span className="font-semibold text-slate-800">
            &ldquo;{alert.quoted}&rdquo;{" "}
          </span>
        )}
        {alert.text}
        {alert.emphasis && (
          <span className={cn("font-semibold", emphasisClasses)}>
            {" "}
            {alert.emphasis}
          </span>
        )}
      </p>
      <span className="pt-0.5 text-[11px] whitespace-nowrap text-slate-400">
        {alert.time}
      </span>
    </li>
  );
}

export function LiveAlerts({ alerts }: LiveAlertsProps) {
  return (
    <RailCard title="Live Alerts" actionLabel="View all">
      <ul className="flex flex-col gap-3.5">
        {alerts.map((alert) => (
          <AlertRow key={alert.id} alert={alert} />
        ))}
      </ul>
    </RailCard>
  );
}
