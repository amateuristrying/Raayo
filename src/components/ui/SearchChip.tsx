import { cn } from "@/lib/cn";
import { useNavigate } from "react-router-dom";

interface SearchChipProps {
  label: string;
  emoji?: string;
  className?: string;
}

/** Tappable search suggestion chip. */
export function SearchChip({ label, emoji, className }: SearchChipProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/search?${new URLSearchParams({ q: label })}`)}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-px hover:border-brand-200 hover:shadow-card",
        className,
      )}
    >
      {emoji && <span aria-hidden>{emoji}</span>}
      {label}
    </button>
  );
}
