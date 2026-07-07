import { cn } from "@/lib/cn";

interface OutcomeChipProps {
  outcome: "Yes" | "No";
  className?: string;
}

/** Resolution outcome pill — green for Yes, red for No. */
export function OutcomeChip({ outcome, className }: OutcomeChipProps) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-xs font-bold",
        outcome === "Yes"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-500",
        className,
      )}
    >
      {outcome}
    </span>
  );
}
