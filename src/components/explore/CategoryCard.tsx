import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { accentGradients } from "@/lib/accents";
import { Card } from "@/components/ui/Card";
import type { ExploreCategory } from "@/types";

interface CategoryCardProps {
  category: ExploreCategory;
}

/** Rich category tile with cover art and related topics. */
export const CategoryCard = memo(function CategoryCard({
  category,
}: CategoryCardProps) {
  const navigate = useNavigate();
  return (
    <Card hoverable className="anim-item cursor-pointer overflow-hidden" onClick={() => navigate(`/search?${new URLSearchParams({ q: category.name, type: "Category" })}`)}>
      <div
        className={cn(
          "relative flex h-20 items-center justify-center overflow-hidden bg-gradient-to-br",
          accentGradients[category.accent],
        )}
      >
        <div className="absolute -top-8 -right-6 size-20 rounded-full bg-white/10" />
        <span className="relative text-4xl drop-shadow-sm" aria-hidden>
          {category.emoji}
        </span>
      </div>
      <div className="p-3.5">
        <p className="text-[15px] font-bold text-slate-900">{category.name}</p>
        <p className="mt-0.5 text-[11px] font-medium text-slate-400">
          <span className="font-semibold text-slate-700">
            {category.markets} Markets
          </span>
          <span className="mx-1">·</span>
          {category.traders} Traders
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {category.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
});
