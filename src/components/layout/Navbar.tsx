import { Link } from "react-router-dom";
import { Bell, ChevronDown, Plus, Search, Sun } from "lucide-react";
import { homeData } from "@/data";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="Raayo home">
      <span className="text-2xl font-black tracking-[-0.04em] text-brand-700">
        RAAYO
      </span>
    </Link>
  );
}

function GlobalSearch() {
  return (
    <div className="flex h-10 w-full max-w-xl items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 transition-all focus-within:border-brand-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
      <Search className="size-4 shrink-0 text-slate-400" />
      <input
        type="search"
        placeholder="Search markets, events, people, companies, teams..."
        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
      />
      <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
        /
      </kbd>
    </div>
  );
}

function ProfileMenu() {
  const { user } = homeData;
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2.5 rounded-xl py-1.5 pr-2 pl-1.5 transition-colors hover:bg-slate-100"
    >
      <Avatar name={user.name} size="sm" />
      <span className="text-sm font-semibold text-slate-800">{user.name}</span>
      <ChevronDown className="size-4 text-slate-400" />
    </button>
  );
}

/** Sticky 72px top navigation bar. */
export function Navbar() {
  const { user } = homeData;
  return (
    <header className="anim-nav sticky top-0 z-40 h-18 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-full items-center gap-6 px-6">
        <div className="w-44 shrink-0">
          <Logo />
        </div>
        <div className="flex flex-1 justify-start">
          <GlobalSearch />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button icon={<Plus className="size-4" />} className="mr-2">
            Create Market
          </Button>
          <IconButton
            icon={<Bell className="size-5" />}
            label="Notifications"
            badge={user.notifications}
          />
          <IconButton icon={<Sun className="size-5" />} label="Toggle theme" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
