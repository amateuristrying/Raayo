import { cn } from "@/lib/cn";
import type { Delta } from "@/types";

interface TrendDeltaProps {
  delta: Delta;
  /** Trailing window annotation, e.g. "24h" renders "(24h)". */
  window?: string;
  /** When true, renders on dark surfaces with brighter tones. */
  onDark?: boolean;
  className?: string;
}

function TriangleIcon({ up }: { up: boolean }) {
  return (
    <svg
      viewBox="0 0 8 8"
      className={cn("size-2 shrink-0", !up && "rotate-180")}
      aria-hidden
    >
      <path d="M4 0.5 7.5 6.5H0.5Z" fill="currentColor" />
    </svg>
  );
}

/** Signed probability change, e.g. "▲ 8%" green or "▼ 3%" red. */
export function TrendDelta({ delta, window, onDark, className }: TrendDeltaProps) {
  const up = delta.direction === "up";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold whitespace-nowrap",
        up
          ? onDark
            ? "text-emerald-400"
            : "text-emerald-600"
          : onDark
            ? "text-red-400"
            : "text-red-500",
        className,
      )}
    >
      <TriangleIcon up={up} />
      {delta.value}%{window ? ` (${window})` : ""}
    </span>
  );
}
