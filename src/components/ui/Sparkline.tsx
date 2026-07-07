import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "@/lib/cn";
import type { TrendDirection } from "@/types";

interface SparklineProps {
  data: number[];
  direction?: TrendDirection;
  /** Explicit stroke color; overrides the direction-based color. */
  stroke?: string;
  className?: string;
}

const strokeByDirection: Record<TrendDirection, string> = {
  up: "#10b981",
  down: "#ef4444",
};

/** Tiny inline trend chart used in market rows and stat cards. */
export function Sparkline({
  data,
  direction = "up",
  stroke,
  className,
}: SparklineProps) {
  const points = data.map((value, index) => ({ index, value }));
  const min = Math.min(...data);
  const max = Math.max(...data);

  return (
    <div className={cn("h-9 w-28", className)} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <YAxis hide domain={[min - 2, max + 2]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke ?? strokeByDirection[direction]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
