import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { NotificationBadge } from "./NotificationBadge";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  badge?: number;
}

/** Square icon-only button with an optional notification badge. */
export function IconButton({
  icon,
  label,
  badge,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700",
        className,
      )}
      {...props}
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <NotificationBadge count={badge} className="absolute top-1 right-1" />
      )}
    </button>
  );
}
