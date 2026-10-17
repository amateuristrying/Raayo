import { cn } from "@/lib/cn";
import { EmojiTile } from "@/components/ui/EmojiTile";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { eventsPageData } from "@/data";
import { followsStore, isFollowing, toggleFollow } from "@/engine/follows";
import { useStore } from "@/engine/store";
import type { CalendarEntry, FollowedEvent, RecentEvent } from "@/types";
import { AskRaayo } from "./AskRaayo";
import { RailCard } from "./RailCard";

function CalendarItem({ entry }: { entry: CalendarEntry }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="w-14 shrink-0 text-xs font-bold text-slate-900">
        {entry.time}
      </span>
      <EmojiTile
        emoji={entry.emoji}
        accent={entry.accent}
        size="sm"
        shape="rounded"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-slate-800">
          {entry.title}
        </span>
        <span className="block truncate text-[11px] font-medium text-slate-400">
          {entry.location}
        </span>
      </span>
      <EventStatusBadge status={entry.status} />
    </li>
  );
}

function TodaysCalendarCard({ entries }: { entries: CalendarEntry[] }) {
  return (
    <RailCard variant="title" title="Today's Calendar" actionLabel="View all">
      <ul className="flex flex-col gap-3.5">
        {entries.map((entry) => (
          <CalendarItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </RailCard>
  );
}

function RecentlyAddedCard({ items }: { items: RecentEvent[] }) {
  return (
    <RailCard variant="title" title="Recently Added Events" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5">
            <EmojiTile emoji={item.emoji} accent={item.accent} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-slate-800">
                {item.title}
              </span>
              <span className="block text-[11px] font-medium text-slate-400">
                {item.meta}
              </span>
            </span>
            <span className="shrink-0 text-[11px] font-medium text-slate-400">
              {item.traders}
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function MostFollowedCard({ items }: { items: FollowedEvent[] }) {
  const follows = useStore(followsStore);
  return (
    <RailCard variant="title" title="Most Followed Events" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const following = isFollowing(follows, item.id);
          return (
            <li key={item.id} className="flex items-center gap-2.5">
              <EmojiTile emoji={item.emoji} accent={item.accent} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-slate-800">
                  {item.title}
                </span>
                <span className="block truncate text-[11px] font-medium text-slate-400">
                  {item.markets} Markets
                  <span className="mx-1">·</span>
                  {item.followers}
                </span>
              </span>
              <button
                type="button"
                aria-pressed={following}
                onClick={() => toggleFollow(item.id)}
                className={cn(
                  "flex h-7 shrink-0 cursor-pointer items-center rounded-lg border px-3 text-xs font-semibold transition-colors",
                  following
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-slate-200 text-brand-700 hover:border-brand-200 hover:bg-brand-50",
                )}
              >
                {following ? "Following" : "Follow"}
              </button>
            </li>
          );
        })}
      </ul>
    </RailCard>
  );
}

/** Right-rail column for the Events page. */
export function EventsRail() {
  const { rail } = eventsPageData;
  return (
    <aside className="anim-rail flex w-80 shrink-0 flex-col gap-5">
      <TodaysCalendarCard entries={rail.calendar} />
      <RecentlyAddedCard items={rail.recentlyAdded} />
      <MostFollowedCard items={rail.mostFollowed} />
      <AskRaayo />
    </aside>
  );
}
