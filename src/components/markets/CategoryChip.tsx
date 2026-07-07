import { Users } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Category } from "@/types";

interface CategoryChipProps {
  category: Category;
  active: boolean;
  onSelect: (id: string) => void;
}

export function CategoryChip({ category, active, onSelect }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      aria-pressed={active}
      className={cn(
        "flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-200",
        active
          ? "border-brand-700 bg-brand-700 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:-translate-y-px hover:border-brand-200 hover:shadow-card",
      )}
    >
      {category.id === "following" && (
        <Users className={cn("size-4", active ? "text-white" : "text-slate-400")} />
      )}
      {category.emoji && <span className="text-[15px] leading-none">{category.emoji}</span>}
      {category.name}
      {category.count !== undefined && (
        <span
          className={cn(
            "text-[13px] font-medium",
            active ? "text-white/60" : "text-slate-400",
          )}
        >
          ({category.count})
        </span>
      )}
    </button>
  );
}
