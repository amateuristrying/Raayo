import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/cn";
import { TrendDelta } from "@/components/ui/TrendDelta";
import type { TickerDot, TickerItem } from "@/types";

interface LiveTickerProps {
  items: TickerItem[];
}

const dotClasses: Record<TickerDot, string> = {
  green: "bg-emerald-500",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
  blue: "bg-sky-500",
};

function TickerEntry({ item }: { item: TickerItem }) {
  return (
    <span className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-slate-700">
      <span className={cn("size-1.5 rounded-full", dotClasses[item.dot])} />
      {item.text}
      {item.delta && <TrendDelta delta={item.delta} className="text-xs" />}
    </span>
  );
}

/** Slim strip under the navbar with slowly scrolling market updates. */
export function LiveTicker({ items }: LiveTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      duration: 45,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div
      className="flex h-11 items-center gap-4 overflow-hidden rounded-full border border-slate-200/80 bg-white px-4 shadow-card"
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.resume()}
    >
      <span className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-wide text-red-600 uppercase">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-red-500" />
        </span>
        Live Now
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div ref={trackRef} className="flex w-max items-center">
          {/* Track is duplicated for a seamless loop. */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center gap-10 pr-10"
            >
              {items.map((item) => (
                <TickerEntry key={`${copy}-${item.id}`} item={item} />
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
      </div>
    </div>
  );
}
