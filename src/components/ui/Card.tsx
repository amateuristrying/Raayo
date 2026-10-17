import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

/** White rounded surface used across the app. */
export function Card({ hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-card",
        hoverable &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        className,
      )}
      {...props}
      role={props.role ?? (props.onClick ? "button" : undefined)}
      tabIndex={props.tabIndex ?? (props.onClick ? 0 : undefined)}
      onKeyDown={props.onKeyDown ?? (props.onClick ? (event) => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          event.currentTarget.click();
        }
      } : undefined)}
    />
  );
}
