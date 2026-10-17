import type { ReactNode } from "react";

type SectionHeaderVariant = "caps" | "title";

interface SectionHeaderProps {
  title: string;
  /** "caps" renders small-caps labels; "title" renders bold sentence case. */
  variant?: SectionHeaderVariant;
  subtitle?: string;
  /** Optional element rendered before the title, e.g. an icon chip. */
  leading?: ReactNode;
  /** Optional element rendered after the title, e.g. "Updated 2 min ago". */
  meta?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const titleClasses: Record<SectionHeaderVariant, string> = {
  caps: "text-xs font-bold tracking-[0.08em] text-slate-800 uppercase",
  title: "text-[15px] font-bold text-slate-900",
};

/** Section heading with an optional subtitle and "View all" action. */
export function SectionHeader({
  title,
  variant = "caps",
  subtitle,
  leading,
  meta,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {leading}
        <h2 className={titleClasses[variant]}>{title}</h2>
        {meta && <span className="text-[11px] text-slate-400">{meta}</span>}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="ml-auto cursor-pointer text-xs font-semibold text-brand-600 transition-colors hover:text-brand-800"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
