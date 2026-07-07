import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmojiTile } from "@/components/ui/EmojiTile";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { OutcomeChip } from "@/components/ui/OutcomeChip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categoriesPageData } from "@/data";
import type {
  ResolvedTopic,
  TopEntity,
  TrendingTopic,
  UpcomingEvent,
} from "@/types";
import { RailCard } from "./RailCard";

function TrendingTopicsCard({ topics }: { topics: TrendingTopic[] }) {
  return (
    <RailCard
      variant="title"
      title="Trending Topics"
      meta="(All Categories)"
      actionLabel="View all"
    >
      <ul className="flex flex-col gap-3">
        {topics.map((topic) => (
          <li key={topic.id} className="flex items-center gap-2.5">
            <span className="w-4 text-center text-[13px] font-semibold text-slate-400">
              {topic.rank}
            </span>
            <span className="text-sm" aria-hidden>
              {topic.emoji}
            </span>
            <span className="flex-1 truncate text-[13px] font-semibold text-slate-800">
              {topic.name}
            </span>
            <EventStatusBadge status={topic.status} />
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function UpcomingEventsCard({ events }: { events: UpcomingEvent[] }) {
  return (
    <RailCard variant="title" title="Upcoming Events" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {events.map((event) => (
          <li key={event.id} className="flex items-center gap-2.5">
            <EmojiTile emoji={event.emoji} accent={event.accent} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-slate-800">
                {event.title}
              </span>
              <span className="block text-[11px] font-medium text-slate-400">
                {event.starts}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function TopEntitiesCard({ entities }: { entities: TopEntity[] }) {
  return (
    <RailCard
      variant="title"
      title="Top Entities Across Categories"
      actionLabel="View all"
    >
      <ul className="flex flex-col gap-3">
        {entities.map((entity) => (
          <li key={entity.id} className="flex items-center gap-2.5">
            <EmojiTile emoji={entity.emoji} accent={entity.accent} />
            <span className="flex-1 truncate text-[13px] font-semibold text-slate-800">
              {entity.name}
            </span>
            <span className="shrink-0 text-[11px] font-medium text-slate-400">
              {entity.type}
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function RecentlyResolvedCard({ topics }: { topics: ResolvedTopic[] }) {
  return (
    <RailCard variant="title" title="Recently Resolved" actionLabel="View all">
      <ul className="flex flex-col gap-3">
        {topics.map((topic) => (
          <li key={topic.id} className="flex items-center gap-2">
            <span className="flex-1 truncate text-[13px] font-medium text-slate-700">
              {topic.title}
            </span>
            <OutcomeChip outcome={topic.outcome} className="text-[10px]" />
            <span className="text-[13px] font-bold text-slate-900">
              {topic.probability}%
            </span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

function AiSummaryCard({
  summary,
}: {
  summary: { updated: string; text: string };
}) {
  return (
    <Card className="p-4">
      <SectionHeader
        variant="title"
        title="AI Summary"
        meta={`Updated ${summary.updated}`}
        leading={
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-700 text-white">
            <Sparkles className="size-4" />
          </span>
        }
      />
      <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
        {summary.text}
      </p>
      <button
        type="button"
        className="mt-3.5 flex h-10 w-full cursor-pointer items-center justify-between rounded-xl bg-slate-100 px-3.5 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-200/70"
      >
        Read full analysis
        <ArrowRight className="size-4" />
      </button>
    </Card>
  );
}

/** Right-rail column for the Categories page. */
export function CategoriesRail() {
  const { rail } = categoriesPageData;
  return (
    <aside className="anim-rail flex w-80 shrink-0 flex-col gap-5">
      <TrendingTopicsCard topics={rail.trendingTopics} />
      <UpcomingEventsCard events={rail.upcomingEvents} />
      <TopEntitiesCard entities={rail.topEntities} />
      <RecentlyResolvedCard topics={rail.recentlyResolved} />
      <AiSummaryCard summary={rail.aiSummary} />
    </aside>
  );
}
