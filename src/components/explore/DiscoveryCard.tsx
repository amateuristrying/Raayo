import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SearchChip } from "@/components/ui/SearchChip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AiPrompt, TrendingSearch } from "@/types";

interface DiscoveryCardProps {
  searches: TrendingSearch[];
  prompts: AiPrompt[];
}

function PromptChip({ prompt }: { prompt: AiPrompt }) {
  return (
    <button
      type="button"
      className="anim-chip group flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-brand-50/70 px-3.5 py-2.5 text-left text-[13px] font-medium text-slate-700 transition-all duration-200 hover:-translate-y-px hover:bg-brand-50 hover:shadow-card"
    >
      {prompt.text}
      <ArrowRight className="size-3.5 shrink-0 text-brand-500 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/** Trending searches + natural-language suggestions, side by side. */
export function DiscoveryCard({ searches, prompts }: DiscoveryCardProps) {
  return (
    <Card className="anim-rise grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6 p-5">
      <div>
        <SectionHeader
          variant="title"
          title="Trending Searches"
          leading={<TrendingUp className="size-4 text-slate-500" />}
        />
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {searches.map((search) => (
            <SearchChip
              key={search.id}
              emoji={search.emoji}
              label={search.label}
              className="anim-chip"
            />
          ))}
        </div>
      </div>

      <div className="border-l border-slate-100 pl-6">
        <SectionHeader
          variant="title"
          title="Try asking..."
          leading={<Sparkles className="size-4 text-slate-500" />}
          actionLabel="View all"
        />
        <div className="mt-3.5 flex flex-col gap-2.5">
          {prompts.map((prompt) => (
            <PromptChip key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </Card>
  );
}
