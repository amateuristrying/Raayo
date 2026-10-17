import { Bot, Sparkles } from "lucide-react";
import type { AiPulse } from "@/types";
import { RailCard } from "./RailCard";

interface AiDailyPulseProps {
  pulse: AiPulse;
}

export function AiDailyPulse({ pulse }: AiDailyPulseProps) {
  return (
    <RailCard
      title="Daily Pulse"
      leading={
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-700 text-white">
          <Bot className="size-4" />
        </span>
      }
      meta="Sample editorial briefing"
    >
      <ul className="flex flex-col gap-2.5">
        {pulse.points.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 fill-brand-400 text-brand-500" />
            <span className="text-[13px] leading-snug font-medium text-slate-700">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}
