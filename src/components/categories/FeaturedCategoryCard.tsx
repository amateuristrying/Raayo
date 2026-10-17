import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { accentGradients } from "@/lib/accents";
import { Card } from "@/components/ui/Card";
import { EmojiTile } from "@/components/ui/EmojiTile";
import type { FeaturedCategory } from "@/types";

interface FeaturedCategoryCardProps {
  category: FeaturedCategory;
}

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <span>
      <span className="block text-[15px] leading-tight font-bold text-slate-900">
        {value}
      </span>
      <span className="block text-[10px] leading-tight font-medium text-slate-400">
        {label}
      </span>
    </span>
  );
}

/** Editorial landing-page card for a featured category. */
export const FeaturedCategoryCard = memo(function FeaturedCategoryCard({
  category,
}: FeaturedCategoryCardProps) {
  const navigate = useNavigate();
  return (
    <Card hoverable className="anim-item cursor-pointer overflow-hidden" onClick={() => navigate(`/search?${new URLSearchParams({ q: category.name, type: "Category" })}`)}>
      <div className="relative">
        <div
          className={cn(
            "relative flex h-24 items-center justify-center overflow-hidden bg-gradient-to-br",
            accentGradients[category.accent],
          )}
        >
          <div className="absolute -top-8 -right-8 size-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-6 size-24 rounded-full bg-white/10" />
          <span className="relative text-4xl opacity-90 drop-shadow-sm" aria-hidden>
            {category.emoji}
          </span>
        </div>
        <EmojiTile
          emoji={category.emoji}
          accent={category.accent}
          size="lg"
          className="absolute left-4 -bottom-6 ring-4 ring-white shadow-card"
        />
      </div>

      <div className="px-4 pt-8 pb-4">
        <h3 className="text-[17px] font-bold text-brand-900">{category.name}</h3>
        <p className="mt-1 min-h-8 text-[11px] leading-relaxed text-slate-500">
          {category.description}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat value={String(category.markets)} label="Markets" />
          <Stat value={String(category.events)} label="Events" />
          <Stat value={category.predictions} label="Predictions" />
        </div>

        <p className="mt-3 truncate border-t border-slate-100 pt-2.5 text-[11px] font-medium text-slate-400">
          Trending:{" "}
          {category.trending.map((topic, index) => (
            <span key={topic} className="font-semibold text-brand-700">
              {index > 0 && <span className="mx-1 text-slate-300">·</span>}
              {topic}
            </span>
          ))}
        </p>
      </div>
    </Card>
  );
});
