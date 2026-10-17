import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Accent, EventCategoryFilter, EventStatusFilter } from "@/types";

interface EventFiltersProps {
  statusFilters: EventStatusFilter[];
  categoryFilters: EventCategoryFilter[];
  activeStatus: string;
  activeCategory: string;
  onStatus: (value: string) => void;
  onCategory: (value: string) => void;
}

const dotClasses: Record<Accent, string> = {
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  indigo: "bg-indigo-400",
  orange: "bg-orange-500",
  slate: "bg-slate-300",
};

interface FilterPillProps {
  label: string;
  active?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}

function FilterPill({
  label,
  active,
  leading,
  trailing,
  onClick,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-all duration-200",
        active
          ? "border-brand-700 bg-brand-700 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:-translate-y-px hover:border-brand-200 hover:shadow-card",
      )}
    >
      {leading}
      {label}
      {trailing}
    </button>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase">
      {children}
    </p>
  );
}

/** Status + category filter pills with the calendar-view toggle. */
export function EventFilters({
  statusFilters,
  categoryFilters,
  activeStatus,
  activeCategory,
  onStatus,
  onCategory,
}: EventFiltersProps) {
  return (
    <div className="anim-rise flex items-start justify-between gap-4">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <div>
          <GroupLabel>Status</GroupLabel>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <FilterPill
                key={filter.id}
                label={filter.label}
                active={filter.id === activeStatus}
                onClick={() => onStatus(filter.id)}
                leading={
                  filter.dot && (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        dotClasses[filter.dot],
                      )}
                    />
                  )
                }
              />
            ))}
          </div>
        </div>
        <div>
          <GroupLabel>Category</GroupLabel>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              label="All subjects"
              active={activeCategory === "all"}
              onClick={() => onCategory("all")}
            />
            {categoryFilters
              .filter((filter) => !filter.more)
              .map((filter) => (
                <FilterPill
                  key={filter.id}
                  label={filter.label}
                  active={filter.id === activeCategory}
                  onClick={() => onCategory(filter.id)}
                  leading={
                    filter.emoji && <span aria-hidden>{filter.emoji}</span>
                  }
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
