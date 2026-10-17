import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { EmojiTile } from "@/components/ui/EmojiTile";
import type { CategoryGridItem } from "@/types";

interface CategoryGridCardProps {
  category: CategoryGridItem;
}

/** Compact directory tile in the "All Categories" grid. */
export const CategoryGridCard = memo(function CategoryGridCard({
  category,
}: CategoryGridCardProps) {
  const navigate = useNavigate();
  return (
    <Card hoverable className="anim-item flex cursor-pointer flex-col p-3.5" onClick={() => navigate(`/search?${new URLSearchParams({ q: category.name, type: "Category" })}`)}>
      <div className="flex items-start gap-2.5">
        <EmojiTile
          emoji={category.emoji}
          accent={category.accent}
          variant="soft"
          shape="rounded"
          size="sm"
        />
        <div className="min-w-0">
          <h3 className="truncate text-[13px] leading-tight font-bold text-slate-900">
            {category.name}
          </h3>
          <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
            {category.description}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-1 border-t border-slate-100 pt-2 text-[9px] font-medium text-slate-400">
        <span className="truncate">
          <span className="font-bold text-slate-700">{category.markets}</span>{" "}
          Markets
          <span className="mx-0.5">·</span>
          <span className="font-bold text-slate-700">{category.events}</span>{" "}
          Events
          <span className="mx-0.5">·</span>
          <span className="font-bold text-slate-700">
            {category.predictions}
          </span>{" "}
          Pred.
        </span>
        <span className="shrink-0 text-[10px] font-bold text-slate-500">
          <span aria-hidden>🔥</span> {category.today}
        </span>
      </div>
    </Card>
  );
});
