import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AiPulse } from "@/types";
import { RailCard } from "./RailCard";

interface AiDailyPulseProps {
  pulse: AiPulse;
}

export function AiDailyPulse({ pulse }: AiDailyPulseProps) {
  return (
    <RailCard
      title="AI Daily Pulse"
      leading={
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-700 text-white">
          <Bot className="size-4" />
        </span>
      }
      meta={`Updated ${pulse.updated}`}
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
      <Button variant="ghost" size="sm" className="mt-4">
        Read full pulse
        <ArrowRight className="size-3.5" />
      </Button>
    </RailCard>
  );
}
