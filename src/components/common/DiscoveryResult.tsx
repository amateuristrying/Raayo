import { useState } from "react";
import { ArrowUpRight, Bookmark, Check, Plus, TrendingUp } from "lucide-react";
import { eventClusters, eventsPageData, exploreData } from "@/data";
import { bookmarksStore, toggleBookmark } from "@/engine/bookmarks";
import { followsStore, toggleFollow } from "@/engine/follows";
import { clusterMarketId, marketsStore } from "@/engine/markets";
import { followKey, type SearchResult } from "@/engine/search";
import { useStore } from "@/engine/store";
import { openPrediction } from "@/engine/ui";
import { Button } from "@/components/ui/Button";
import { Modal } from "./Modal";

export function DiscoveryResult({ result }: { result: SearchResult }) {
  const [open, setOpen] = useState(false);
  const follows = useStore(followsStore);
  const bookmarks = useStore(bookmarksStore);
  const markets = useStore(marketsStore);
  const key = followKey(result);
  const saved =
    result.type === "Market"
      ? bookmarks.includes(result.id)
      : follows.includes(key);
  const cluster = eventClusters.find((event) => event.id === result.id);
  const event = eventsPageData.featured.find((item) => item.id === key);
  const entityEvents =
    result.type === "Entity"
      ? eventsPageData.featured.filter((item) =>
          item.entities.some(
            (entity) =>
              entity.name.toLowerCase() === result.title.toLowerCase(),
          ),
        )
      : [];
  const category =
    result.type === "Category"
      ? exploreData.categories.find((item) => item.name === result.title)
      : undefined;
  const relatedIds = cluster
    ? cluster.markets.map((market) => clusterMarketId(cluster.id, market.title))
    : event
      ? [`${event.id}--top`]
      : entityEvents.map((item) => `${item.id}--top`);
  const related = Object.values(markets).filter(
    (market) =>
      relatedIds.includes(market.id) ||
      (result.type === "Category" &&
        market.category?.toLowerCase() === result.title.toLowerCase()),
  );
  return (
    <>
      <article className="discovery-result anim-item flex items-center gap-3 border-b border-slate-200 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xl text-brand-600">
          {result.emoji || <TrendingUp className="size-5" />}
        </span>
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setOpen(true)}
        >
          <span className="text-[10px] font-semibold uppercase text-slate-500">
            {result.type}
          </span>
          <span className="block text-sm font-semibold text-slate-900">
            {result.title}
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            {result.subtitle}
          </span>
        </button>
        {result.type === "Market" && (
          <span className="text-lg font-bold">
            {markets[result.id]?.probability ?? result.probability}%
          </span>
        )}
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-brand-700 hover:bg-brand-50"
          aria-label={`${saved ? "Remove" : result.type === "Market" ? "Bookmark" : "Follow"} ${result.title}`}
          aria-pressed={saved}
          onClick={() =>
            result.type === "Market"
              ? toggleBookmark(result.id)
              : toggleFollow(key)
          }
        >
          {result.type === "Market" ? (
            <Bookmark className={saved ? "size-4 fill-current" : "size-4"} />
          ) : saved ? (
            <Check className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
        </button>
      </article>
      <Modal open={open} onClose={() => setOpen(false)} label={result.type}>
        <h2 className="mt-4 text-xl font-bold">{result.title}</h2>
        <p className="mt-2 text-sm text-slate-500">{result.subtitle}</p>
        {category && (
          <p className="mt-4 text-sm text-slate-600">
            Topics: {category.topics.join(", ")}
          </p>
        )}
        {event && (
          <p className="mt-4 text-sm text-slate-600">
            Related entities:{" "}
            {event.entities.map((entity) => entity.name).join(", ")}
          </p>
        )}
        {result.type === "Market" ? (
          <div className="mt-5">
            <p className="text-3xl font-bold text-brand-700">
              {markets[result.id]?.probability ?? result.probability}%{" "}
              <span className="text-sm font-medium text-slate-500">
                Yes probability
              </span>
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Demo market. Predictions use virtual points.
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                setOpen(false);
                openPrediction({
                  id: result.id,
                  title: result.title,
                  probability:
                    markets[result.id]?.probability ?? result.probability ?? 50,
                });
              }}
            >
              Make a prediction <ArrowUpRight className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase text-slate-500">
              Connected markets
            </h3>
            {related.length ? (
              related.map((market) => (
                <button
                  type="button"
                  key={market.id}
                  className="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left text-sm"
                  onClick={() => {
                    setOpen(false);
                    openPrediction(market);
                  }}
                >
                  <span>{market.title}</span>
                  <strong>{market.probability}%</strong>
                </button>
              ))
            ) : (
              <p className="py-3 text-sm text-slate-500">
                No connected markets in the current preview.
              </p>
            )}
            <Button
              className="mt-4"
              variant="soft"
              onClick={() => toggleFollow(key)}
            >
              {saved ? "Following" : "Follow"}
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
