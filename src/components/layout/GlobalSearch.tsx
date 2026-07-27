import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";
import { exploreData } from "@/data";
import { searchAll, type SearchResult } from "@/engine/search";
import { openPrediction } from "@/engine/ui";
import { useClickOutside } from "@/hooks/useClickOutside";

const typeRoutes: Record<Exclude<SearchResult["type"], "Market">, string> = {
  Event: "/events",
  Entity: "/explore",
  Category: "/categories",
};

function ResultRow({
  result,
  onSelect,
}: {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(result)}
      className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-slate-50"
    >
      <span className="text-base" aria-hidden>
        {result.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-slate-800">
          {result.title}
        </span>
        {result.subtitle && (
          <span className="block truncate text-[11px] text-slate-400">
            {result.subtitle}
          </span>
        )}
      </span>
      <span className="shrink-0 text-[9px] font-bold tracking-wide text-slate-300 uppercase">
        {result.type}
      </span>
    </button>
  );
}

/** Working global search: "/" to focus, live results, Enter picks the top hit. */
export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useClickOutside(containerRef, () => setOpen(false), open);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => searchAll(query), [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const choose = (result: SearchResult) => {
    close();
    if (result.type === "Market") {
      openPrediction({
        id: result.id,
        title: result.title,
        category: result.subtitle,
        probability: result.probability ?? 50,
      });
    } else {
      navigate(typeRoutes[result.type]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex h-10 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 transition-all focus-within:border-brand-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
        <Search className="size-4 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
            if (event.key === "Enter" && results[0]) choose(results[0]);
          }}
          placeholder="Search markets, events, people, companies, teams..."
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
          /
        </kbd>
      </div>

      {open && (
        <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-2 shadow-card-hover">
          {query.trim() === "" ? (
            <>
              <p className="flex items-center gap-1.5 px-3.5 pt-1 pb-1.5 text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                <TrendingUp className="size-3" />
                Trending Searches
              </p>
              {exploreData.trendingSearches.slice(0, 6).map((search) => (
                <button
                  key={search.id}
                  type="button"
                  onClick={() => setQuery(search.label)}
                  className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <span aria-hidden>{search.emoji}</span>
                  {search.label}
                </button>
              ))}
            </>
          ) : results.length > 0 ? (
            results.map((result) => (
              <ResultRow key={result.id} result={result} onSelect={choose} />
            ))
          ) : (
            <p className="px-3.5 py-5 text-center text-[13px] text-slate-400">
              No matches for “{query.trim()}”
            </p>
          )}
        </div>
      )}
    </div>
  );
}
