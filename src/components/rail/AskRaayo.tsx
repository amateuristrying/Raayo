import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface AskRaayoProps {
  prompts: string[];
}

/** AI assistant entry point pinned to the bottom of the rail. */
export function AskRaayo({ prompts }: AskRaayoProps) {
  return (
    <Card className="border-brand-100 bg-brand-50/60 p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
          <Bot className="size-5" />
        </span>
        <span>
          <span className="block text-[15px] leading-tight font-bold text-slate-900">
            Ask Raayo
          </span>
          <span className="block text-[11px] leading-tight font-medium text-slate-400">
            AI Assistant
          </span>
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-0.5">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-medium text-slate-600 transition-colors hover:bg-white hover:text-brand-700"
          >
            <ArrowRight className="size-3.5 shrink-0 text-brand-400 transition-transform group-hover:translate-x-0.5" />
            {prompt}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 flex h-11 w-full cursor-pointer items-center justify-between rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="size-4" />
          Open AI Assistant
        </span>
        <ArrowRight className="size-4" />
      </button>
    </Card>
  );
}
