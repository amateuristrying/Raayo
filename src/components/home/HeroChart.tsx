import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { HeroPoint } from "@/types";

interface HeroChartProps {
  series: HeroPoint[];
  probability: number;
}

const HOUR_LABELS: Record<number, string> = {
  0: "12 AM",
  6: "6 AM",
  12: "12 PM",
  18: "6 PM",
  24: "Now",
};

const AXIS_TICK = { fill: "rgba(255,255,255,0.45)", fontSize: 11 } as const;
const LINE_COLOR = "#8b7cf7";

/** Probability-over-time area chart rendered inside the dark hero card. */
export function HeroChart({ series, probability }: HeroChartProps) {
  const last = series[series.length - 1];

  // Draw-in animation on mount only; live data updates must not redraw the
  // whole line every tick.
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="anim-chart relative h-full min-h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 12, right: 14, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.45} />
              <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="hour"
            type="number"
            domain={[0, 24]}
            ticks={[0, 6, 12, 18, 24]}
            tickFormatter={(hour: number) => HOUR_LABELS[hour] ?? ""}
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[20, 40, 60, 80, 100]}
            tickFormatter={(value: number) => `${value}%`}
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            width={42}
          />
          <Area
            type="linear"
            dataKey="value"
            stroke={LINE_COLOR}
            strokeWidth={2.5}
            fill="url(#heroArea)"
            isAnimationActive={animate}
            animationDuration={1600}
            dot={false}
          />
          <ReferenceDot
            x={last.hour}
            y={last.value}
            r={4.5}
            fill="#ffffff"
            stroke={LINE_COLOR}
            strokeOpacity={0.4}
            strokeWidth={7}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Floating "now" badge anchored near the line's endpoint. */}
      <div className="absolute top-8 right-0 rounded-xl bg-white px-3 py-1.5 text-center shadow-float">
        <p className="text-[15px] leading-tight font-bold text-slate-900">
          {probability}%
        </p>
        <p className="text-[10px] leading-tight font-medium text-slate-400">Now</p>
      </div>
    </div>
  );
}
