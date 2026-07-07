import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { MonthCardData } from "@/types";

interface BrowseByMonthProps {
  months: MonthCardData[];
}

const MonthCard = memo(function MonthCard({ month }: { month: MonthCardData }) {
  return (
    <button
      type="button"
      className={cn(
        "anim-item flex h-[92px] min-w-0 flex-1 cursor-pointer flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card",
        month.current
          ? "border-brand-300 bg-brand-50/70 ring-2 ring-brand-100"
          : "border-slate-200 bg-white",
      )}
    >
      <span className="w-full text-[11px] leading-tight font-bold text-slate-900">
        {month.name}
      </span>
      <span className="mt-0.5 text-[10px] font-medium text-slate-400">
        {month.events} Events
      </span>
      {month.icons.length > 0 && (
        <span className="mt-auto text-[11px] tracking-tight" aria-hidden>
          {month.icons.join(" ")}
        </span>
      )}
    </button>
  );
});

/** Month tiles for time-based browsing; current month highlighted. */
export function BrowseByMonth({ months }: BrowseByMonthProps) {
  return (
    <section className="relative min-w-0">
      <SectionHeader
        variant="title"
        title="Browse by Month"
        className="anim-rise mb-3.5"
      />
      <div className="flex gap-3 pr-6">
        {months.map((month) => (
          <MonthCard key={month.id} month={month} />
        ))}
      </div>
      <button
        type="button"
        aria-label="Scroll months"
        className="absolute top-1/2 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-float transition-all hover:-translate-y-px hover:text-brand-700"
      >
        <ChevronRight className="size-4" />
      </button>
    </section>
  );
}
