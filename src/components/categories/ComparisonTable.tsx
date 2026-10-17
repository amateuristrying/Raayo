import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sparkline } from "@/components/ui/Sparkline";
import { TrendDelta } from "@/components/ui/TrendDelta";
import type { CategoryComparisonRow } from "@/types";

interface ComparisonTableProps {
  rows: CategoryComparisonRow[];
}

const HEADERS = [
  "Category",
  "Markets",
  "Events",
  "Predictions (30D)",
  "Avg. Accuracy",
  "Trend",
];

/** Side-by-side category statistics with tiny sparklines. */
export function ComparisonTable({ rows }: ComparisonTableProps) {
  return (
    <Card className="anim-rise min-w-0 overflow-x-auto p-4">
      <SectionHeader
        variant="title"
        title="Category Comparison"
        actionLabel="View full comparison"
      />
      <table className="mt-2 w-full">
        <thead>
          <tr>
            {HEADERS.map((header) => (
              <th
                key={header}
                className="py-2 text-left text-[9px] font-bold tracking-[0.06em] whitespace-nowrap text-slate-400 uppercase not-first:pl-3"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              <td className="py-2.5 pr-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap text-slate-800">
                  <span aria-hidden>{row.emoji}</span>
                  {row.name}
                </span>
              </td>
              <td className="py-2.5 pl-3 text-xs font-medium text-slate-600">
                {row.markets}
              </td>
              <td className="py-2.5 pl-3 text-xs font-medium text-slate-600">
                {row.events}
              </td>
              <td className="py-2.5 pl-3 text-xs font-medium text-slate-600">
                {row.predictions30d}
              </td>
              <td className="py-2.5 pl-3 text-xs font-bold text-slate-800">
                {row.accuracy}
              </td>
              <td className="py-2.5 pl-3">
                <span className="flex items-center gap-1.5">
                  <Sparkline data={row.spark} className="h-5 w-14" />
                  <TrendDelta delta={row.delta} className="text-[10px]" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
