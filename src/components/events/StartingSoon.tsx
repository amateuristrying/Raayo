import { memo } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { EmojiTile } from "@/components/ui/EmojiTile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CountdownEventData } from "@/types";

interface StartingSoonProps {
  items: CountdownEventData[];
}

const CountdownCard = memo(function CountdownCard({
  item,
}: {
  item: CountdownEventData;
}) {
  return (
    <Card className="anim-item p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex shrink-0">
          {item.tiles.map((tile, index) => (
            <EmojiTile
              key={index}
              emoji={tile.emoji}
              accent={tile.accent}
              size="sm"
              className={cn("ring-2 ring-white", index > 0 && "-ml-2.5")}
            />
          ))}
        </span>
        <h3 className="truncate text-[13px] font-bold text-slate-900">
          {item.title}
        </h3>
      </div>
      <p className="mt-3 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        Starts in
      </p>
      <p className="mt-0.5 text-[22px] leading-tight font-bold text-brand-700">
        {item.countdown}
      </p>
      <p className="mt-1 text-[11px] font-medium text-slate-400">
        {item.time}
        <span className="mx-1">·</span>
        {item.location}
      </p>
      <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-[11px] font-medium text-slate-500">
        {item.traders}
      </p>
    </Card>
  );
});

/** Countdown cards for events about to begin. */
export function StartingSoon({ items }: StartingSoonProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="Starting Soon"
        actionLabel="View all"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <CountdownCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
