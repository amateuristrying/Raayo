import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { NotificationBadge } from "@/components/ui/NotificationBadge";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  /** Route path; items without one render as inert placeholders. */
  to?: string;
  badge?: number;
}

const baseClasses =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors";
const idleClasses =
  "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900";
const activeClasses = "bg-brand-50 font-semibold text-brand-700";

interface ItemBodyProps extends Pick<SidebarItemProps, "icon" | "label" | "badge"> {
  active: boolean;
}

function ItemBody({ icon: Icon, label, badge, active }: ItemBodyProps) {
  return (
    <>
      <Icon
        className={cn("size-[18px]", active ? "text-brand-700" : "text-slate-400")}
        strokeWidth={active ? 2.2 : 2}
      />
      <span className="truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <NotificationBadge count={badge} tone="brand" className="ml-auto" />
      )}
    </>
  );
}

export function SidebarItem({ icon, label, to, badge }: SidebarItemProps) {
  if (!to) {
    return (
      <a href="#" className={cn(baseClasses, idleClasses)}>
        <ItemBody icon={icon} label={label} badge={badge} active={false} />
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(baseClasses, isActive ? activeClasses : idleClasses)
      }
    >
      {({ isActive }) => (
        <ItemBody icon={icon} label={label} badge={badge} active={isActive} />
      )}
    </NavLink>
  );
}
