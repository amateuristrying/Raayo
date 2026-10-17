import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DiscoveryResult } from "@/components/common/DiscoveryResult";
import { browseAll } from "@/engine/search";
import { bookmarksStore } from "@/engine/bookmarks";
import { followsStore } from "@/engine/follows";
import { useStore } from "@/engine/store";
import { usePageReveal } from "@/hooks/usePageReveal";
import type { PageMetric } from "@/types";

export function BookmarksPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveal(rootRef);
  const navigate = useNavigate();

  const bookmarks = useStore(bookmarksStore);
  const follows = useStore(followsStore);
  const saved = browseAll().filter((market) => market.type === "Market" && bookmarks.includes(market.id));

  const metrics: PageMetric[] = [
    {
      id: "saved",
      icon: "activity",
      value: String(bookmarks.length),
      label: "Saved Markets",
    },
    {
      id: "following",
      icon: "flame",
      value: String(follows.length),
      label: "Following",
    },
  ];

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-start gap-6 px-6 py-5"
    >
      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHero
          title="Bookmarks"
          subtitle="Questions worth coming back to. Your saved markets, all in one place."
          metrics={metrics}
        />

        <section>
          <SectionHeader title="Saved Markets" className="anim-rise mb-3" />
          <div className="flex flex-col gap-3">
            {saved.map((market) => (
              <DiscoveryResult key={market.id} result={market} />
            ))}
            {saved.length === 0 && (
              <Card className="anim-item flex flex-col items-center gap-3 p-10 text-center">
                <p className="text-sm text-slate-400">
                  Nothing saved yet — tap the bookmark icon on any market.
                </p>
                <Button size="sm" onClick={() => navigate("/search?type=Market")}>
                  Browse trending markets
                </Button>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
