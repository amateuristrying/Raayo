import { ArrowRight, Compass, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { SearchChip } from "@/components/ui/SearchChip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TrendingSearch } from "@/types";

interface DiscoveryCardProps {
  searches: TrendingSearch[];
}

/** Trending searches + natural-language suggestions, side by side. */
export function DiscoveryCard({ searches }: DiscoveryCardProps) {
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
          title="Choose a starting point"
          leading={<Compass className="size-4 text-slate-500" />}
        />
        <div className="mt-3.5 flex flex-col gap-2.5">
          {[
            { type: "Event", label: "Follow a real-world event" },
            { type: "Entity", label: "Discover people and organizations" },
            { type: "Market", label: "Explore prediction questions" },
          ].map((item) => (
            <Link
              key={item.type}
              to={`/search?type=${item.type}`}
              className="anim-chip flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-sm font-medium text-slate-700 hover:text-brand-700"
            >
              {item.label}
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
