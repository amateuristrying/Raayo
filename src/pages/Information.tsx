import { useRef } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { usePageReveal } from "@/hooks/usePageReveal";

const updates = [
  [
    "A brighter first impression",
    "The sphere landing page now starts in light mode. Switch between day and night beside RAAYO; your choice is remembered. White footer text floats directly over the spheres, with no background strip.",
  ],
  [
    "Find your next question",
    "Search across markets, events, entities and categories, with filters and a closer look at each result.",
  ],
  [
    "A view that is yours",
    "Follow events and entities in Watchlist, save markets to Bookmarks, and track predictions, point activity and submitted markets in Portfolio.",
  ],
  [
    "A calmer way to explore",
    "Clearer page introductions, responsive navigation and scroll reveals that respect reduced-motion preferences.",
  ],
];
const lessons = [
  [
    "Start with the event",
    "Explore a real-world event, understand its context, then look at the questions people are forecasting.",
  ],
  [
    "Read the probability",
    "A 70% Yes probability describes the market's current estimate. It is a forecast, not a guarantee, and can change as new information arrives.",
  ],
  [
    "Practice with points",
    "This preview uses virtual points. Choose Yes or No, review the points committed and potential payout, then track your prediction in Portfolio.",
  ],
  [
    "Know what settles the question",
    "A live market needs a precise question, a deadline and an authoritative resolution source. Evidence and a review process determine its final outcome.",
  ],
];
export function InformationPage({ kind }: { kind: "changelog" | "learn" }) {
  const root = useRef<HTMLDivElement>(null);
  usePageReveal(root);
  return (
    <div ref={root} className="app-page min-w-0 flex-1 px-6 py-5">
      <main className="mx-auto flex max-w-3xl flex-col gap-6">
        <PageHero
          title={
            kind === "changelog"
              ? "Changelog"
              : "A clearer view of what comes next"
          }
          subtitle={
            kind === "changelog"
              ? "Version 1.1.0 · 18 October 2026"
              : "How to explore Raayo and make your first forecast."
          }
          metrics={[]}
        />
        {(kind === "changelog" ? updates : lessons).map(([title, body]) => (
          <section
            key={title}
            className="anim-rise border-b border-slate-200 py-5"
          >
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
          </section>
        ))}
        <Link to="/dashboard" className="text-sm font-semibold text-brand-700">
          Explore today's pulse
        </Link>
      </main>
    </div>
  );
}
