import { cn } from "@/lib/cn";

interface EventStatusBadgeProps {
  status: "live" | "starting";
  className?: string;
}

/** Compact event status pill — solid green LIVE or soft amber Starting. */
export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide",
        status === "live"
          ? "bg-emerald-500 text-white"
          : "bg-amber-50 text-amber-600",
        className,
      )}
    >
      {status === "live" ? "LIVE" : "Starting"}
    </span>
  );
}
