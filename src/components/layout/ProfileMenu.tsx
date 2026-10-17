import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  ChartPie,
  ChevronDown,
  Star,
  BookOpen,
  History,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { homeData } from "@/data";
import { useClickOutside } from "@/hooks/useClickOutside";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

function MenuItem({ icon: Icon, label, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
    >
      <Icon className="size-4 text-slate-400" />
      {label}
    </button>
  );
}

/** Avatar button with the account menu. */
export function ProfileMenu() {
  const { user } = homeData;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useClickOutside(containerRef, () => setOpen(false), open);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl py-1.5 pr-2 pl-1.5 transition-colors hover:bg-slate-100"
      >
        <Avatar name={user.name} size="sm" />
        <span className="profile-name text-sm font-semibold text-slate-800">{user.name}</span>
        <ChevronDown className="size-4 text-slate-400" />
      </button>

      {open && (
        <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-1.5 shadow-card-hover">
          <div className="border-b border-slate-100 px-3.5 pt-2 pb-2.5">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-400">Local demo profile</p>
          </div>
          <div className="py-1">
            <MenuItem icon={ChartPie} label="Portfolio" onClick={() => go("/portfolio")} />
            <MenuItem icon={Bookmark} label="Bookmarks" onClick={() => go("/bookmarks")} />
            <MenuItem icon={Star} label="Watchlist" onClick={() => go("/watchlist")} />
          </div>
          <div className="border-t border-slate-100 py-1">
            <MenuItem icon={BookOpen} label="About predictions" onClick={() => go("/learn")} />
            <MenuItem icon={History} label="Changelog" onClick={() => go("/changelog")} />
          </div>
        </div>
      )}
    </div>
  );
}
