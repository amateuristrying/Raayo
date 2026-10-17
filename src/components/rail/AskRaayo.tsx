import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";

export function AskRaayo() {
  return (
    <Card className="border-brand-100 bg-brand-50/60 p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
          <BookOpen className="size-5" />
        </span>
        <span>
          <span className="block text-[15px] leading-tight font-bold text-slate-900">
            Understanding predictions
          </span>
          <span className="block text-[11px] leading-tight font-medium text-slate-400">
            Probability, context, evidence
          </span>
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-0.5">
        {[
          { label: "Probabilities and resolution", to: "/learn" },
          { label: "Find an event to follow", to: "/search?type=Event" },
          { label: "Your watchlist", to: "/watchlist" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-medium text-slate-600 transition-colors hover:bg-white hover:text-brand-700"
          >
            <ArrowRight className="size-3.5 shrink-0 text-brand-400 transition-transform group-hover:translate-x-0.5" />
            {item.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
