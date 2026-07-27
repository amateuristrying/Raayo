import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types";
import { CategoryChip } from "./CategoryChip";

interface CategoryPillsProps {
  categories: Category[];
  /** Controlled active pill id; omit for internal state. */
  value?: string;
  onChange?: (id: string) => void;
}

/** Horizontal category filter with an overflow scroll affordance. */
export function CategoryPills({ categories, value, onChange }: CategoryPillsProps) {
  const [internal, setInternal] = useState<string>(categories[0]?.id ?? "all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeId = value ?? internal;
  const select = (id: string) => {
    setInternal(id);
    onChange?.(id);
  };

  const scrollForward = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="no-scrollbar flex items-center gap-2.5 overflow-x-auto pr-14"
      >
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            category={category}
            active={category.id === activeId}
            onSelect={select}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex w-24 items-center justify-end bg-gradient-to-l from-surface via-surface/80 to-transparent">
        <button
          type="button"
          aria-label="Scroll categories"
          onClick={scrollForward}
          className="pointer-events-auto flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-float transition-all hover:-translate-y-px hover:text-brand-700"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
