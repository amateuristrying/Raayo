import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { DiscoveryResult } from "@/components/common/DiscoveryResult";
import { browseAll, searchAll } from "@/engine/search";
import { usePageReveal } from "@/hooks/usePageReveal";

export function SearchPage() {
  const root = useRef<HTMLDivElement>(null);
  usePageReveal(root);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const type = params.get("type") ?? "All";
  const results = (query.trim() ? searchAll(query, 200) : browseAll()).filter(
    (item) => type === "All" || item.type === type,
  );
  const update = (key: string, value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  return (
    <div ref={root} className="app-page min-w-0 flex-1 px-6 py-5">
      <main className="mx-auto flex max-w-5xl flex-col gap-6">
        <PageHero
          title="Search"
          subtitle="Follow a question. Find its context."
          metrics={[]}
        />
        <div className="anim-rise flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <Search className="size-5 text-slate-400" />
          <input
            aria-label="Search Raayo"
            type="search"
            placeholder="Search markets, events, people or categories"
            value={query}
            onChange={(e) => update("q", e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => update("q", "")}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Result type">
          {["All", "Market", "Event", "Entity", "Category"].map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={type === item}
              onClick={() => update("type", item)}
              className={`rounded-lg px-3 py-2 text-sm ${type === item ? "bg-brand-700 text-white" : "bg-white text-slate-600"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <section>
          <p className="text-xs text-slate-500" role="status">
            {results.length} results{query && ` for "${query}"`}
          </p>
          {results.map((item) => (
            <DiscoveryResult key={item.id} result={item} />
          ))}
          {!results.length && (
            <p className="py-12 text-center text-sm text-slate-500">
              No matches. Try a person, event name or broader topic.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
