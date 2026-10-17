# Raayo — Frontend Architecture

Raayo is an event-first prediction intelligence platform. The core information
hierarchy is:

```
Category → Events → Entities → Markets → Predictions
```

This is the intended domain model. Current fixtures only partially encode
these links; `LiveMarket` does not yet require event ownership. See
`BACKEND_PLAN.md` for the verified implementation gaps and delivery plan.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (CSS-based config in `src/index.css` — design tokens live in
  the `@theme` block: brand palette, surface color, shadows, font stack)
- GSAP for entrance choreography (`src/hooks/usePageReveal.ts`)
- Recharts for charts (hero area chart, sparklines)
- React Router v7 (`src/App.tsx` routes inside `AppLayout`)

## Directory map

```
src/
  components/
    ui/          Design-system primitives (Card, Button, TrendDelta, EmojiTile…)
    common/      Cross-page composites (PageHero, Modal, PredictionModal…)
    layout/      App chrome (Navbar + menus, Sidebar, AppLayout, LiveTicker)
    markets/     Market surfaces shared across pages (rows, clusters, pills)
    home|explore|events|categories/  Page-specific sections
    rail/        Right-sidebar panels per page
  pages/         Route components (Home, Explore, Events, Categories,
                 Portfolio, Search, Watchlist, Bookmarks, Information)
  data/          Mock JSON + typed exports (src/data/index.ts is the single
                 cast boundary)
  engine/        Client-side stand-ins for the backend engines (see below)
  hooks/         usePageReveal (GSAP), useClickOutside
  lib/           cn, accents (gradient/soft palettes), heatmap scale
  types/         All domain types
```

## The engine layer (`src/engine/`)

Each module mirrors a future backend engine. Components never touch
`localStorage` or business rules directly — they call engine functions and
subscribe via `useStore()`. These are synchronous demo stores. API integration
will also require explicit async states, authorization and server validation.

| Module            | Future engine        | State (persist key)                  |
| ----------------- | -------------------- | ------------------------------------ |
| `store.ts`        | —                    | Observable store + `useStore()` hook |
| `wallet.ts`       | Wallet Engine        | Points balance + ledger (`raayo:wallet`) |
| `markets.ts`      | Market + Pricing     | Live probability registry, price impact, simulation tick (session-only) |
| `predictions.ts`  | Matching Engine      | Positions, share pricing, payout math (`raayo:predictions`) |
| `userMarkets.ts`  | Market Engine (create/review) | Drafts with resolution source (`raayo:my-markets`) |
| `bookmarks.ts`    | —                    | Saved market ids (`raayo:bookmarks`) |
| `follows.ts`      | Entity Engine        | Followed entity/event ids (`raayo:follows`) |
| `notifications.ts`| Notification Engine  | Feed + unread count (`raayo:notifications`) |
| `search.ts`       | Search Engine        | In-memory index over all mock data   |
| `toasts.ts` / `ui.ts` | —                | Ephemeral UI state (toasts, modals)  |

Current demo behavior:

- **Local points wallet.** A mutable balance and 30 recent transactions are
  persisted. This is not an accounting ledger or a real-money payment system.
- **Illustrative pricing.** `sharePrice()` / `potentialPayout()` use the shown
  probability. There is no LMSR inventory, cost function or liquidity accounting.
- **Resolution source is required at market creation.** The create-market flow
  captures an authoritative source (ICC, RBI, ECI…) — the contract the
  Resolution Engine verifies against.
- **Simulation is separated.** `startMarketSimulation()` is the client-side
  seed of the AI Simulation Engine idea: a random walk that keeps
  probabilities, deltas and sparklines alive. Kill one call in `AppLayout` to
  disable it.

## Animation system

`usePageReveal(rootRef)` runs a page's entrance timeline over opt-in class
names (`anim-hero`, `anim-metric`, `anim-rise`, `anim-chip`, `anim-item`,
`anim-rail > *`). Rules learned the hard way:

- Always `fromTo` with explicit end values — `from()` can capture a hidden
  state under StrictMode double-effects and leave elements invisible.
- `clearProps: "all"` after each tween so GSAP's inline styles don't override
  Tailwind hover transforms.
- `lazy: false` + a `visibilitychange` guard so background tabs land on the
  finished state.

## What is real vs. mocked

Functional today (client-side): predictions with points + price impact,
wallet ledger, bookmarks, follows, notifications, global search ("/" to
focus), market creation drafts, category filtering, live probability drift,
Portfolio and Bookmarks pages. All persisted state lives under `raayo:*`
localStorage keys — clear them to reset the demo account.

Static content: all discovery data in `src/data/*.json` (markets, events,
entities, categories, rails). These JSON files define the shapes the Event,
Entity and Timeline engines should serve.

## Suggested API surface for the truth engine

The frontend needs only a handful of endpoints to replace the mock layer:

```
GET  /feed/home            → HomeData          (src/types: HomeData)
GET  /feed/explore         → ExploreData
GET  /feed/events          → EventsData
GET  /feed/categories      → CategoriesData
GET  /markets/:id/quote?side=yes&stake=250   → { price, shares, payout }
POST /predictions          { marketId, side, stake }
GET  /portfolio            → { balance, transactions, positions }
POST /markets              { question, category, event, closesOn, resolutionSource }
GET  /search?q=            → SearchResult[]
GET  /notifications        / POST /notifications/read-all
WS   /live                 → probability ticks { marketId, probability }
```

Types in `src/types/index.ts` are the source of truth for these payloads.
