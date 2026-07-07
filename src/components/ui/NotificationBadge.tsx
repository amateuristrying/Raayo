import { cn } from "@/lib/cn";

interface NotificationBadgeProps {
  count: number;
  /** Brand-dark variant used inside the sidebar. */
  tone?: "danger" | "brand";
  className?: string;
}

export function NotificationBadge({
  count,
  tone = "danger",
  className,
}: NotificationBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold text-white",
        tone === "danger" ? "bg-red-500" : "bg-brand-700",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
