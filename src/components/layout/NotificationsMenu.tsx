import { useRef, useState } from "react";
import {
  Bell,
  Clock,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import {
  markAllRead,
  notificationsStore,
  unreadCount,
  type NotificationTone,
} from "@/engine/notifications";
import { useStore } from "@/engine/store";
import { useClickOutside } from "@/hooks/useClickOutside";

const toneStyles: Record<NotificationTone, { icon: LucideIcon; classes: string }> = {
  up: { icon: TrendingUp, classes: "bg-emerald-50 text-emerald-600" },
  down: { icon: TrendingDown, classes: "bg-red-50 text-red-500" },
  spike: { icon: Zap, classes: "bg-amber-50 text-amber-500" },
  info: { icon: Clock, classes: "bg-sky-50 text-sky-500" },
  win: { icon: Trophy, classes: "bg-amber-50 text-amber-600" },
};

/** Bell button with a live unread badge and a notifications panel. */
export function NotificationsMenu() {
  const notifications = useStore(notificationsStore);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setOpen(false), open);

  const unread = unreadCount(notifications);

  return (
    <div ref={containerRef} className="relative">
      <IconButton
        icon={<Bell className="size-5" />}
        label="Notifications"
        badge={unread}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card-hover">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-bold text-slate-900">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="cursor-pointer text-xs font-semibold text-brand-600 transition-colors hover:text-brand-800"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const { icon: Icon, classes } = toneStyles[notification.tone];
              return (
                <li
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-2.5 px-4 py-3",
                    !notification.read && "bg-brand-50/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      classes,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] leading-snug text-slate-700">
                      {notification.text}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
                      {notification.time}
                    </span>
                  </span>
                  {!notification.read && (
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
