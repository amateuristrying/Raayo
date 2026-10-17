import { memo } from "react";
import { EmojiTile } from "@/components/ui/EmojiTile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { LiveEventData } from "@/types";

interface LiveNowStripProps {
  items: LiveEventData[];
}

const LiveEventCard = memo(function LiveEventCard({
  item,
}: {
  item: LiveEventData;
}) {
  return (
    <div className="anim-item relative flex items-center gap-3 overflow-hidden rounded-xl bg-brand-950 p-3 pr-12 shadow-card">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(220px_90px_at_15%_0%,rgba(106,82,212,0.35),transparent_70%)]" />
      <EmojiTile
        emoji={item.emoji}
        accent={item.accent}
        shape="rounded"
        className="relative"
      />
      <div className="relative min-w-0">
        <p className="truncate text-[13px] font-semibold text-white">
          {item.title}
        </p>
        <p className="text-[11px] font-medium text-white/50">{item.traders}</p>
      </div>
      <span className="absolute top-2.5 right-2.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
        LIVE
      </span>
    </div>
  );
});

/** Glanceable strip of events happening right now. */
export function LiveNowStrip({ items }: LiveNowStripProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="Live Now"
        actionLabel="View all"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <LiveEventCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
