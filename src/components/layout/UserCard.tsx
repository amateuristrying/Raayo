import { BadgeCheck, Coins, Flame } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { CountUp } from "@/components/ui/CountUp";
import type { User } from "@/types";

interface UserCardProps {
  user: User;
}

interface StatProps {
  value: string;
  label: string;
  accent?: boolean;
}

function Stat({ value, label, accent = false }: StatProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5">
      <span className="flex items-center gap-0.5 text-[13px] font-bold text-slate-800">
        {value}
        {accent && <Flame className="size-3 fill-orange-400 text-orange-500" />}
      </span>
      <span className="text-[10px] font-medium text-slate-400">{label}</span>
    </div>
  );
}

/** Signed-in user summary pinned to the bottom of the sidebar. */
export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-card">
      <div className="flex items-center gap-2.5">
        <Avatar name={user.name} size="md" />
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-sm font-semibold text-slate-900">
            {user.name}
            {user.verified && (
              <BadgeCheck className="size-3.5 shrink-0 text-brand-500" />
            )}
          </p>
          <p className="truncate text-xs text-slate-400">{user.handle}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-100 pt-3">
        <Stat value={user.rank} label="Rank" />
        <Stat value={user.accuracy} label="Accuracy" />
        <Stat value={String(user.winStreak)} label="Win Streak" accent />
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
        <p className="text-[10px] font-medium text-slate-400">Points Balance</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[15px] font-bold text-slate-900">
          <Coins className="size-4 text-amber-500" />
          <CountUp value={user.pointsBalance} grouped />
        </p>
      </div>
    </div>
  );
}
