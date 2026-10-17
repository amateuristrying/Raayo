import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { DiscoveryResult } from "@/components/common/DiscoveryResult";
import { followsStore } from "@/engine/follows";
import { browseAll, followKey } from "@/engine/search";
import { useStore } from "@/engine/store";
import { usePageReveal } from "@/hooks/usePageReveal";

export function WatchlistPage() {
  const root = useRef<HTMLDivElement>(null);
  usePageReveal(root);
  const follows = useStore(followsStore);
  const [type, setType] = useState("All");
  const catalog = browseAll().filter((item) => item.type !== "Market");
  const followed = catalog.filter((item) => follows.includes(followKey(item)));
  const visible = followed.filter(
    (item) => type === "All" || item.type === type,
  );
  return (
    <div ref={root} className="app-page min-w-0 flex-1 px-6 py-5">
      <main className="mx-auto flex max-w-5xl flex-col gap-6">
        <PageHero
          title="Watchlist"
          subtitle="The people, events and topics you want to keep in view."
          metrics={[
            {
              id: "following",
              icon: "activity",
              value: String(followed.length),
              label: "Following",
            },
          ]}
        />
        <div className="flex gap-2">
          {["All", "Event", "Entity", "Category"].map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={type === item}
              onClick={() => setType(item)}
              className={`rounded-lg px-3 py-2 text-sm ${type === item ? "bg-brand-700 text-white" : "bg-white text-slate-600"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <section>
          {visible.map((item) => (
            <DiscoveryResult key={item.id} result={item} />
          ))}
          {!visible.length && (
            <div className="py-10 text-center">
              <h2 className="text-lg font-semibold">
                {followed.length
                  ? "Nothing in this view yet"
                  : "Build your own view of India"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Follow an event, person or topic to keep it here.
              </p>
              <Link
                to="/search"
                className="mt-4 inline-block text-sm font-semibold text-brand-700"
              >
                Discover something to follow
              </Link>
            </div>
          )}
        </section>
        <section>
          <h2 className="text-sm font-semibold">Worth following</h2>
          {catalog
            .filter((item) => !follows.includes(followKey(item)))
            .slice(0, 6)
            .map((item) => (
              <DiscoveryResult key={item.id} result={item} />
            ))}
        </section>
      </main>
    </div>
  );
}
